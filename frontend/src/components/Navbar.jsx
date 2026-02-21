import { Link, useNavigate } from 'react-router-dom'
import { LogOut, BookOpen, UploadCloud, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <nav className="border-b border-white/5 bg-brand-dark/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 text-white font-extrabold text-2xl tracking-tighter hover:opacity-90 transition-opacity">
                    <div className="w-10 h-10 bg-gradient-premium rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 overflow-hidden">
                        <img
                            src="/logo.jpg"
                            alt=""
                            className="w-full h-full object-cover hidden"
                            onLoad={(e) => e.target.classList.remove('hidden')}
                            onError={(e) => e.target.style.display = 'none'}
                        />
                        <BookOpen className="text-white" size={24} />
                    </div>
                    <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        SKiL MATRiX <span className="text-brand-secondary font-black">NOTES</span>
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    {[
                        ['Features', '#features'],
                        ['Notes Hub', '/'],
                        ['Leaderboard', '/'],
                        ['Dashboard', '/dashboard'],
                        ['Community', '/'],
                    ].map(([label, href]) => (
                        <Link
                            key={label}
                            to={href}
                            className="text-gray-400 hover:text-white font-medium text-[15px] transition-colors"
                        >
                            {label}
                        </Link>
                    ))}

                    {user ? (
                        <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                            <Link to="/upload" className="flex items-center gap-2 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-all">
                                <UploadCloud size={18} />
                                Upload
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2.5 text-gray-400 hover:text-red-400 transition-colors"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-2.5 px-8 rounded-xl shadow-xl shadow-brand-primary/25 transition-all active:scale-95 border border-white/10"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
