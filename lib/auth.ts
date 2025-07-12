import { supabase } from './supabase';

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  bio: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error getting current user profile:', error);
    return null;
  }
}

export async function isUserAdmin(): Promise<boolean> {
  try {
    const profile = await getCurrentUserProfile();
    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function requireAdmin(): Promise<boolean> {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    throw new Error('Admin access required');
  }
  return true;
}

export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    await requireAdmin();

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return profiles || [];
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  try {
    await requireAdmin();

    const { error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

export async function deleteUserProfile(userId: string): Promise<void> {
  try {
    await requireAdmin();

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }
}