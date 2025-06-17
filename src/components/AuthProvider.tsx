import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../api/supabaseClient';

// Define the shape of our auth context
interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signOut: async () => {},
});

// Hook for components to easily access auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Try to recover session from localStorage first for immediate UI update
    try {
      const storedSession = localStorage.getItem('porkchop-session');
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        if (parsedSession && new Date(parsedSession.expires_at) > new Date()) {
          setSession(parsedSession);
          setUser(parsedSession.user);
        }
      }
    } catch (error) {
      console.error('Error reading session from localStorage:', error);
    }

    // Get the current session from Supabase
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        
        const { data } = await supabase.auth.getSession();
        
        if (data && data.session) {
          setSession(data.session);
          setUser(data.session.user);
          
          // Store session in localStorage for faster recovery on refresh
          localStorage.setItem('porkchop-session', JSON.stringify(data.session));
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession) {
          localStorage.setItem('porkchop-session', JSON.stringify(newSession));
        } else {
          localStorage.removeItem('porkchop-session');
        }
        
        setIsLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('porkchop-session');
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
