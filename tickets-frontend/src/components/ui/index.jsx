import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

export function Spinner({ className }) {
  return <Loader2 className={cn('animate-spin text-amber-400', className)} size={20} />
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={28} />
        <p className="font-mono text-xs text-night-500 uppercase tracking-widest">Loading</p>
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-night-800 border border-night-600/40 flex items-center justify-center mb-4">
          <Icon size={22} className="text-night-500" />
        </div>
      )}
      <p className="font-display text-lg font-600 text-night-200 mb-1">{title}</p>
      {description && <p className="text-sm text-night-500 max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  )
}

export function ErrorMessage({ message }) {
  return (
    <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 font-mono">
      {message || 'Something went wrong.'}
    </div>
  )
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night-950/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-up">
        <div className="flex items-center justify-between p-5 border-b border-night-700/50">
          <h2 className="font-display text-lg font-600 text-night-50">{title}</h2>
          <button onClick={onClose} className="btn-ghost py-1 px-2 text-night-400">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        className="btn-secondary py-1.5 px-3 disabled:opacity-30"
      >
        ←
      </button>
      <span className="font-mono text-xs text-night-400 px-3">
        {page + 1} / {totalPages}
      </span>
      <button
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
        className="btn-secondary py-1.5 px-3 disabled:opacity-30"
      >
        →
      </button>
    </div>
  )
}

export function FormField({ label, error, children }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      {children}
      {error && <p className="mt-1 text-xs text-red-400 font-mono">{error}</p>}
    </div>
  )
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        'w-full bg-night-900 border border-night-600/60 rounded-lg px-4 py-2.5',
        'text-night-100 font-body text-sm focus:outline-none focus:border-amber-500/60',
        'focus:ring-1 focus:ring-amber-500/20 transition-all duration-150',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}
