import React, { createContext, useContext, useEffect, useState } from 'react';

interface Profile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: 'client' | 'corretor' | 'admin';
  isActive: boolean;
  is_admin?: boolean;
  user_type?: string;
}

interface AuthContextType {
  user: any | null;
  session: any | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_URL = window.location.origin;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('profile');
    
    if (storedUser && storedProfile) {
      setUser(JSON.parse(storedUser));
      setProfile(JSON.parse(storedProfile));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Erro ao criar conta' } };
      }

      setUser(data.user);
      setProfile(data.profile);
      
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('profile', JSON.stringify(data.profile));

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: { message: 'Erro ao criar conta' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Erro ao fazer login' } };
      }

      console.log('Login successful, profile:', data.profile);

      setUser(data.user);
      setProfile(data.profile);
      
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('profile', JSON.stringify(data.profile));

      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error: { message: 'Erro ao fazer login' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) {
      return { error: { message: 'Usuário não autenticado' } };
    }

    try {
      const response = await fetch(`${API_URL}/api/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Erro ao atualizar perfil' } };
      }

      const updatedProfile = { ...profile, ...data };
      setProfile(updatedProfile);
      localStorage.setItem('profile', JSON.stringify(updatedProfile));

      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: { message: 'Erro ao atualizar perfil' } };
    }
  };

  const refreshProfile = async () => {
    if (!profile) return;

    try {
      const response = await fetch(`${API_URL}/api/profiles/${profile.id}`);
      const data = await response.json();

      if (response.ok) {
        const refreshedProfile = {
          ...data,
          is_admin: data.role === 'admin',
          user_type: data.role === 'corretor' ? 'broker' : data.role
        };
        setProfile(refreshedProfile);
        localStorage.setItem('profile', JSON.stringify(refreshedProfile));
      }
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
