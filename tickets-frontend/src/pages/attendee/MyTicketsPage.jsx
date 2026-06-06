import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { listMyTickets } from '../../lib/api'
import { PageLoader, EmptyState, Pagination } from '../../components/ui'
import { Ticket, QrCode, Calendar, MapPin } from 'lucide-react'
import { formatDate, formatCurrency } from '../../lib/utils'

export default function MyTicketsPage() {
  const [page, setPage] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['my-tickets', page],
    queryFn: () => listMyTickets(page).then((r) => r.data),
  })

  const tickets = data?.content ?? []
  const totalPages = data?.page?.totalPages ?? 1

  return (
    <div className="page-container">
      <div className="mb-8 animate-fade-up">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-500 mb-2">Attendee</p>
        <h1 className="font-display text-4xl font-800 text-night-50 leading-none">My Tickets</h1>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No tickets yet"
          description="Browse events and purchase your first ticket."
          action={
            <Link to="/events" className="btn-primary inline-flex items-center gap-1.5 mt-1">
              Browse events
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {tickets.map((ticket, i) => (
              <div
                key={ticket.id}
                className="card p-5 flex items-center justify-between gap-4 hover:border-amber-500/30 transition-all animate-fade-up"
                style={{ animationDelay: `${i * 40}ms`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Ticket size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="font-display font-600 text-night-50">
                      {ticket.ticketType?.name}
                    </p>
                    <p className="font-mono text-xs text-night-500 mt-0.5">
                      #{ticket.id?.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="badge badge-green">{ticket.status}</span>
                </div>

                <Link
                  to={`/my-tickets/${ticket.id}`}
                  className="btn-ghost text-xs font-mono text-amber-400 hover:bg-amber-500/10 flex items-center gap-1.5 shrink-0"
                >
                  <QrCode size={13} />
                  View QR
                </Link>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
