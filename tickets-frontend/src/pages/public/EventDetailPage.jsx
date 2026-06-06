import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPublishedEvent, purchaseTicket } from '../../lib/api'
import { PageLoader, ErrorMessage } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { formatDate, formatCurrency } from '../../lib/utils'
import { Calendar, MapPin, Clock, Ticket, ShoppingCart, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EventDetailPage() {
  const { id } = useParams()
  const { authenticated, login } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['published-event', id],
    queryFn: () => getPublishedEvent(id).then((r) => r.data),
  })

  const purchaseMutation = useMutation({
    mutationFn: (ticketTypeId) => purchaseTicket(ticketTypeId),
    onSuccess: () => {
      toast.success('Ticket purchased! Check My Tickets.', { icon: '🎟️' })
      qc.invalidateQueries(['my-tickets'])
    },
    onError: (err) => {
      const msg = err.response?.data?.error || 'Purchase failed'
      toast.error(msg)
    },
  })

  if (isLoading) return <PageLoader />
  if (error || !event) return (
    <div className="page-container">
      <ErrorMessage message="Event not found." />
    </div>
  )

  return (
    <div className="page-container max-w-4xl">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="font-mono text-xs text-night-500 hover:text-amber-400 mb-6 flex items-center gap-1 transition-colors"
      >
        ← Back
      </button>

      <div className="animate-fade-up">
        {/* Header */}
        <div className="mb-8">
          <span className="badge badge-green mb-3 inline-flex">PUBLISHED</span>
          <h1 className="font-display text-4xl font-800 text-night-50 leading-tight mb-4">
            {event.name}
          </h1>
          <div className="flex flex-wrap gap-5 text-sm text-night-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-amber-500" />
              <span className="font-mono">{formatDate(event.start)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-amber-500" />
              <span className="font-mono">Until {formatDate(event.end)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-amber-500" />
              <span>{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Sales window */}
        {event.salesStart && (
          <div className="card p-4 mb-8 flex flex-wrap gap-4 text-xs font-mono text-night-400">
            <div>
              <span className="text-night-600 uppercase tracking-wider block mb-0.5">Sales open</span>
              {formatDate(event.salesStart)}
            </div>
            <div>
              <span className="text-night-600 uppercase tracking-wider block mb-0.5">Sales close</span>
              {formatDate(event.salesEnd)}
            </div>
          </div>
        )}

        {/* Ticket types */}
        <div>
          <h2 className="font-display text-xl font-600 text-night-100 mb-4 flex items-center gap-2">
            <Ticket size={18} className="text-amber-500" />
            Ticket Types
          </h2>

          <div className="flex flex-col gap-3">
            {event.ticketTypes?.map((tt) => (
              <div key={tt.id} className="card p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-base font-600 text-night-50">{tt.name}</p>
                  {tt.description && (
                    <p className="text-sm text-night-400 mt-0.5">{tt.description}</p>
                  )}
                  {tt.totalAvailable != null && (
                    <p className="font-mono text-xs text-night-500 mt-1">
                      {tt.totalAvailable} available
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="font-display text-xl font-700 text-amber-400">
                      {formatCurrency(tt.price)}
                    </p>
                  </div>
                  {authenticated ? (
                    <button
                      className="btn-primary flex items-center gap-1.5"
                      disabled={purchaseMutation.isPending}
                      onClick={() => purchaseMutation.mutate(tt.id)}
                    >
                      <ShoppingCart size={13} />
                      Buy
                    </button>
                  ) : (
                    <button className="btn-primary" onClick={login}>
                      Sign in to buy
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
