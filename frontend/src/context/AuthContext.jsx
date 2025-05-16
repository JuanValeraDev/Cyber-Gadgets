// src/context/AuthContext.jsx (Create this if missing)
import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        login: async (email, password) => {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            return data;
        },
        signUp: async (email, password) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        created_at: new Date().toISOString()
                    }
                }
            });
            if (error) throw error;
            return data;
        },
        logout: async () => {
            await supabase.auth.signOut();
        }
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
