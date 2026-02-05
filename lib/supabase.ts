
import { createClient } from '@supabase/supabase-js';

// Get keys from import.meta.env (Vite's way)
const getKeys = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return { url, key };
}

const { url, key } = getKeys();

// Helper to check if we have valid config
export const isSupabaseConfigured = () => {
  const { url, key } = getKeys();
  return url !== '' && key !== '';
};

// Initialize client or return mock
export const supabase = (url && key) 
  ? createClient(url, key)
  : {
      from: (table: string) => ({
        select: (columns: string) => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          order: (col: string, opt: any) => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
          limit: (n: number) => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
            select: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } })
          })
        }),
        upsert: (data: any) => Promise.resolve({ error: { message: 'Supabase not configured' } }),
        insert: (data: any) => Promise.resolve({ error: { message: 'Supabase not configured' } }),
        update: (data: any) => ({ eq: (col: string, val: any) => Promise.resolve({ error: { message: 'Supabase not configured' } }) }),
        delete: () => ({ eq: (col: string, val: any) => Promise.resolve({ error: { message: 'Supabase not configured' } }) }),
      })
    } as any;
