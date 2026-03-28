# File Index - Huishoud Van Bogaert

Complete file listing and description for the project.

## Quick Navigation

**Start Here**: `00-START-HERE.md`
**Get Running**: `QUICKSTART.md`
**Full Docs**: `README.md`
**Setup Help**: `SETUP.md`
**Development**: `DEVELOPMENT.md`
**Design**: `DESIGN_TOKENS.md`

---

## Documentation Files (Read These!)

### 00-START-HERE.md
- **Purpose**: Main entry point for the project
- **Length**: ~200 lines
- **What You'll Find**: Overview, quick start, feature summary, important file locations
- **Read When**: First thing after extracting the project
- **Time**: 5 minutes

### QUICKSTART.md
- **Purpose**: Get the app running in 5 minutes
- **Length**: ~150 lines
- **What You'll Find**: Step-by-step setup, login credentials, quick overview
- **Read When**: Ready to start the dev server
- **Time**: 5 minutes

### README.md
- **Purpose**: Complete project documentation
- **Length**: ~350 lines
- **What You'll Find**: Features, architecture, design system, database schema, component overview
- **Read When**: Need to understand the full project
- **Time**: 15 minutes

### SETUP.md
- **Purpose**: Detailed Supabase setup instructions
- **Length**: ~200 lines
- **What You'll Find**: Step-by-step Supabase configuration, database setup, user creation
- **Read When**: Setting up Supabase for the first time
- **Time**: 20 minutes

### DEVELOPMENT.md
- **Purpose**: Development guide and code patterns
- **Length**: ~300 lines
- **What You'll Find**: How to add features, Supabase query examples, debugging tips, performance tips
- **Read When**: Ready to implement Supabase queries
- **Time**: 20 minutes

### DESIGN_TOKENS.md
- **Purpose**: Complete design system documentation
- **Length**: ~400 lines
- **What You'll Find**: Color palette, typography, spacing, component styles, accessibility
- **Read When**: Customizing colors or styling
- **Time**: 15 minutes

### PROJECT_CHECKLIST.md
- **Purpose**: Feature checklist and completion tracking
- **Length**: ~250 lines
- **What You'll Find**: All implemented features, code quality checklist, remaining tasks
- **Read When**: Verifying project completeness
- **Time**: 10 minutes

### COMPLETION_REPORT.md
- **Purpose**: Executive summary of project completion
- **Length**: ~300 lines
- **What You'll Find**: Statistics, what's included, what's ready, setup instructions
- **Read When**: Need a comprehensive overview
- **Time**: 10 minutes

### FILE_INDEX.md
- **Purpose**: This file - index of all project files
- **Length**: ~200 lines
- **What You'll Find**: Description of every file in the project
- **Read When**: Lost or need to find something
- **Time**: 10 minutes

---

## Configuration Files

### package.json
- **Purpose**: Node.js project manifest
- **What It Contains**:
  - Project name and version
  - npm scripts (dev, build, preview)
  - Dependencies: react, react-dom, react-router-dom, @supabase/supabase-js
  - Dev dependencies: vite, @vitejs/plugin-react
- **Edit When**: Adding dependencies
- **Lines**: 27

### vite.config.js
- **Purpose**: Vite build tool configuration
- **What It Contains**:
  - React plugin setup
  - Dev server port (5173)
  - Build settings
- **Edit When**: Changing build behavior
- **Lines**: 11

### index.html
- **Purpose**: HTML entry point for the app
- **What It Contains**:
  - DOCTYPE and meta tags
  - Root div for React
  - Script tag for main.jsx
- **Edit When**: Changing page title or meta tags
- **Lines**: 13

### .env.example
- **Purpose**: Template for environment variables
- **What It Contains**:
  - VITE_SUPABASE_URL placeholder
  - VITE_SUPABASE_ANON_KEY placeholder
- **Edit When**: Creating .env.local
- **Lines**: 2

### .gitignore
- **Purpose**: Git configuration - which files to ignore
- **What It Contains**:
  - node_modules/
  - .env (local environment)
  - IDE files (.vscode, .idea)
  - OS files (.DS_Store)
- **Edit When**: Adding new files to ignore
- **Lines**: 24

---

## Database Files

### supabase-schema.sql
- **Purpose**: Complete database schema and setup
- **What It Contains**:
  - 8 table definitions
  - Foreign keys and relationships
  - Row Level Security (RLS) policies
  - Indexes for performance
  - Default data
- **Lines**: ~320
- **Run Once**: In Supabase SQL editor

---

## Source Code Files (src/)

### src/main.jsx
- **Purpose**: React entry point
- **What It Does**:
  - Renders React app to DOM
  - Sets up Router
  - Wraps app with AuthProvider
- **Imports**: React, ReactDOM, Router, AuthProvider, App, CSS
- **Lines**: 16

### src/App.jsx
- **Purpose**: Root component and router configuration
- **What It Does**:
  - Defines all routes
  - Checks authentication
  - Shows loading state
  - Redirects unauthenticated users
- **Routes**:
  - / → Dashboard
  - /takenbord → Takenbord
  - /planning → Planning
  - /boodschappen → Boodschappen
  - /uren → Uren
  - * → Redirect to /
