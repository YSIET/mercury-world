import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the SERVICE ROLE key.
 *
 * SECURITY: This client bypasses RLS. NEVER expose it to the browser.
 * Importing this file from a Client Component will fail at build time
 * thanks to the `server-only` package.
 */
export function getAdminSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY environment variables.',
    );
  }
  _client = createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}
