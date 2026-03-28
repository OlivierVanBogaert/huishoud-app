# Quick Start Guide - Huishoud Van Bogaert

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd /path/to/huishoud-app
npm install
```

### Step 2: Set Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Start Development Server
```bash
npm run dev
```

The app opens at `http://localhost:5173`

## Login Credentials

Use any of these to test:

| Name | Password |
|------|----------|
| Olivier | NetjesThuisBeeldstraat |
| Ashley | NetjesThuisBeeldstraat |
| Jan | NetjesThuisRuisstraat |
| Edna | NetjesThuisBeeldstraatRuisstraat |

**Note**: First time login will fail until you set up Supabase and run the schema.

## What Each Page Does

### 📊 Dashboard
- Overview with statistics
- Recent tasks snapshot
- Quick info cards

### ✓ Takenbord (Task Board)
- View and manage tasks
- Filter by status/category
- Add new tasks
- Update task status

### 📅 Planning
- Weekly schedule view
- Mark availability blocks
- Morning/afternoon/all-day slots

### 🛒 Boodschappen (Shopping)
- Shopping list management
- Check off items
- Separate done items

### ⏱ Uren (Hours)
- Track work hours
- Auto-calculate net hours
- View history

## Project Structure

```
huishoud-app/
├── src/
│   ├── pages/           # Page components (6 pages)
│   ├── components/      # Reusable components
│   ├── context/         # Auth state
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Supabase config
│   ├── App.jsx          # Router & routes
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── supabase-schema.sql  # Database setup
├── index.html
├── vite.config.js
├── package.json
└── README.md            # Full documentation
```

## Key Features

- ✅ Login with username (not email)
- ✅ Responsive (mobile & desktop)
- ✅ Dutch language
- ✅ Task management
- ✅ Weekly planning
- ✅ Shopping list
- ✅ Hours tracking
- ✅ User permissions
- ✅ Supabase ready

## Next Steps

1. **Set up Supabase**:
   - Create account at supabase.com
   - Create new project
   - Add your credentials to .env.local

2. **Configure Database**:
   - Run SQL from `supabase-schema.sql`
   - Create 4 users in Auth
   - Fill `gebruikers` table

3. **Implement Queries**:
   - Each page has placeholder functions
   - See DEVELOPMENT.md for examples
   - Replace mock data with real queries

4. **Test & Iterate**:
   - Test login with each user
   - Test each page's features
   - Adjust colors/layout as needed

## Common Issues

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install
# Then restart: npm run dev
```

### "Missing Supabase environment variables"
- Check .env.local exists
- Verify variable names (must start with VITE_)
- Restart dev server

### Login always fails
- Supabase not set up yet
- Check that users exist in Auth
- Run the SQL schema

## File Overview

### Components
- **Layout.jsx** - Header + navigation
- **TaakKaart.jsx** - Task card display
- **ChipSelect.jsx** - Selection chips

### Pages
- **Login.jsx** - User authentication
- **Dashboard.jsx** - Overview & stats
- **Takenbord.jsx** - Task management
- **Planning.jsx** - Weekly schedule
- **Boodschappen.jsx** - Shopping list
- **Uren.jsx** - Hours tracking

### Context
- **AuthContext.jsx** - User auth state

### Hooks
- **useMobile.jsx** - Responsive detection

### Library
- **supabase.js** - Supabase client setup

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## Performance

- ~50KB gzipped (without deps)
- Mobile-optimized
- Responsive images
- No CSS frameworks

## Customization

All styling is inline. To change colors:

1. Update COLORS object in components
2. Or edit COLORS in each file:
```javascript
const COLORS = {
  primary: '#1e3a5f',    // Edit here
  secondary: '#2d5f8a',
  white: '#ffffff'
}
```

See DESIGN_TOKENS.md for complete color system.

## Commands Reference

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (port 5173)
npm run build           # Build for production
npm run preview         # Preview prod build
```

## Resources

- [Full README](./README.md)
- [Setup Guide](./SETUP.md)
- [Development Guide](./DEVELOPMENT.md)
- [Design System](./DESIGN_TOKENS.md)
- [Project Checklist](./PROJECT_CHECKLIST.md)

## Get Help

1. Check DEVELOPMENT.md for common patterns
2. Review existing components
3. Check browser console for errors
4. Look at supabase-schema.sql for database structure

## Success Checklist

- [ ] npm install works
- [ ] npm run dev opens browser
- [ ] You see login page
- [ ] Can see all navigation links
- [ ] Supabase credentials added to .env.local
- [ ] Can log in (after Supabase setup)

You're good to go! 🚀
