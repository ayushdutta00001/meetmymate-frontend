import { supabase } from '../supabase';


/**
 * Check if a user is an admin
 * Uses admin_users table
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;
  return true;
}
