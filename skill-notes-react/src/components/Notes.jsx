import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', user.id);

            if (!error && data) {
                setNotes(data);
            }
            setLoading(false);
        };

        fetchNotes();
    }, []);

    if (loading) return <div className="text-white">Loading notes...</div>;

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Your Notes</h2>
            {notes.length === 0 ? (
                <p className="text-gray-400">No notes found.</p>
            ) : (
                <ul className="w-full max-w-md space-y-4">
                    {notes.map((note) => (
                        <li key={note.id} className="bg-gray-800 p-4 rounded text-white shadow">
                            {/* Assuming note has title and content fields, display them safely */}
                            <h3 className="font-bold">{note.title || 'Untitled Note'}</h3>
                            <p className="text-gray-300 whitespace-pre-wrap">{note.content || ''}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
