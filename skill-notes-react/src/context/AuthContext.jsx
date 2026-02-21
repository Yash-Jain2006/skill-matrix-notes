import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Updated path to match our structure

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) =>
            setUser(session?.user ?? null)
        );

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) =>
            setUser(session?.user ?? null)
        );

        return () => subscription.unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
