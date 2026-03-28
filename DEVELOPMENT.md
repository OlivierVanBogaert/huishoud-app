# Development Guide

## Quick Start

```bash
# Install dependencies (if not done yet)
npm install

# Create .env.local from .env.example
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...

# Start development server
npm run dev
```

## Adding Supabase Queries

Each page currently has placeholder functions. Here's how to implement them:

### Example: Loading tasks in Takenbord.jsx

```javascript
// In loadTaken() function:
const loadTaken = async () => {
  try {
    setLoading(true)

    // Query taken from the user's households
    const { data, error } = await supabase
      .from('taken')
      .select('*')
      .in('huis_id', user.permissions.map(p => getHouseholdIdFromName(p)))

    if (error) throw error
    setTaken(data || [])
  } catch (error) {
    console.error('Error loading tasks:', error)
  } finally {
    setLoading(false)
  }
}
```

### Example: Adding a task

```javascript
const handleAddTask = async (e) => {
  e.preventDefault()
  if (!newTaskName.trim()) return

  try {
    const { data, error } = await supabase
      .from('taken')
      .insert([{
        taak: newTaskName,
        huis_id: selectedHousehold,
        categorie: newTaskCategory,
        prioriteit: newTaskPriority,
        status: 'todo'
      }])

    if (error) throw error

    setNewTaskName('')
    setShowNewTaskForm(false)
    await loadTaken()
  } catch (error) {
    console.error('Error adding task:', error)
  }
}
```

## Important Considerations

### 1. User Permissions

Users can only access their households. Always filter by:

```javascript
// User permissions contain household names like "🏠 Olivier & Ashay["
// You need to map these to household IDs from the huishoudens table
const userHouseholds = await supabase
  .from('huishoudens')
  .select('id')
  .in('naam', user.permissions)

const householdIds = userHouseholds.data.map(h => h.id)
```

### 2. Real-time Updates

To subscribe to changes:

```javascript
useEffect(() => {
  const subscription = supabase
    .from('taken')
    .on('*', payload => {
      // Update state when data changes
      console.log('Change received!', payload)
    })
    .subscribe()

  return () => subscription.unsubscribe()
}, [user])
```

### 3. Image Upload

For task photos:

```javascript
const handlePhotoUpload = async (file, taskId) => {
  try {
    const { data, error } = await supabase.storage
      .from('task-photos')
      .upload(`${taskId}/${file.name}`, file)

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('task-photos')
      .getPublicUrl(data.path)

    // Update task with photo URL
    await supabase
      .from('taken')
      .update({ foto_url: publicUrl })
      .eq('id', taskId)
  } catch (error) {
    console.error('Error uploading photo:', error)
  }
}
```

## Testing Accounts

Use these to test the app:

| Naam | Email | Wachtwoord |
|------|-------|-----------|
| Olivier | olivier@huishoud.local | NetjesThuisBeeldstraat |
| Ashley | ashley@huishoud.local | NetjesThuisBeeldstraat |
| Jan | jan@huishoud.local | NetjesThuisRuisstraat |
| Edna | edna@huishoud.local | NetjesThuisBeeldstraatRuisstraat |

## Common Tasks

### Add Loading Spinner

```javascript
{loading ? (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #e0e0e0',
      borderTop: '4px solid #1e3a5f',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      margin: '0 auto'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
) : (
  // Your content
)}
```

### Add Error Message

```javascript
{error && (
  <div style={{
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1rem'
  }}>
    {error}
  </div>
)}
```

### Add Success Toast

```javascript
// Add this to your component
const [successMessage, setSuccessMessage] = useState('')

const showSuccess = (message) => {
  setSuccessMessage(message)
  setTimeout(() => setSuccessMessage(''), 3000)
}

// In JSX:
{successMessage && (
  <div style={{
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '1rem',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    zIndex: 1000
  }}>
    {successMessage}
  </div>
)}
```

## File Organization

Keep components small and focused:

```javascript
// ✅ Good - single responsibility
export default function TaakCard({ taak, onUpdate }) {
  return <div>...</div>
}

// ❌ Avoid - too many concerns
export default function Dashboard({ users, tasks, settings, ... }) {
  // Too much in one file
}
```

## CSS Best Practices

All styling is inline. Keep it readable:

```javascript
// ✅ Good - readable inline styles
<div style={{
  backgroundColor: COLORS.white,
  padding: '1rem',
  borderRadius: '8px'
}}>

// ❌ Avoid - hard to read
<div style={{backgroundColor: '#fff', padding: '1rem', borderRadius: '8px'}}>
```

## Performance Tips

1. **Memoize expensive components**:
```javascript
import { memo } from 'react'
export default memo(function TaakCard({ taak }) {
  return <div>...</div>
})
```

2. **Use useCallback for handlers**:
```javascript
const handleDelete = useCallback((id) => {
  // Your logic
}, [dependencies])
```

3. **Pagination for large lists**:
```javascript
const [page, setPage] = useState(0)
const pageSize = 20

const { data, count } = await supabase
  .from('taken')
  .select('*', { count: 'exact' })
  .range(page * pageSize, (page + 1) * pageSize - 1)
```

## Debugging

### Check Supabase Auth State

```javascript
// In browser console:
const { data } = await supabase.auth.getSession()
console.log(data.session)
```

### Check RLS Policies

If queries fail silently, check Supabase logs:
1. Go to Supabase project dashboard
2. Logs > Database > Find your query
3. Check RLS policy errors

### View Network Requests

Open DevTools > Network tab and filter by `xhr` or `fetch`

## Building for Production

```bash
npm run build  # Creates optimized dist folder
npm run preview  # Test production build locally
```

Deploy to Vercel, Netlify, or any static host.

## Troubleshooting

### "Missing Supabase environment variables"
- Check that .env.local exists
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
- Restart dev server: `npm run dev`

### "Unauthorized" on Supabase queries
- Check RLS policies are correctly set up
- Verify user is authenticated (check AuthContext)
- Ensure user has access to the household data

### "CORS error" from Supabase
- This shouldn't happen with supabase-js
- Check your API keys are correct
- Verify Supabase project URL

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [React Router](https://reactrouter.com)
