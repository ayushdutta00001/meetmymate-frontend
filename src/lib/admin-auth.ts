import { supabase } from '../supabase';

export async function isAdminUser(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', userId)
    .eq('is_active', true)
    .maybeSingle(); // ✅ IMPORTANT

  if (error || !data) return false;
  return true;
}
