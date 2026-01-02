// ═══════════════════════════════════════════════════════════════════════════════
// SUPABASE CLIENT CONFIGURATION
// CR AudioViz AI - Henderson Standard
// ═══════════════════════════════════════════════════════════════════════════════

import { createBrowserClient } from '@supabase/ssr';

// Environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client for client-side operations
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// Singleton instance for simple imports
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
};

export default getSupabase;
