import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud } from 'lucide-react'
import { supabase } from '../lib/supabase'
import apiClient from '../lib/apiClient'
import { useAuth } from '../context/AuthContext'

const Upload = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [file, setFile] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        college: '',
        stream: '',
        branch: '',
        semester: 1,
        subject: ''
    })

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0]
            if (selectedFile.size > 52428800) { // 50MB
                alert("File is too large. Maximum size is 50MB.")
                e.target.value = ''
                return
            }
            setFile(selectedFile)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'semester' ? parseInt(value) || 1 : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) return alert('Please select a file to upload.')

        setIsSubmitting(true)
        try {
            // 1. Upload to Supabase Storage accurately enforcing RLS paths
            const fileExt = file.name.split('.').pop()
            const fileName = `${crypto.randomUUID()}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('notes-files')
                .upload(filePath, file)

            if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`)

            // 2. Generate a long-lived Signed URL for secure access
            const { data: signedData, error: signedError } = await supabase.storage
                .from('notes-files')
                .createSignedUrl(filePath, 31536000) // 1 year expiry

            if (signedError) throw new Error(`Failed to generate signed URL: ${signedError.message}`)

            // 3. Save Node metadata to the Python FastAPI backend
            const payload = {
                ...formData,
                file_url: signedData.signedUrl
            }

            await apiClient.post('/notes', payload)

            alert('Note uploaded successfully!')
            navigate('/dashboard')

        } catch (err) {
            console.error(err)
            alert(err.message || 'An error occurred during upload.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <div className="bg-brand-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl space-y-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-premium rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                            <UploadCloud className="text-white" size={28} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-white">
                            Publish <span className="text-brand-secondary">Notes</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Share your academic excellence with the global student community. <br />
                        <span className="text-brand-accent/80 font-bold">⚡ All uploads are secured with enterprise-grade encryption.</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* File Drop Zone */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-300 ml-1 uppercase tracking-widest text-[10px]">1. Select Document</label>
                        <div className="group relative p-10 border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-primary/50 rounded-3xl text-center transition-all cursor-pointer overflow-hidden">
                            <input
                                type="file"
                                required
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                            />
                            <div className="space-y-4 relative z-0">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-white/10 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="text-gray-500 group-hover:text-brand-primary transition-colors" size={32} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white font-bold text-lg">
                                        {file ? file.name : "Drop academic files here"}
                                    </p>
                                    <p className="text-gray-500 text-sm font-medium">PDF, DOC, or ZIP • Max 50MB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-8 pt-4 border-t border-white/5">
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-gray-300 ml-1 uppercase tracking-widest text-[10px]">2. Note Details</label>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 ml-1">Document Title</label>
                                    <input type="text" name="title" required value={formData.title} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all"
                                        placeholder="e.g. Advanced Data Structures - Final Revision" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-400 ml-1">University / College</label>
                                        <input type="text" name="college" required value={formData.college} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all"
                                            placeholder="e.g. Stanford University" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-400 ml-1">Subject Code / Name</label>
                                        <input type="text" name="subject" required value={formData.subject} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all"
                                            placeholder="e.g. CS101 - Algorithms" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-400 ml-1">Stream</label>
                                        <input type="text" name="stream" required value={formData.stream} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all"
                                            placeholder="e.g. B.Tech" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-400 ml-1">Branch</label>
                                        <input type="text" name="branch" required value={formData.branch} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all"
                                            placeholder="e.g. IT" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-400 ml-1">Semester</label>
                                        <select
                                            name="semester"
                                            required
                                            value={formData.semester}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all appearance-none cursor-pointer"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s} className="bg-brand-surface text-white">Semester {s}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 ml-1">Brief Description</label>
                                    <textarea name="description" rows="3" value={formData.description} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all resize-none"
                                        placeholder="Outline the core topics covered in these notes..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-premium hover:opacity-90 text-white font-black py-5 rounded-2xl shadow-2xl shadow-brand-primary/30 disabled:opacity-50 transition-all flex justify-center items-center gap-3 active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    <span>Syncing with SKiL MATRiX...</span>
                                </>
                            ) : (
                                <>
                                    <span>Confirm & Publish</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Upload
