# Vendor App (Vue 3)

A vendor-facing web app for managing products and orders with an iOS-like UI. Built with Vue 3, Vite, Tailwind, Pinia, and vue-router. Connects to the existing Aura Shop backend.

## Quick start

1) Backend
- Ensure your backend is running and has the vendor routes enabled
- Environment:
  - JWT_SECRET=... (same as current backend)
  - MONGO_URI=... (Atlas or local)
- Server default: http://localhost:5000

2) Vendor app
```
cd vendor-app
npm install
npm run dev
```
- Default dev URL: http://localhost:5174
- API base defaults to http://localhost:5000/api

Optional: create .env in vendor-app
```
VITE_API_BASE=http://localhost:5000/api
```

## Authentication & roles
- Login uses POST /api/auth/login (email, password)
- The returned user must have role=vendor to access /api/vendor/* endpoints
- Token and user are stored in localStorage (vendor_token, vendor_user)

## Pages
- Login: vendor sign in
- Dashboard: summary cards (sales/orders/inventory; placeholders)
- Products: list and delete (GET /vendor/products, DELETE /vendor/products/:id)
- Orders: list and mark fulfilled (GET /vendor/orders, PATCH /vendor/orders/:id)
- Profile: show current vendor info (name/email/role)

## Structure
```
vendor-app/
  index.html
  package.json
  vite.config.js
  tailwind.config.js
  postcss.config.js
  src/
    index.css
    main.js
    App.vue
    router/index.js
    services/api.js
    stores/auth.js
    pages/
      Login.vue
      Dashboard.vue
      Products.vue
      Orders.vue
      Profile.vue
```

## iOS UI notes
- Rounded cards (14px), soft shadows, iOS color palette
- Primary actions in iOS blue, destructive in red
- Sticky top nav, muted labels, compact spacing

## Roadmap
- Product create/edit with image upload
- Pagination, sorting, search for products
- Order details drawer with line items
- Charts on dashboard (sales/orders)
- Tab-bar style navigation for mobile
- Role-aware rendering (hide vendor features when not vendor)
