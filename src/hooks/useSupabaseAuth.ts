
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'instructor' | 'tutor' | 'parent' | 'admin' | 'manager';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  is_adult: boolean;
  created_at: string;
  updated_at: string;
};

export type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'instructor' | 'tutor';
  isAdult: boolean;
};

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (userData: SignUpData) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            isAdult: userData.isAdult
          }
        }
      });

      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      });

      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });

      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Erreur de déconnexion",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté.",
      });

      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
      toast({
        title: "Erreur de déconnexion",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: errorMessage };
    }
  };

  const getRoleBasedRedirectPath = (role: string) => {
    switch (role) {
      case 'student':
        return '/dashboard/etudiant';
      case 'instructor':
        return '/dashboard/instructeur';
      case 'tutor':
        return '/dashboard/tuteur';
      case 'parent':
        return '/dashboard/parent';
      case 'admin':
        return '/dashboard/admin';
      case 'manager':
        return '/dashboard/manager';
      default:
        return '/dashboard/etudiant';
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    getRoleBasedRedirectPath,
    isAuthenticated: !!user,
  };
};
