import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read environment variables supporting Vite (import.meta.env) and fallback safely
const getEnvVar = (key: string): string => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    // ignore
  }
  
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch (e) {
    // ignore
  }

  return '';
};

// Required environment variables per prompt specification
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing or not configured. Supabase features will operate in disconnected mode until configured.'
  );
}

// Create singleton Supabase client
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/**
 * Verifies the connection to Supabase by pinging or checking client status.
 */
export async function verifySupabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      return {
        success: false,
        message: 'Supabase URL and Anon Key are not set in environment variables.',
      };
    }

    // Ping Supabase health/auth endpoint to verify connection
    const { error } = await supabase.auth.getSession();
    if (error) {
      return { success: false, message: `Supabase connection error: ${error.message}` };
    }

    return { success: true, message: 'Successfully connected to Supabase.' };
  } catch (err: any) {
    return { success: false, message: `Failed to connect to Supabase: ${err?.message || err}` };
  }
}

/**
 * Clean helper functions for Database, Storage, Realtime, and Auth preparation.
 */
export const supabaseHelpers = {
  // Database helper placeholder
  from: (table: string) => supabase.from(table),

  // Storage helper placeholder
  storage: {
    uploadFile: async (bucket: string, path: string, file: File) => {
      try {
        const { data, error } = await supabase.storage.from(bucket).upload(path, file);
        if (error) throw error;
        return { data, error: null };
      } catch (error: any) {
        return { data: null, error: error.message };
      }
    },
    getPublicUrl: (bucket: string, path: string) => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    }
  },

  // Realtime helper placeholder
  subscribeToChannel: (channelName: string, callback: (payload: any) => void) => {
    return supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public' }, callback)
      .subscribe();
  },

  // Auth helper placeholder
  auth: {
    getSession: () => supabase.auth.getSession(),
    onAuthStateChange: (callback: any) => supabase.auth.onAuthStateChange(callback),
  }
};
