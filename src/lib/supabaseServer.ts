import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _supabaseAdmin: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  _supabaseAdmin = createClient(supabaseUrl, supabaseKey);
} else {
  // leave null — database functions will fallback to in-memory behaviour when null
  _supabaseAdmin = null;
}

export const supabaseAdmin = _supabaseAdmin;
