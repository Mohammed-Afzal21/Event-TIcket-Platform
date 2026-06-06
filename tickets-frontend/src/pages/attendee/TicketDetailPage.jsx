import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getMyTicket, getTicketQrCode } from '../../lib/api'
import { PageLoader, ErrorMessage } from '../../components/ui'
import { formatDate, formatCurrency } from '../../lib/utils'
import { Ticket, Calendar, MapPin, DollarSign, QrCode } from 'lucide-react'

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['my-ticket', id],
    queryFn: () => getMyTicket(id).then((r) => r.data),
  })

  const { data: qrBlob } = useQuery({
    queryKey: ['ticket-qr', id],
    queryFn: () => getTicketQrCode(id).then((r) => r.data),
    enabled: !!ticket,
  })

  const qrUrl = qrBlob ? URL.createObjectURL(qrBlob) : null

  if (isLoading) return <PageLoader />
  if (error || !ticket) return (
    <div className="page-container"><ErrorMessage message="Ticket not found." /></div>
  )

  return (
    <div className="page-container max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="font-mono text-xs text-night-500 hover:text-amber-400 mb-6 flex items-center gap-1 transition-colors"
      >
        ← My Tickets
      </button>

      <div className="animate-fade-up">
        {/* Ticket card */}
        <div className="card overflow-hidden">
          {/* Top band */}
          <div className="bg-gradient-to-r from-amber-600/20 to-amber-500/5 border-b border-amber-500/20 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs text-amber-500 uppercase tracking-widest mb-1">
                  Ticket
                </p>
                <h1 className="font-display text-2xl font-700 text-night-50">
                  {ticket.eventName}
                </h1>
              </div>
              <span className="badge badge-green">{ticket.status}</span>
            </div>
          </div>

          <div className="p-5 flex flex-col sm:flex-row gap-6">
            {/* Info */}
            <div className="flex-1 flex flex-col gap-3">
              <div>
                <p className="label">Ticket type</p>
                <p className="text-night-100 font-display font-500">
                  {ticket.description || 'Standard Admission'}
                </p>
              </div>
              <div>
                <p className="label">Price paid</p>
                <p className="font-mono text-xl font-500 text-amber-400">
                  {formatCurrency(ticket.price)}
                </p>
              </div>
              <div>
                <p className="label">Venue</p>
                <div className="flex items-center gap-1.5 text-night-200 text-sm">
                  <MapPin size={13} className="text-amber-500" />
                  {ticket.eventVenue}
                </div>
              </div>
              <div>
                <p className="label">Date</p>
                <div className="flex items-center gap-1.5 text-night-200 text-sm font-mono">
                  <Calendar size={13} className="text-amber-500" />
                  {formatDate(ticket.eventStart)}
                </div>
              </div>
              <div>
                <p className="label">Ticket ID</p>
                <p className="font-mono text-xs text-night-500 break-all">{id}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <p className="label">Entry QR Code</p>
              {qrUrl ? (
                <div className="w-44 h-44 bg-white rounded-xl p-2 shadow-lg shadow-night-950/50">
                  <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-44 h-44 bg-night-900 border border-night-700 rounded-xl flex items-center justify-center">
                  <QrCode size={40} className="text-night-600" />
                </div>
              )}
              <p className="font-mono text-xs text-night-600 text-center max-w-[176px]">
                Present at entry
              </p>
            </div>
          </div>

          {/* Dashed divider */}
          <div className="mx-5 border-t border-dashed border-night-700" />

          {/* Footer */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Ticket size={14} className="text-night-600" />
              <span className="font-mono text-xs text-night-600">
                #{id?.slice(0, 8).toUpperCase()}
              </span>
            </div>
            {qrUrl && (
              <a
                href={qrUrl}
                download={`ticket-${id?.slice(0, 8)}.png`}
                className="btn-ghost text-xs font-mono py-1 text-amber-500 hover:bg-amber-500/10"
              >
                ↓ Download QR
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
