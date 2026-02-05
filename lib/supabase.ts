
import { createClient } from '@supabase/supabase-js';

// Get keys from process.env or localStorage (fallback for bolt environment)
const getKeys = () => {
  const url = process.env.SUPABASE_URL || localStorage.getItem('supabase_url') || '';
  const key = process.env.SUPABASE_ANON_KEY || localStorage.getItem('supabase_anon_key') || '';
  return { url, key };
};

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
