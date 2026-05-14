import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set — add them to Vercel project env vars')
}

// Fallback strings keep createClient from throwing; network calls will simply
// fail gracefully until real env vars are provided in the Vercel dashboard.
export const supabase = createClient(
  supabaseUrl     || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_anon_key',
)
