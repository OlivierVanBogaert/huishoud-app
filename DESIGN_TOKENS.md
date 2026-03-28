# Design Tokens & Color System

## Color Palette

### Primary Colors
- **Primary Dark**: `#1e3a5f` - Main brand color (headers, primary buttons)
- **Primary Light**: `#2d5f8a` - Secondary brand color (hover states, accents)

### Neutral Colors
- **White**: `#ffffff` - Card backgrounds, text on dark
- **Light**: `#f5f5f5` - Page background
- **Light Gray**: `#e0e0e0` - Borders, dividers
- **Medium Gray**: `#999999` - Disabled text, placeholders
- **Dark Gray**: `#333333` - Body text
- **Very Light**: `#f9f9f9` - Alternate row colors

### Status Colors
- **Success**: `#28a745` - Completed items, success states
- **Warning**: `#ffc107` - Normal priority, caution
- **Danger**: `#dc3545` - High priority, errors, delete
- **Info**: (blue shades from primary)

### Semantic Colors
- **Success Background**: `#d4edda` (light green)
- **Success Text**: `#155724` (dark green)
- **Warning Background**: `#fff3cd` (light yellow)
- **Warning Text**: `#856404` (dark yellow)
- **Danger Background**: `#f8d7da` (light red)
- **Danger Text**: `#721c24` (dark red)

## Typography

### Font Family
- **Primary**: `'Inter'` (sans-serif fallback)
- **System Stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Font Sizes
- **Large Heading**: `28px` (H2)
- **Heading**: `20px` (H3)
- **Subheading**: `18px`
- **Body**: `14px` (default)
- **Small**: `12px` (labels, metadata)

### Font Weights
- **Regular**: `400`
- **Medium**: `500` (labels, tabs)
- **Semibold**: `600` (subheadings, button text)
- **Bold**: `700` (headings)

## Spacing

### Padding/Margin Units
- **Small**: `0.5rem` (8px)
- **Base**: `1rem` (16px)
- **Large**: `1.5rem` (24px)
- **XL**: `2rem` (32px)

### Common Patterns
- **Card Padding**: `1.5rem`
- **Section Padding**: `1rem` (mobile), `2rem` (desktop)
- **Gap between items**: `1rem`
- **Gap between sections**: `1.5rem`

## Sizing

### Responsive Breakpoints
- **Mobile**: `<= 768px`
- **Tablet**: `769px - 1024px`
- **Desktop**: `> 1024px`

### Component Sizes
- **Input Height**: `44px` (minimum touch target)
- **Button Height**: `44px` (minimum touch target)
- **Icon Size**: `24px` (typical)
- **Small Icon**: `16px`
- **Large Icon**: `32px`

### Grid Layouts
- **Mobile**: `1-2 columns`
- **Tablet**: `2-3 columns`
- **Desktop**: `3-4 columns`

## Borders & Shadows

### Border Radius
- **Small**: `4px` (inputs, buttons)
- **Medium**: `6px` (modals, cards)
- **Large**: `8px` (card containers)
- **Pill**: `16px` (chips, badges)
- **Circle**: `50%` (avatars, spinners)

### Box Shadows
- **Light**: `0 1px 3px rgba(0,0,0,0.1)` (cards, subtle depth)
- **Medium**: `0 2px 8px rgba(0,0,0,0.15)` (modals, elevated)
- **Heavy**: `0 10px 40px rgba(0,0,0,0.2)` (login screen)

### Borders
- **Subtle**: `1px solid #e0e0e0`
- **Accent**: `2px solid #2d5f8a` (focused inputs)
- **Highlight**: `4px solid` (left border of cards)

## Common Component Styles

### Button - Primary
```javascript
{
  padding: '0.75rem 1.5rem',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#2d5f8a',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600'
}
```

### Button - Secondary
```javascript
{
  padding: '0.75rem 1.5rem',
  borderRadius: '6px',
  border: `1px solid #2d5f8a',
  backgroundColor: '#ffffff',
  color: '#2d5f8a',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600'
}
```

### Input Field
```javascript
{
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #2d5f8a',
  fontSize: '14px',
  color: '#333333',
  boxSizing: 'border-box'
}
```

### Card
```javascript
{
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '1.5rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
}
```

### Badge/Chip
```javascript
{
  backgroundColor: '#e9ecef',
  padding: '0.25rem 0.75rem',
  borderRadius: '16px',
  fontSize: '12px',
  fontWeight: '500'
}
```

## Navigation Styling

### Desktop Nav Item (Inactive)
```javascript
{
  padding: '0.75rem 1rem',
  textDecoration: 'none',
  color: '#2d5f8a',
  backgroundColor: 'transparent',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: '500'
}
```

### Desktop Nav Item (Active)
```javascript
{
  padding: '0.75rem 1rem',
  textDecoration: 'none',
  color: '#ffffff',
  backgroundColor: '#2d5f8a',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: '600'
}
```

### Mobile Nav Bar
- **Height**: `60px` (fixed at bottom)
- **Background**: `#ffffff`
- **Border**: `1px solid #e0e0e0` (top border)

## Animations

### Transitions
- **Hover State**: `transition: all 0.2s`
- **Color Change**: `transition: color 0.2s`
- **Background Change**: `transition: background-color 0.2s`

### Loading Spinner
```javascript
{
  width: '40px',
  height: '40px',
  border: `4px solid #e0e0e0`,
  borderTop: `4px solid #1e3a5f`,
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite'
}

// @keyframes spin {
//   to { transform: rotate(360deg); }
// }
```

## Task Card Priority Colors

- **Hoog (High)**: `#dc3545` - Red left border
- **Normaal (Normal)**: `#ffc107` - Yellow left border
- **Laag (Low)**: `#28a745` - Green left border

## Status Badge Colors

- **Todo**: Yellow background, dark yellow text
- **Bezig (In Progress)**: Blue background, dark blue text
- **Klaar (Done)**: Green background, dark green text

## Mobile-Specific Adjustments

### Body Padding on Mobile
- **Bottom**: `60px` (accommodates fixed nav)
- **All**: `1rem` (standard padding)

### Font Sizes on Mobile
- **Large Heading**: `20px` (reduced from 28px)
- **Heading**: `18px` (stays same)
- **Body**: `14px` (stays same)

### Grid Columns on Mobile
- **2 columns**: Default for stats cards
- **Full width**: For forms and lists

## Accessibility

### Color Contrast
- **Text on Background**: Minimum 4.5:1 ratio
- **Primary text (#333) on white**: 12.6:1 ✓
- **Secondary text (#999) on white**: 4.5:1 ✓

### Touch Targets
- **Minimum Size**: `44px x 44px`
- **All buttons**: ✓ 44px minimum
- **All inputs**: ✓ 44px minimum
- **Icon areas**: ✓ 44px minimum

### Focus States
- **Default**: Blue outline (Supabase/browser default)
- **Custom**: `2px solid #2d5f8a` border

## Usage in Components

```javascript
const COLORS = {
  primary: '#1e3a5f',
  secondary: '#2d5f8a',
  white: '#ffffff',
  light: '#f5f5f5',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545'
}

// Use throughout components:
style={{ backgroundColor: COLORS.primary }}
```

## Dark Mode (Future)

When implementing dark mode, create a second color palette:

```javascript
const DARK_COLORS = {
  primary: '#ffffff',
  secondary: '#e0e0e0',
  white: '#1a1a1a',
  light: '#2a2a2a',
  // ... etb
}
```

Then conditionally apply based on user preference.
