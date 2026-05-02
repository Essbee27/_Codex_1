import { env, hasSupabaseConfig } from "./env.js";
import { logger } from "../utils/logger.js";

type QueryBuilder = {
  from: (table: string) => {
    select: (query: string) => any;
  };
};

let clientPromise: Promise<QueryBuilder | null> | null = null;

async function loadSupabaseClient(): Promise<QueryBuilder | null> {
  if (!hasSupabaseConfig) {
    return null;
  }

  try {
    const dynamicImport = new Function("m", "return import(m)") as (moduleName: string) => Promise<any>;
    const supabaseModule = await dynamicImport("@supabase/supabase-js");
    const createClient = supabaseModule.createClient as (url: string, key: string, config: unknown) => QueryBuilder;

    return createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  } catch (error) {
    logger.warn("Supabase SDK is unavailable. Falling back to mock repository mode.", {
      errorMessage: error instanceof Error ? error.message : "unknown"
    });
    return null;
  }
}

export async function getSupabaseClient() {
  if (!clientPromise) {
    clientPromise = loadSupabaseClient();
  }

  return clientPromise;
}
