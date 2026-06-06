import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Ticket, LogIn, LogOut, User, ChevronDown, Zap } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'

export default function Navbar() {
  const { authenticated, user, login, logout, isOrganizer, isStaff } = useAuth()
  const [open, setOpen] = useState(false)

  const navLinkClass = ({ isActive }) =>
    cn(
      'font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded transition-all duration-150',
      isActive
        ? 'text-amber-400 bg-amber-500/10'
        : 'text-night-400 hover:text-night-100 hover:bg-night-800'
    )

  return (
    <header className="sticky top-0 z-50 border-b border-night-700/50 bg-night-950/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-amber-500 rounded flex items-center justify-center group-hover:bg-amber-400 transition-colors">
            <Ticket size={14} className="text-night-950" />
          </div>
          <span className="font-display font-700 text-base text-night-50 tracking-tight">
            TicketVault
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/events" className={navLinkClass}>Events</NavLink>
          {authenticated && (
            <NavLink to="/my-tickets" className={navLinkClass}>My Tickets</NavLink>
          )}
          {isOrganizer && (
            <NavLink to="/organizer" className={navLinkClass}>Organizer</NavLink>
          )}
          {isStaff && (
            <NavLink to="/staff" className={navLinkClass}>Staff</NavLink>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {authenticated ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-night-800 border border-night-600/40 hover:border-amber-500/40 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <User size={12} className="text-amber-400" />
                </div>
                <span className="font-mono text-xs text-night-300 max-w-[120px] truncate hidden sm:block">
                  {user?.name}
                </span>
                <ChevronDown size={12} className="text-night-500" />
              </button>

              {open && (
                <div className="absolute right-0 top-full mt-1 w-44 card border-night-600/60 py-1 shadow-xl shadow-night-950/50">
                  <button
                    onClick={() => { logout(); setOpen(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-night-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={13} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={login} className="btn-primary flex items-center gap-1.5 py-1.5 px-4">
              <LogIn size={13} />
              <span>Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
