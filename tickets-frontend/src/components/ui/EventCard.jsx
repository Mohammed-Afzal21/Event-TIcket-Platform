import { Link } from 'react-router-dom'
import { Calendar, MapPin, Ticket } from 'lucide-react'
import { formatDate, formatCurrency, statusColor } from '../../lib/utils'

export default function EventCard({ event, linkTo, actions }) {
  const minPrice = event.ticketTypes?.length
    ? Math.min(...event.ticketTypes.map((t) => t.price))
    : null

  return (
    <div className="card p-5 flex flex-col gap-4 hover:border-amber-500/30 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-600 text-night-50 group-hover:text-amber-300 transition-colors leading-tight">
          {event.name}
        </h3>
        <span className={statusColor(event.status)}>
          {event.status}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-night-400">
          <Calendar size={12} className="text-amber-500/70 shrink-0" />
          <span className="font-mono">{formatDate(event.start)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-night-400">
          <MapPin size={12} className="text-amber-500/70 shrink-0" />
          <span className="truncate">{event.venue}</span>
        </div>
        {minPrice != null && (
          <div className="flex items-center gap-2 text-xs text-night-400">
            <Ticket size={12} className="text-amber-500/70 shrink-0" />
            <span className="font-mono">
              From {formatCurrency(minPrice)}
            </span>
          </div>
        )}
      </div>

      {/* Ticket types count */}
      {event.ticketTypes?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {event.ticketTypes.slice(0, 3).map((tt) => (
            <span key={tt.id} className="badge badge-night text-night-400">
              {tt.name}
            </span>
          ))}
          {event.ticketTypes.length > 3 && (
            <span className="badge badge-night text-night-500">
              +{event.ticketTypes.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto pt-1 border-t border-night-700/40">
        {linkTo && (
          <Link
            to={linkTo}
            className="btn-ghost py-1 px-3 text-xs font-mono text-amber-400 hover:bg-amber-500/10"
          >
            View details →
          </Link>
        )}
        {actions}
      </div>
    </div>
  )
}
