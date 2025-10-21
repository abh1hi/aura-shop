import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Composable for managing responsive breakpoints
 * Provides reactive breakpoint information matching Tailwind CSS breakpoints
 */
export function useResponsiveBreakpoints() {
  // Reactive screen width
  const screenWidth = ref(0)
  const screenHeight = ref(0)
  
  // Tailwind CSS breakpoints (matching our config)
  const breakpoints = {
    xs: 475,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  }
  
  // Update screen dimensions
  const updateDimensions = () => {
    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight
  }
  
  // Breakpoint detection (mobile-first approach)
  const isXs = computed(() => screenWidth.value >= breakpoints.xs)
  const isSm = computed(() => screenWidth.value >= breakpoints.sm)
  const isMd = computed(() => screenWidth.value >= breakpoints.md)
  const isLg = computed(() => screenWidth.value >= breakpoints.lg)
  const isXl = computed(() => screenWidth.value >= breakpoints.xl)
  const is2Xl = computed(() => screenWidth.value >= breakpoints['2xl'])
  
  // Exact range detection (useful for tablet-specific styles)
  const isOnlyXs = computed(() => 
    screenWidth.value >= breakpoints.xs && screenWidth.value < breakpoints.sm
  )
  const isOnlySm = computed(() => 
    screenWidth.value >= breakpoints.sm && screenWidth.value < breakpoints.md
  )
  const isOnlyMd = computed(() => 
    screenWidth.value >= breakpoints.md && screenWidth.value < breakpoints.lg
  )
  const isOnlyLg = computed(() => 
    screenWidth.value >= breakpoints.lg && screenWidth.value < breakpoints.xl
  )
  const isOnlyXl = computed(() => 
    screenWidth.value >= breakpoints.xl && screenWidth.value < breakpoints['2xl']
  )
  
  // Device category based on breakpoints
  const isMobileSize = computed(() => screenWidth.value < breakpoints.md)
  const isTabletSize = computed(() => 
    screenWidth.value >= breakpoints.md && screenWidth.value < breakpoints.lg
  )
  const isDesktopSize = computed(() => screenWidth.value >= breakpoints.lg)
  
  // Current screen size category
  const screenSize = computed(() => {
    if (screenWidth.value < breakpoints.xs) return 'xs'
    if (screenWidth.value < breakpoints.sm) return 'xs+'
    if (screenWidth.value < breakpoints.md) return 'sm'
    if (screenWidth.value < breakpoints.lg) return 'md'
    if (screenWidth.value < breakpoints.xl) return 'lg'
    if (screenWidth.value < breakpoints['2xl']) return 'xl'
    return '2xl'
  })
  
  // Screen orientation
  const isLandscape = computed(() => screenWidth.value > screenHeight.value)
  const isPortrait = computed(() => screenWidth.value <= screenHeight.value)
  
  // Aspect ratio categories
  const aspectRatio = computed(() => {
    if (screenWidth.value === 0 || screenHeight.value === 0) return 1
    return screenWidth.value / screenHeight.value
  })
  
  const isWideScreen = computed(() => aspectRatio.value > 1.5)
  const isSquareish = computed(() => 
    aspectRatio.value >= 0.8 && aspectRatio.value <= 1.2
  )
  
  // Responsive utilities
  const getBreakpointValue = (breakpointName) => {
    return breakpoints[breakpointName] || 0
  }
  
  const isAboveBreakpoint = (breakpointName) => {
    return screenWidth.value >= (breakpoints[breakpointName] || 0)
  }
  
  const isBelowBreakpoint = (breakpointName) => {
    return screenWidth.value < (breakpoints[breakpointName] || Infinity)
  }
  
  const isBetweenBreakpoints = (minBreakpoint, maxBreakpoint) => {
    const min = breakpoints[minBreakpoint] || 0
    const max = breakpoints[maxBreakpoint] || Infinity
    return screenWidth.value >= min && screenWidth.value < max
  }
  
  // Responsive classes generator
  const getResponsiveClasses = () => {
    const classes = []
    
    // Add current screen size class
    classes.push(`screen-${screenSize.value}`)
    
    // Add device category classes
    if (isMobileSize.value) classes.push('mobile-size')
    if (isTabletSize.value) classes.push('tablet-size')
    if (isDesktopSize.value) classes.push('desktop-size')
    
    // Add orientation classes
    classes.push(isLandscape.value ? 'landscape' : 'portrait')
    
    // Add aspect ratio classes
    if (isWideScreen.value) classes.push('wide-screen')
    if (isSquareish.value) classes.push('square-screen')
    
    return classes
  }
  
  // Grid columns calculator based on screen size
  const getResponsiveColumns = (config = {}) => {
    const defaults = {
      xs: 1,
      sm: 2,
      md: 2,
      lg: 3,
      xl: 4,
      '2xl': 4
    }
    
    const merged = { ...defaults, ...config }
    
    if (screenWidth.value >= breakpoints['2xl']) return merged['2xl']
    if (screenWidth.value >= breakpoints.xl) return merged.xl
    if (screenWidth.value >= breakpoints.lg) return merged.lg
    if (screenWidth.value >= breakpoints.md) return merged.md
    if (screenWidth.value >= breakpoints.sm) return merged.sm
    return merged.xs
  }
  
  // Container width calculator
  const getContainerWidth = () => {
    if (screenWidth.value >= breakpoints['2xl']) return '1536px'
    if (screenWidth.value >= breakpoints.xl) return '1280px'
    if (screenWidth.value >= breakpoints.lg) return '1024px'
    if (screenWidth.value >= breakpoints.md) return '768px'
    if (screenWidth.value >= breakpoints.sm) return '640px'
    return '100%'
  }
  
  // Responsive padding/margin calculator
  const getResponsiveSpacing = (config = {}) => {
    const defaults = {
      xs: '1rem',
      sm: '1.5rem',
      md: '2rem',
      lg: '2.5rem',
      xl: '3rem',
      '2xl': '3rem'
    }
    
    const merged = { ...defaults, ...config }
    
    if (screenWidth.value >= breakpoints['2xl']) return merged['2xl']
    if (screenWidth.value >= breakpoints.xl) return merged.xl
    if (screenWidth.value >= breakpoints.lg) return merged.lg
    if (screenWidth.value >= breakpoints.md) return merged.md
    if (screenWidth.value >= breakpoints.sm) return merged.sm
    return merged.xs
  }
  
  // Match media queries programmatically
  const matchMedia = (query) => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  }
  
  // Debounced resize handler
  let resizeTimeout
  const debouncedResize = () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(updateDimensions, 16) // ~60fps
  }
  
  // Lifecycle
  onMounted(() => {
    updateDimensions()
    window.addEventListener('resize', debouncedResize)
    window.addEventListener('orientationchange', () => {
      // Delay to ensure proper dimensions after orientation change
      setTimeout(updateDimensions, 100)
    })
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', debouncedResize)
    clearTimeout(resizeTimeout)
  })
  
  return {
    // Raw dimensions
    screenWidth,
    screenHeight,
    
    // Breakpoint flags (mobile-first)
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    
    // Exact range flags
    isOnlyXs,
    isOnlySm,
    isOnlyMd,
    isOnlyLg,
    isOnlyXl,
    
    // Device categories
    isMobileSize,
    isTabletSize,
    isDesktopSize,
    
    // Screen characteristics
    screenSize,
    isLandscape,
    isPortrait,
    aspectRatio,
    isWideScreen,
    isSquareish,
    
    // Utilities
    breakpoints,
    getBreakpointValue,
    isAboveBreakpoint,
    isBelowBreakpoint,
    isBetweenBreakpoints,
    getResponsiveClasses,
    getResponsiveColumns,
    getContainerWidth,
    getResponsiveSpacing,
    matchMedia
  }
}