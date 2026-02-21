import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Search,
    Zap,
    BookOpen,
    BarChart3,
    Bot,
    CheckCircle2,
    XCircle,
    Plus,
    Minus,
    ChevronUp,
    Globe,
    ShieldCheck,
    Users
} from 'lucide-react'

const Home = () => {
    const [openFaq, setOpenFaq] = useState(null)

    const faqs = [
        {
            q: "What is SKiL MATRiX Notes?",
            a: "SKiL MATRiX Notes is an all-in-one platform for sharing university notes, utilizing AI-powered study tools and real-time progress tracking for students."
        },
        {
            q: "Is the platform free to use?",
            a: "Yes! We offer a generous free tier called 'Admit Card' that gives you unlimited note access and basic dashboard features."
        },
        {
            q: "How does the AI Doubt Solver work?",
            a: "Our AI model is fine-tuned on academic data to provide instant, accurate answers to your specific course-related queries."
        },
        {
            q: "How do I track my progress?",
            a: "The dashboard automatically visualizes your learning journey based on the notes you study and the goals you set."
        },
        {
            q: "Is my data secure?",
            a: "We use enterprise-grade encryption and Supabase's secure infrastructure to ensure your personal academic data stays private."
        }
    ]

    return (
        <div className="w-full bg-brand-dark text-white font-sans overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none overflow-hidden opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary blur-[120px] rounded-full" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-brand-accent blur-[120px] rounded-full" />
                </div>

                <div className="container mx-auto max-w-7xl relative">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-left space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest text-brand-accent uppercase">
                                <Zap size={14} className="fill-brand-accent animate-pulse" />
                                🔥 Next-Gen Learning Platform
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tighter">
                                Master Your <br />
                                Academics with <br />
                                <span className="text-transparent bg-clip-text bg-gradient-premium">
                                    SKiL MATRiX
                                </span>{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-purple-500">
                                    NOTES
                                </span>
                            </h1>

                            <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
                                The all-in-one platform for notes, AI-powered tools, and real-time progress tracking. Built by students, for students.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link to="/login" className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3.5 px-10 rounded-2xl shadow-2xl shadow-brand-primary/30 transition-all hover:scale-105 active:scale-95 text-base">
                                    Explore Notes
                                </Link>
                            </div>

                            <div className="flex items-center gap-10 pt-8 text-gray-500 border-t border-white/5">
                                <div>
                                    <div className="text-3xl font-black text-white">6</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">Views</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white">0</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">Downloads</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white">0</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">Students</div>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Preview Mockup */}
                        <div className="relative group lg:mt-0 mt-12">
                            <div className="absolute inset-0 bg-brand-primary/20 blur-[100px] rounded-full group-hover:bg-brand-primary/30 transition-colors" />
                            <div className="relative border border-white/10 rounded-3xl overflow-hidden shadow-2xl bg-brand-surface/50 backdrop-blur-md ring-1 ring-white/20">
                                <img
                                    src="/hero.png"
                                    alt="SKiL MATRiX Dashboard"
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features (Why SKiL MATRiX?) */}
            <section id="features" className="py-24 px-6 bg-brand-dark">
                <div className="container mx-auto max-w-7xl text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-20 tracking-tight">
                        Why SKiL MATRiX?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <BookOpen className="text-brand-secondary" size={28} />,
                                title: "Notes Hub",
                                desc: "Personalized note recommendation based on your branch, year, and upcoming exams."
                            },
                            {
                                icon: <Bot className="text-brand-accent" size={28} />,
                                title: "AI Doubt Solver",
                                desc: "Instant answers to your academic queries using our fine-tuned AI model."
                            },
                            {
                                icon: <BarChart3 className="text-brand-primary" size={28} />,
                                title: "Progress Tracker",
                                desc: "Visualize your learning journey and stay on top of your semester goals."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:border-white/10 text-left relative overflow-hidden">
                                <div className="p-3 bg-white/5 rounded-2xl w-fit mb-6 ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing / Investment */}
            <section className="py-24 px-6 relative">
                <div className="container mx-auto max-w-7xl text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Invest in Your Future</h2>
                    <p className="text-gray-500 mb-20">Choose the plan that fits your academic goals.</p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Tier */}
                        <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] text-left space-y-8 flex flex-col">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Admit Card</h3>
                                <p className="text-gray-500 text-sm">Essential access for every student.</p>
                            </div>
                            <div className="text-5xl font-black">₹0 <span className="text-lg text-gray-500 font-medium">/ mo</span></div>
                            <ul className="space-y-4 flex-1">
                                {[
                                    [<CheckCircle2 size={18} className="text-green-500" />, "Unlimited Note Views"],
                                    [<CheckCircle2 size={18} className="text-green-500" />, "Basic Dashboard Access"],
                                    [<Zap size={18} className="text-amber-500" />, "Limited AI Doubts (3/day)"],
                                    [<XCircle size={18} className="text-red-500" />, "Model Paper Generator"],
                                    [<XCircle size={18} className="text-red-500" />, "Ad-free Experience"],
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-300">
                                        {item[0]} {item[1]}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all">
                                Get Started
                            </button>
                        </div>

                        {/* Pro Tier */}
                        <div className="p-8 rounded-3xl border-2 border-brand-primary bg-brand-surface relative text-left space-y-8 flex flex-col shadow-2xl shadow-brand-primary/20 scale-105 z-10">
                            <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1.5 bg-brand-secondary text-black text-[10px] font-black uppercase rounded-full tracking-widest">
                                Most Popular
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Scholar <span className="text-brand-secondary">PRO</span></h3>
                                <p className="text-gray-400 text-sm">Detailed insights & powerful AI tools.</p>
                            </div>
                            <div className="text-5xl font-black">₹99 <span className="text-lg text-gray-400 font-medium">/ mo</span></div>
                            <ul className="space-y-4 flex-1">
                                {[
                                    [<CheckCircle2 size={18} className="text-green-500" />, "Everything in Free"],
                                    [<Zap size={18} className="text-brand-secondary" />, "Unlimited AI Model Papers"],
                                    [<Zap size={18} className="text-brand-secondary" />, "Deep Performance Analytics"],
                                    [<CheckCircle2 size={18} className="text-green-500" />, "Verified \"Scholar\" Badge"],
                                    [<CheckCircle2 size={18} className="text-green-500" />, "100% Ad-free Interface"],
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-200">
                                        {item[0]} {item[1]}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 rounded-xl bg-gradient-premium hover:opacity-90 text-white font-bold transition-all shadow-lg shadow-brand-primary/30">
                                Upgrade to Scholar
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-24 px-6 border-y border-white/5 bg-white/[0.01]">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            ["0", "TOTAL NOTE VIEWS"],
                            ["0", "NOTES DOWNLOADED"],
                            ["0", "ACTIVE STUDENTS"],
                            ["9.8/10", "STUDY SATISFACTION"]
                        ].map((stat, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="text-5xl font-black text-white/90">{stat[0]}</div>
                                <div className="text-xs font-bold text-gray-600 tracking-widest">{stat[1]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-20 tracking-tight">Frequently Asked Questions</h2>
                    <div className="divide-y divide-white/5 text-left">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="py-6">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between text-lg font-bold hover:text-brand-secondary transition-colors group"
                                >
                                    <span>{faq.q}</span>
                                    {openFaq === idx ? <Minus size={20} /> : <Plus size={20} className="group-hover:rotate-90 transition-transform" />}
                                </button>
                                {openFaq === idx && (
                                    <p className="mt-4 text-gray-400 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                                        {faq.a}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="pt-24 pb-12 px-6 border-t border-white/5">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-4 gap-16 mb-20">
                        <div className="md:col-span-2 space-y-8">
                            <div className="flex items-center gap-3 text-white font-extrabold text-2xl tracking-tighter">
                                <div className="w-10 h-10 bg-gradient-premium rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                                    <img
                                        src="/logo.jpg"
                                        alt=""
                                        className="w-full h-full object-cover hidden"
                                        onLoad={(e) => e.target.classList.remove('hidden')}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                    <BookOpen size={24} />
                                </div>
                                <span>SKiL MATRiX <span className="text-brand-secondary">NOTES</span></span>
                            </div>
                            <p className="text-gray-500 max-w-sm leading-relaxed">
                                Empowering students with intelligent academic tools.
                                <br />
                                <span className="text-brand-secondary font-bold">⚡ Powered by real-time data & AI-assisted learning</span>
                            </p>
                            <div className="flex gap-4">
                                {["📓 notes", "👥 students", "📥 downloads"].map((tag, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs font-medium text-gray-500">
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-bold text-lg">Platform</h4>
                            <ul className="space-y-4 text-gray-500">
                                {["Notes Hub", "Leaderboard", "AI Study Planner", "Exam Strategist", "Leaderboard"].map((link, idx) => (
                                    <li key={idx}><Link to="/" className="hover:text-white transition-colors">{link}</Link></li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-bold text-lg">Company</h4>
                            <ul className="space-y-4 text-gray-500">
                                {["About", "Contact", "Privacy", "Terms", "Report an Issue"].map((link, idx) => (
                                    <li key={idx}><Link to="/" className="hover:text-white transition-colors">{link}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-white/5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                        <span>© 2026 SKiL MATRiX. All rights reserved.</span>
                        <span className="text-center md:text-left">We respect academic integrity. No copyrighted content is hosted directly.</span>
                        <div className="flex items-center gap-4">
                            <span>Made with ❤️ for students</span>
                            <button className="bg-brand-primary p-2 rounded-lg text-white">
                                <ChevronUp size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home
