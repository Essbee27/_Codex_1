import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env, hasSupabaseConfig } from "./env.js";

let client: SupabaseClient | null = null;

if (hasSupabaseConfig) {
  client = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function getSupabaseClient() {
  return client;
}
