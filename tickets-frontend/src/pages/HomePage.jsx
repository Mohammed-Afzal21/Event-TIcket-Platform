import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Shield, QrCode, TrendingUp, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const { authenticated, login } = useAuth()

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      desc: 'Purchase tickets in seconds with seamless checkout.',
    },
    {
      icon: Shield,
      title: 'Secure & Verified',
      desc: 'Keycloak-powered authentication ensures your data is safe.',
    },
    {
      icon: QrCode,
      title: 'QR Check-In',
      desc: 'Staff can validate tickets instantly with built-in QR scanning.',
    },
    {
      icon: TrendingUp,
      title: 'Organizer Tools',
      desc: 'Manage events, ticket types, and sales from one dashboard.',
    },
  ]

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center py-20 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse-slow" />
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
            Industrial-grade ticketing
          </span>
        </div>

        <h1 className="font-display text-6xl sm:text-7xl font-800 text-night-50 leading-none mb-6 tracking-tight">
          Event Tickets,<br />
          <span className="text-amber-500">Engineered</span>
        </h1>

        <p className="text-lg text-night-400 max-w-xl mx-auto mb-10">
          Multi-role ticketing platform built for organizers, staff, and attendees.
          Purchase, validate, and manage events with precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/events"
            className="btn-primary flex items-center gap-2 px-6 py-3 text-base"
          >
            Browse Events
            <ArrowRight size={16} />
          </Link>
          {!authenticated && (
            <button onClick={login} className="btn-secondary px-6 py-3 text-base">
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-20">
        {features.map((feat, i) => (
          <div
            key={i}
            className="card p-6 flex flex-col gap-3 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms`, opacity: 0, animationFillMode: 'forwards' }}
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <feat.icon size={18} className="text-amber-400" />
            </div>
            <h3 className="font-display font-600 text-night-100">{feat.title}</h3>
            <p className="text-sm text-night-500 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="card p-10 text-center max-w-2xl mx-auto bg-gradient-to-br from-amber-600/10 to-amber-500/5 border-amber-500/20 animate-fade-up">
        <h2 className="font-display text-2xl font-700 text-night-50 mb-2">
          Ready to organize your event?
        </h2>
        <p className="text-night-400 text-sm mb-6">
          Create events, manage ticket types, and track sales in real time.
        </p>
        {authenticated ? (
          <Link to="/organizer" className="btn-primary inline-flex items-center gap-2">
            Go to Dashboard
            <ArrowRight size={14} />
          </Link>
        ) : (
          <button onClick={login} className="btn-primary">
            Get Started
          </button>
        )}
      </div>
    </div>
  )
}
