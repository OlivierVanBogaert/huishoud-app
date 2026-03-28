import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User name to email mapping for authentication
export const nameToEmail = {
    'Olivier': 'olivier@huishoud.app',
    'Ashley': 'ashley@huishoud.app',
    'Jan': 'jan@huishoud.app',
    'Edna': 'edna@huishoud.app'
}

// Email to name mapping
export const emailToName = Object.entries(nameToEmail).reduce((acc, [name, email]) => {
    acc[email] = name
    return acc
}, {})

// User permissions mapping
export const userPermissions = {
    'Olivier': ['🏠 Olivier & Ashley'],
    'Ashley': ['🏠 Olivier & Ashley'],
    'Jan': ['🏡 Jan'],
    'Edna': ['🏠 Olivier & Ashley', '🏡 Jan']
}

// Default password mapping (for development/reference)
export const defaultPasswords = {
    'Olivier': 'olivier2024',
    'Ashley': 'ashley2024',
    'Jan': 'jan2024',
    'Edna': 'edna2024'
}
