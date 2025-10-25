# Aura Admin Panel - New UI

A modern, responsive admin panel built with Vue 3, Tailwind CSS, and best practices for reusable component architecture.

## Features

### 🎨 Modern Design System
- **Tailwind CSS** with custom design tokens
- **Inter & Poppins** fonts for professional typography
- **Consistent color palette** with primary, secondary, and accent colors
- **Responsive breakpoints** for mobile, tablet, and desktop
- **Custom animations** and transitions

### 🧩 Reusable Components

#### Base Components
- `BaseButton` - Multiple variants (primary, secondary, ghost, danger)
- `BaseInput` - With icons, validation, and different sizes
- `BaseCard` - Flexible container with variants and slots
- `BaseBadge` - Status indicators with color variants
- `BaseIcon` - Heroicons integration with size and color props
- `BaseSelect` - Enhanced dropdown with styling
- `BaseModal` - Responsive modal with customizable sizes
- `BaseTooltip` - Hover tooltips with positioning

#### Layout Components
- `AdminLayout` - Main application layout wrapper
- `AdminSidebar` - Collapsible navigation with sections
- `AdminNavbar` - Top navigation with search and user menu
- `UserMenu` - Dropdown user menu with profile options

#### Dashboard Components
- `MetricCard` - Key performance indicator cards with trends
- `ChartCard` - Chart.js wrapper with filter tabs
- `PlatformItem` - Platform performance list items
- `ListItem` - Flexible list item with avatar, metrics, and actions

### 📊 Dashboard Features
- **Revenue Overview** - Main revenue metrics with trend indicators
- **Sales Analytics** - Interactive charts with multiple data views
- **Platform Performance** - Individual platform tracking (Dribbble, Instagram, etc.)
- **Team Performance** - Top performers with individual metrics
- **Responsive Design** - Optimized for all screen sizes

### 🔧 Technical Stack
- **Vue 3** with Composition API
- **Vue Router 4** for navigation
- **Tailwind CSS** for styling
- **Heroicons** for icons
- **Chart.js** with Vue wrapper for data visualization
- **Headless UI** for accessible components
- **Vite** for fast development and building

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd metainflu/adminpanel/frontend/admin-new-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── base/              # Reusable base components
│   ├── dashboard/         # Dashboard-specific components
│   └── layout/           # Layout components
├── layouts/              # Page layouts
├── pages/               # Vue pages/views
├── router/             # Vue Router configuration
├── services/          # API services
├── App.vue           # Root component
├── main.js          # Application entry point
└── index.css       # Global styles and Tailwind imports
```

## Component Usage Examples

### BaseButton
```vue
<BaseButton variant="primary" icon="plus" @click="createNew">
  Create New
</BaseButton>

<BaseButton variant="ghost" icon-only icon="settings" />
```

### BaseInput
```vue
<BaseInput
  v-model="email"
  type="email"
  label="Email Address"
  placeholder="Enter your email"
  left-icon="envelope"
  :error="emailError"
  required
/>
```

### MetricCard
```vue
<MetricCard
  label="Revenue"
  :value="528976"
  currency
  icon="trending-up"
  icon-color="success"
  :trend="{ type: 'up', value: '7.9%', period: 'vs last month' }"
/>
```

### ChartCard
```vue
<ChartCard
  title="Sales Analytics"
  type="line"
  :chart-data="salesData"
  :filters="chartFilters"
  @filter-change="handleFilterChange"
/>
```

## Customization

### Colors
Update `tailwind.config.js` to modify the color palette:

```javascript
colors: {
  primary: {
    50: '#fdf2f8',
    500: '#ec4899',  // Main brand color
    900: '#831843',
  }
}
```

### Typography
Fonts are defined in the Tailwind config and loaded from Google Fonts:

```javascript
fontFamily: {
  'sans': ['Inter', 'system-ui', 'sans-serif'],
  'display': ['Poppins', 'system-ui', 'sans-serif'],
}
```

### Components
All components accept props for customization:

- **Variants**: Different visual styles (primary, secondary, ghost, etc.)
- **Sizes**: Multiple size options (xs, sm, md, lg, xl)
- **Colors**: Icon and background color options
- **States**: Loading, disabled, error states

## Responsive Design

The admin panel is fully responsive with breakpoints:

- **Mobile**: < 768px (collapsed sidebar, stacked layout)
- **Tablet**: 768px - 1024px (adaptive grid, condensed navigation)
- **Desktop**: > 1024px (full layout, expanded sidebar)

## Performance

- **Lazy loading** for route components
- **Tree shaking** with ES modules
- **Optimized assets** with Vite
- **Minimal bundle size** with selective imports

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the established component patterns
2. Use TypeScript for new components (optional)
3. Ensure responsive design
4. Test across different screen sizes
5. Maintain consistent styling with the design system

## License

This project is part of the Aura Shop ecosystem.
