import { ref } from 'vue'
export function useUiPreview() {
  const override = ref(null) // 'mobile' | 'desktop' | null
  const isMobile = () => override.value === 'mobile' || (override.value === null && window.matchMedia('(max-width: 1023px)').matches)
  const classes = () => ({ 'ui-mobile': isMobile(), 'ui-desktop': !isMobile() })
  return { override, isMobile, classes }
}
