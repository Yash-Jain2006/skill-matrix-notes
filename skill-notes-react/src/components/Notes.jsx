import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';

export default function Notes() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingNote, setEditingNote] = useState(null);

    // List: Use useQuery from React Query
    const { data: notes, isLoading, error } = useQuery({
        queryKey: ['notes'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    // Real-time subscriptions
    useEffect(() => {
        const channel = supabase
            .channel('notes_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => {
                queryClient.invalidateQueries({ queryKey: ['notes'] });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);

    // Create / Update Form Handler
    const handleSave = async (e) => {
        e.preventDefault();

        if (editingNote) {
            const { error } = await supabase
                .from('notes')
                .update({ title, content })
                .eq('id', editingNote.id);
            if (error) alert(error.message);
            else {
                setEditingNote(null);
                setTitle('');
                setContent('');
            }
        } else {
            const { error } = await supabase
                .from('notes')
                .insert({ title, content, user_id: user.id });

            if (error) alert(error.message);
            else {
                setTitle('');
                setContent('');
            }
        }
    };

    // Delete handler
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        const { error } = await supabase.from('notes').delete().eq('id', id);
        if (error) alert(error.message);
    };

    // Cancel edit
    const cancelEdit = () => {
        setEditingNote(null);
        setTitle('');
        setContent('');
    };

    return (
        <div className="max-w-4xl mx-auto w-full p-6 text-white">
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4 mt-6">
                <h2 className="text-3xl font-bold">Your Notes</h2>
                <button
                    onClick={() => supabase.auth.signOut()}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                >
                    Sign Out
                </button>
            </div>

            <form onSubmit={handleSave} className="bg-gray-900 p-6 rounded-lg shadow-md mb-8 border border-gray-800">
                <h3 className="text-xl font-bold mb-4">{editingNote ? 'Edit Note' : 'Create New Note'}</h3>
                <input
                    type="text"
                    placeholder="Note Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full mb-4 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                <textarea
                    placeholder="Note Content (Markdown supported!)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    className="w-full mb-4 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500 font-mono text-sm"
                />
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
                    >
                        {editingNote ? 'Update Note' : 'Save Note'}
                    </button>
                    {editingNote && (
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="space-y-6">
                {isLoading ? (
                    <p className="text-gray-400 text-center py-8">Loading your awesome notes...</p>
                ) : error ? (
                    <p className="text-red-400 p-4 bg-red-900/20 rounded border border-red-900">
                        Error loading notes: {error.message}. <br />
                        *(Did you create the "notes" table in Supabase and enable RLS?)*
                    </p>
                ) : notes?.length === 0 ? (
                    <p className="text-gray-400 text-center py-8 bg-gray-900 rounded-lg border border-gray-800">
                        You don't have any notes yet! Create your first one above.
                    </p>
                ) : (
                    notes?.map((note) => (
                        <div key={note.id} className="bg-gray-900 p-6 rounded-lg text-white shadow border border-gray-800 group relative">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold text-blue-400">{note.title}</h3>
                                <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            setEditingNote(note);
                                            setTitle(note.title);
                                            setContent(note.content);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="text-sm bg-red-900/50 text-red-400 hover:bg-red-800 hover:text-white px-3 py-1 rounded transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="prose prose-invert max-w-none text-gray-300">
                                <ReactMarkdown>{note.content || ''}</ReactMarkdown>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
