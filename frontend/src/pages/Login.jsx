import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // Auto-redirect if already logged in
    if (user) {
        return <Navigate to="/dashboard" replace />
    }

    const handleEmailAuth = async (e, type) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            if (type === 'signup') {
                const { error } = await supabase.auth.signUp({ email, password })
                if (error) throw error;
                alert('Signup successful! Check email if confirmation required.')
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error;
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.message || 'Authentication failed.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        setError('')
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            })
            if (error) throw error;
        } catch (err) {
            setError(err.message)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 relative py-20">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-[60%] h-[60%] bg-brand-primary blur-[100px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-brand-accent blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-md relative">
                <div className="bg-brand-surface/50 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-white">
                            Welcome <span className="text-brand-secondary">Back</span>
                        </h1>
                        <p className="text-gray-400 font-medium">Continue your academic journey with SKiL MATRiX</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium animate-in fade-in duration-300">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-300 ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all shadow-inner"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-300 ml-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all shadow-inner"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <button
                                disabled={isLoading}
                                onClick={(e) => handleEmailAuth(e, 'signin')}
                                className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all active:scale-95 disabled:opacity-50"
                            >
                                Sign In
                            </button>
                            <button
                                disabled={isLoading}
                                onClick={(e) => handleEmailAuth(e, 'signup')}
                                className="w-full py-4 rounded-2xl bg-gradient-premium hover:opacity-90 text-white font-bold shadow-lg shadow-brand-primary/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <div className="relative flex items-center gap-4 text-gray-600">
                        <div className="flex-1 border-t border-white/5"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Secure Portal</span>
                        <div className="flex-1 border-t border-white/5"></div>
                    </div>

                    <button
                        disabled={isLoading}
                        onClick={handleGoogleLogin}
                        className="w-full bg-white hover:bg-gray-100 text-gray-950 font-black py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="" />
                        Continue with Google
                    </button>

                    <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest pt-4">
                        By continuing, you agree to our Terms of Service
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
