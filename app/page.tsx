'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUserProfile, UserProfile } from '@/lib/auth';
import AuthForm from '@/components/auth/AuthForm';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Users, Shield, Settings, LogOut, Crown } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profile = await getCurrentUserProfile();
        setUserProfile(profile);
      }
      
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profile = await getCurrentUserProfile();
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              User Management System
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A complete authentication and user management solution with admin capabilities,
              email verification, and Google OAuth integration.
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {userProfile?.full_name || user.email}
                {userProfile?.role === 'admin' && (
                  <Crown className="inline ml-1 h-4 w-4 text-yellow-500" />
                )}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage your personal information and account settings.
            </p>
            <Button 
              onClick={() => router.push('/profile')}
              className="w-full"
            >
              View Profile
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Configure your account preferences and security options.
            </p>
            <Button 
              variant="outline"
              onClick={() => router.push('/settings')}
              className="w-full"
            >
              Manage Settings
            </Button>
          </div>

          {userProfile?.role === 'admin' && (
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Admin Panel</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Manage users, handle support requests, and system administration.
              </p>
              <Button 
                variant="outline"
                onClick={() => router.push('/admin')}
                className="w-full"
              >
                Admin Dashboard
              </Button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Configure your account preferences and security options.
            </p>
            <Button 
              variant="outline"
              onClick={() => router.push('/settings')}
              className="w-full"
            >
              Manage Settings
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 border">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">User ID:</span> {user.id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Role:</span> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    userProfile?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {userProfile?.role === 'admin' ? 'Administrator' : 'User'}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email Verified:</span> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    user.email_confirmed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.email_confirmed_at ? 'Verified' : 'Pending'}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/profile')}
                  className="w-full justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                {userProfile?.role === 'admin' && (
                  <Button
                    variant="outline"
                    onClick={() => router.push('/admin')}
                    className="w-full justify-start"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}