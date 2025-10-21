import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Composable for detecting device types, capabilities, and characteristics
 * Provides reactive device information for adaptive UI rendering
 */
export function useDeviceDetection() {
  // Reactive state
  const screenWidth = ref(0)
  const screenHeight = ref(0)
  const userAgent = ref('')
  const touchSupport = ref(false)
  const orientation = ref('portrait')
  const pixelRatio = ref(1)
  
  // Update screen dimensions
  const updateScreenSize = () => {
    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight
    orientation.value = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    pixelRatio.value = window.devicePixelRatio || 1
  }
  
  // Device type detection based on screen size and user agent
  const isMobileDevice = computed(() => {
    // Primary check: screen width
    if (screenWidth.value <= 767) return true
    
    // Secondary check: user agent for mobile devices
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    return mobileRegex.test(userAgent.value)
  })
  
  const isTabletDevice = computed(() => {
    // Tablet range: 768px to 1023px
    if (screenWidth.value >= 768 && screenWidth.value <= 1023) {
      return true
    }
    
    // iPad specific detection
    const iPadRegex = /iPad/i
    if (iPadRegex.test(userAgent.value)) return true
    
    // Android tablet detection (no "Mobile" in user agent)
    const androidRegex = /Android/i
    const mobileRegex = /Mobile/i
    if (androidRegex.test(userAgent.value) && !mobileRegex.test(userAgent.value)) {
      return true
    }
    
    return false
  })
  
  const isDesktopDevice = computed(() => {
    return screenWidth.value >= 1024 && !isMobileDevice.value && !isTabletDevice.value
  })
  
  // Touch support detection
  const hasTouchSupport = computed(() => {
    return touchSupport.value || 
           'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           navigator.msMaxTouchPoints > 0
  })
  
  // Device capabilities
  const hasNotch = computed(() => {
    // Check for safe area insets (indicates notched device)
    const safeAreaTop = getComputedStyle(document.documentElement)
      .getPropertyValue('--safe-area-inset-top')
    return safeAreaTop && safeAreaTop !== '0px'
  })
  
  const isHighDensityScreen = computed(() => {
    return pixelRatio.value >= 2
  })
  
  const isLandscape = computed(() => {
    return orientation.value === 'landscape'
  })
  
  const isPortrait = computed(() => {
    return orientation.value === 'portrait'
  })
  
  // Device classification for styling
  const deviceType = computed(() => {
    if (isMobileDevice.value) return 'mobile'
    if (isTabletDevice.value) return 'tablet'
    if (isDesktopDevice.value) return 'desktop'
    return 'unknown'
  })
  
  const deviceClass = computed(() => {
    const classes = []
    
    classes.push(`device-${deviceType.value}`)
    classes.push(`orientation-${orientation.value}`)
    
    if (hasTouchSupport.value) classes.push('touch-capable')
    if (hasNotch.value) classes.push('has-notch')
    if (isHighDensityScreen.value) classes.push('high-density')
    
    return classes.join(' ')
  })
  
  // Operating system detection
  const operatingSystem = computed(() => {
    const ua = userAgent.value
    
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
    if (/Android/i.test(ua)) return 'android'
    if (/Windows/i.test(ua)) return 'windows'
    if (/Mac/i.test(ua)) return 'macos'
    if (/Linux/i.test(ua)) return 'linux'
    
    return 'unknown'
  })
  
  // Browser detection
  const browser = computed(() => {
    const ua = userAgent.value
    
    if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) return 'chrome'
    if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'safari'
    if (/Firefox/i.test(ua)) return 'firefox'
    if (/Edge/i.test(ua)) return 'edge'
    if (/Opera/i.test(ua)) return 'opera'
    
    return 'unknown'
  })
  
  // Performance indicators
  const isLowEndDevice = computed(() => {
    // Heuristic for low-end device detection
    const hardwareConcurrency = navigator.hardwareConcurrency || 1
    const memory = navigator.deviceMemory || 1
    
    // Consider low-end if < 2 CPU cores or < 2GB RAM
    return hardwareConcurrency < 2 || memory < 2
  })
  
  // Network information (if available)
  const networkInfo = computed(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      return {
        effectiveType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
        saveData: connection?.saveData || false
      }
    }
    return null
  })
  
  const isSlowNetwork = computed(() => {
    if (!networkInfo.value) return false
    return networkInfo.value.effectiveType === 'slow-2g' || 
           networkInfo.value.effectiveType === '2g' ||
           networkInfo.value.saveData
  })
  
  // Accessibility features
  const prefersReducedMotion = computed(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  
  const prefersHighContrast = computed(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-contrast: high)').matches
  })
  
  const prefersDarkMode = computed(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  
  // Utility functions
  const isMobile = () => isMobileDevice.value
  const isTablet = () => isTabletDevice.value
  const isDesktop = () => isDesktopDevice.value
  
  const supportsHover = computed(() => {
    return window.matchMedia('(hover: hover)').matches
  })
  
  const supportsFinePointer = computed(() => {
    return window.matchMedia('(pointer: fine)').matches
  })
  
  // Event handlers
  const handleResize = () => {
    updateScreenSize()
  }
  
  const handleOrientationChange = () => {
    // Small delay to ensure dimensions are updated
    setTimeout(updateScreenSize, 100)
  }
  
  // Lifecycle
  onMounted(() => {
    // Initialize values
    userAgent.value = navigator.userAgent
    touchSupport.value = 'ontouchstart' in window
    updateScreenSize()
    
    // Event listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)
    
    // Listen for media query changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    // Note: These will be reactive through the computed properties
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('orientationchange', handleOrientationChange)
  })
  
  return {
    // Device type
    isMobileDevice,
    isTabletDevice,
    isDesktopDevice,
    deviceType,
    deviceClass,
    
    // Capabilities
    hasTouchSupport,
    hasNotch,
    isHighDensityScreen,
    supportsHover,
    supportsFinePointer,
    
    // Orientation
    orientation,
    isLandscape,
    isPortrait,
    
    // Screen info
    screenWidth,
    screenHeight,
    pixelRatio,
    
    // System info
    operatingSystem,
    browser,
    userAgent,
    
    // Performance
    isLowEndDevice,
    networkInfo,
    isSlowNetwork,
    
    // Accessibility
    prefersReducedMotion,
    prefersHighContrast,
    prefersDarkMode,
    
    // Utility functions
    isMobile,
    isTablet,
    isDesktop
  }
}