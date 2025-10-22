# Capacitor Android Troubleshooting and Implementation Guide

## Problem Identification

The **blank screen issue** in the Android Capacitor build was caused by several configuration problems:

1. **JavaScript Runtime Error**: `TypeError: u.then is not a function` in the minified bundle
2. **Missing Asset Files**: Vite assets not properly copied to Capacitor's expected directory
3. **Router Initialization**: Vue Router mounting before being ready
4. **Build Configuration**: Incorrect base path and output directory settings

## Root Causes

### 1. Vite Configuration Issues
- Missing `defineConfig` import in `vite.config.js`
- Incorrect `base` path for Capacitor builds
- Missing explicit `outDir` configuration

### 2. Capacitor Configuration Issues
- `webDir` pointing to wrong directory (`www` instead of `dist`)
- Missing `bundledWebRuntime` configuration

### 3. Vue Router Issues
- Using `createMemoryHistory()` instead of `createWebHashHistory()`
- App mounting before router readiness

## Solutions Implemented

### 1. Fixed `vite.config.js`
```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: './',  // Relative paths for Capacitor
  build: {
    outDir: 'dist'  // Explicit output directory
  }
});
```

### 2. Updated `capacitor.config.json`
```json
{
  "appId": "com.aurashop.app",
  "appName": "Aura Shop",
  "webDir": "dist",  // Points to Vite's output directory
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  }
}
```

### 3. Fixed Vue Router (`src/router/index.js`)
```js
// Changed from createMemoryHistory to createWebHashHistory
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),  // Better for Capacitor WebView
  routes,
});
```

### 4. Fixed App Initialization (`src/main.js`)
```js
// Wait for router to be ready before mounting
router.isReady().then(() => {
  app.mount('#app')
}).catch(error => {
  console.error('Router initialization failed:', error)
  // Fallback: mount anyway
  app.mount('#app')
})
```

## Build and Deployment Steps

### 1. Build the Web Application
```bash
cd metainflu/frontend/client-app
npm run build
```

### 2. Copy Assets to Android
```bash
npx cap copy android
npx cap sync android
```

### 3. Open in Android Studio
```bash
npx cap open android
```

### 4. Build and Run
- Clean and rebuild project in Android Studio
- Install on device or emulator

## Verification Steps

1. **Check Build Output**: Ensure `dist/` directory contains `index.html` and assets
2. **Verify Capacitor Config**: Run `npx cap doctor` to check configuration
3. **Test in Browser**: Test the built app with `npx serve dist` before deploying
4. **Check Android Logs**: Use `adb logcat` to monitor for JavaScript errors

## Common Issues and Solutions

### Issue: "Could not find web assets directory"
**Solution**: Ensure `webDir` in `capacitor.config.json` matches your build output directory.

### Issue: "TypeError: u.then is not a function"
**Solution**: 
- Use `router.isReady()` before mounting
- Switch to `createWebHashHistory()`
- Ensure proper async/await patterns

### Issue: Assets not loading (404 errors)
**Solution**: 
- Set `base: './'` in `vite.config.js`
- Verify assets are copied with `npx cap copy`

### Issue: Blank screen but no errors
**Solution**: 
- Check browser developer tools in the WebView
- Verify all Vue components are properly imported
- Test router navigation manually

## Performance Optimizations

1. **Enable Code Splitting**: Vite automatically splits large bundles
2. **Optimize Images**: Use appropriate formats and sizes for mobile
3. **Minimize Dependencies**: Remove unused packages to reduce bundle size
4. **Enable Compression**: Configure server compression for assets

## Testing Checklist

- [ ] App loads without blank screen
- [ ] Navigation between pages works
- [ ] Authentication flow functions
- [ ] API calls work properly
- [ ] Touch gestures respond correctly
- [ ] App works offline (if applicable)
- [ ] Performance is acceptable on target devices

## Troubleshooting Commands

```bash
# Check Capacitor configuration
npx cap doctor

# View detailed sync output
npx cap sync android --verbose

# Clear Capacitor cache
rm -rf android/app/src/main/assets/public
npx cap copy android

# Check Android logs
adb logcat | grep -i capacitor
```

## Additional Resources

- [Capacitor Android Troubleshooting](https://capacitorjs.com/docs/android/troubleshooting)
- [Vite Build Configuration](https://vitejs.dev/config/build-options.html)
- [Vue Router Hash Mode](https://router.vuejs.org/guide/essentials/history-mode.html#hash-mode)
- [Capacitor Configuration Reference](https://capacitorjs.com/docs/config)

---

**Last Updated**: October 22, 2025
**Status**: ✅ Issues Resolved
**Next Steps**: Deploy to production and monitor for any additional issues