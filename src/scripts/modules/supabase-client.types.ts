/**
 * @file Supabase client types
 * @module modules/supabase-client
 */

/**
 * Public Supabase environment variables (Vite).
 */
export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

/**
 * Application roles stored in public.profiles.
 */
export type AppRole = 'student' | 'evaluator';

/**
 * Profile row returned from public.profiles.
 */
export type Profile = {
  id: string;
  role: AppRole;
  created_at: string;
};

/**
 * Asset types for project media metadata.
 */
export type AssetType = 'image' | 'video' | 'model3d' | 'document';

/**
 * Project asset metadata row.
 */
export type ProjectAsset = {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  asset_type: AssetType;
  storage_path: string;
  is_public: boolean;
  created_at: string;
};

/** Storage bucket for private evaluator media. */
export const EVALUATOR_STORAGE_BUCKET = 'evaluator-assets';

/** Signed URL lifetime in seconds (1 hour). */
export const SIGNED_URL_TTL_SECONDS = 3600;
