import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import Notes from './components/Notes';

function App() {
  const { user } = useAuth();

  useEffect(() => {
    // Testing the Supabase connection as per your instructions
    const checkConnection = async () => {
      const response = await supabase.auth.getUser();
      console.log('Supabase connection test response:', response);
    };
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {user ? <Notes /> : <Auth />}
    </div>
  )
}

export default App
