import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2, Calendar } from 'lucide-react'
import apiClient from '../lib/apiClient'
import { supabase } from '../lib/supabase'

const fetchMyNotes = async () => {
    // Axios will auto-attach the JWT via interceptor
    const { data } = await apiClient.get('/notes/me?limit=50')
    return data.data
}

const deleteNoteCall = async (id) => {
    // Standard DELETE hitting the Python router which enforces ownership
    await apiClient.delete(`/notes/${id}`)
}

const Dashboard = () => {
    const queryClient = useQueryClient()

    const { data: notes, isLoading, isError } = useQuery({
        queryKey: ['myNotes'],
        queryFn: fetchMyNotes
    })

    const deleteMutation = useMutation({
        mutationFn: deleteNoteCall,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myNotes'] })
        },
        onError: (err) => {
            alert(`Failed to delete note: ${err.message}`)
        }
    })

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this note?")) return;
        deleteMutation.mutate(id)
    }

    if (isLoading) return (
        <div className="flex justify-center items-center py-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
    )

    return (
        <div className="container mx-auto px-6 max-w-7xl space-y-12 py-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-white">
                        My <span className="text-brand-primary">Dashboard</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Manage your academic contributions and track impact.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-brand-secondary">
                        Scholar Badge Active
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Notes", value: notes?.length || 0, icon: <BookOpen className="text-brand-primary" size={20} /> },
                    { label: "Total Views", value: "0", icon: <Zap className="text-brand-secondary" size={20} /> },
                    { label: "Downloads", value: "0", icon: <Calendar className="text-brand-accent" size={20} /> },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-brand-surface/50 border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
                        <div className="p-3 bg-white/5 w-fit rounded-xl ring-1 ring-white/10">
                            {stat.icon}
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white">{stat.value}</div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Notes List */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <div className="w-2 h-6 bg-brand-primary rounded-full"></div>
                    Your Uploaded Content
                </h2>

                {isError ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-3xl text-center font-medium">
                        Failed to fetch your notes. Your session may have expired.
                    </div>
                ) : notes?.length === 0 ? (
                    <div className="text-center py-24 bg-brand-surface/30 border border-dashed border-white/10 rounded-3xl space-y-6">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto ring-1 ring-white/10">
                            <BookOpen className="text-gray-600" size={32} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-white text-xl font-bold">No notes found</p>
                            <p className="text-gray-500 max-w-xs mx-auto">Start building your academic legacy by uploading your first set of notes.</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-hidden bg-brand-surface/50 border border-white/10 rounded-3xl shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="p-5 font-bold text-gray-400 text-[10px] uppercase tracking-widest">Note Details</th>
                                    <th className="p-5 font-bold text-gray-400 text-[10px] uppercase tracking-widest">Subject / Semester</th>
                                    <th className="p-5 font-bold text-gray-400 text-[10px] uppercase tracking-widest">Uploaded On</th>
                                    <th className="p-5 font-bold text-gray-400 text-[10px] uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {notes?.map((note) => (
                                    <tr key={note.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5">
                                            <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-primary font-bold text-sm transition-colors block mb-1">
                                                {note.title}
                                            </a>
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">ID: {note.id.slice(0, 8)}...</span>
                                        </td>
                                        <td className="p-5">
                                            <div className="text-sm font-medium text-gray-300">{note.subject}</div>
                                            <div className="text-[10px] font-bold text-brand-secondary uppercase">Sem {note.semester}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                                                <Calendar size={14} />
                                                {new Date(note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                disabled={deleteMutation.isPending}
                                                className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50"
                                                title="Delete Note"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