- **Lines**: 49

### src/index.css
- **Purpose**: Global styles
- **What It Contains**:
  - Reset (box-sizing)
  - Font imports (Inter)
  - Body styles
  - Utility classes
  - Touch target sizes
- **Lines**: 46

---

## Context (src/context/)

### src/context/AuthContext.jsx
- **Purpose**: Authentication state management
- **What It Does**:
  - Manages user login/logout
  - Handles Supabase auth
  - Maps names to emails
  - Provides useAuth hook
  - Persists session
- **Exports**: AuthProvider, useAuth hook
- **User Object**: { id, email, name, permissions }
- **Lines**: 115

---

## Hooks (src/hooks/)

### src/hooks/useMobile.jsx
- **Purpose**: Responsive design hook
- **What It Does**:
  - Detects screen size
  - Returns true if <= 768px
  - Updates on resize
  - Cleanup on unmount
- **Usage**: `const isMobile = useMobile()`
- **Lines**: 19

---

## Library (src/lib/)

### src/lib/supabase.js
- **Purpose**: Supabase client configuration
- **What It Contains**:
  - Supabase client creation
  - nameToEmail mapping (olivier, ashdey, jan, edna)
  - emailToName reverse mapping
  - userPermissions mapping
  - defaultPasswords reference
- **Exports**: supabase, nameToEmail, emailToName, userPermissions, defaultPasswords
- **Lines**: 48

---

## Components (src/components/)

### src/components/Layout.jsx
- **Purpose**: Main application layout and navigation
- **What It Does**:
  - Renders responsive header/nav
  - Desktop: Horizontal top nav
  - Mobile: Fixed bottom nav (60px)
  - Shows user name
  - Handles logout
  - Wraps page content
- **Props**: children (page content)
- **Responsive**: Yes (768px breakpoint)
- **Lines**: 188

### src/components/TaakKaart.jsx
- **Purpose**: Task card component
- **What It Does**:
  - Displays single task
  - Shows priority (color-coded left border)
  - Status dropdown
  - Metadata chips (category, person, date)
  - Photo display
  - Reaction button
- **Props**: taak, onStatusChange, onReactionClick, reactionCount
- **Lines**: 165

### src/components/ChipSelect.jsx
- **Purpose**: Selection chips component
- **What It Does**:
  - Displays selectable chips
  - Single or multiple selection
  - Visual feedback for selected items
  - Optional label
- **Props**: label, options, value, onChange, multiple, placeholder
- **Lines**: 71

---

## Pages (src/pages/)

### src/pages/Login.jsx
- **Purpose**: User authentication page
- **What It Contains**:
  - User name dropdown (4 users)
  - Password input
  - Login form
  - Error display
  - Loading state
  - Gradient background
  - White card design
- **Size**: 184 lines

### src/pages/Dashboard.jsx
- **Purpose**: Overview and statistics
- **What It Contains**:
  - Welcome message
  - 4 stat cards (total, active, completed, shopping)
  - Recent tasks list
  - Loading and empty states
  - Responsive grid (2/4 columns)
- **Size**: 174 lines

### src/pages/Takenbord.jsx
- **Purpose**: Task management page
- **What It Contains**:
  - Task list with cards
  - Filter by status
  - Filter by category
  - Add new task form
  - Task status updates
  - Reaction handler
- **Size**: 289 lines

### src/pages/Planning.jsx
- **Purpose**: Weekly planning/scheduling
- **What It Contains**:
  - 7-day week view with dates
  - 3 blokken: Ochtend, Namiddag, Hele dag
  - Click-to-assign grid
  - Responsive table (scrollable on mobile)
  - Legend section
  - getWeekDatums() helper
- **Size**: 297 lines

### src/pages/Boodschappen.jsx
- **Purpose**: Shopping list
- **What It Contains**:
  - Add item form
  - Checkbox to mark done
  - Delete item buttons
  - Separate done items section
  - Filter toggle
  - Item counts
- **Size**: 287 lines

### src/pages/Uren.jsx
- **Purpose**: Hours tracking
- **What It Contains**:
  - Summary cards (gross, pause, net hours)
  - Add hours form
  - Date, start, end, pause inputs
  - Auto-calculate net hours
  - Hours history table
  - Responsive layout
- **Size**: 432 lines

---

## File Organization Summary

```
28 Total Files
├── 8 Documentation files (.md)
├── 5 Configuration files
├── 1 Database schema file
├── 14 Source code files
│   ├── 6 Pages
│   ├── 3 Components
│   ├── 1 Context
│   ├── 1 Hook
│   ├── 1 Library
│   ├── 2 Root files
│   └── (1 CSS file)
```

## By File Type

| Type | Count | Total Lines |
|------|-------|------------|
| .jsx | 14 | ~2,200 |
| .md | 8 | ~3,500 |
| .sql | 1 | ~320 |
| .js | 2 | ~150 |
| .css | 1 | ~46 |
| .json | 1 | ~27 |
| .js | 1 | ~28 |
| **Total** | **28** | **~6,273** |
