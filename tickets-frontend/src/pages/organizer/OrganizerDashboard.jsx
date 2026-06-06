import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listMyEvents, deleteEvent } from '../../lib/api'
import EventCard from '../../components/ui/EventCard'
import { PageLoader, EmptyState, Pagination, Modal } from '../../components/ui'
import { Plus, Settings, Trash2, Edit } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function OrganizerDashboard() {
  const [page, setPage] = useState(0)
  const [deleteModal, setDeleteModal] = useState(null)
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['my-events', page],
    queryFn: () => listMyEvents(page).then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      toast.success('Event deleted')
      qc.invalidateQueries(['my-events'])
      setDeleteModal(null)
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Delete failed')
    },
  })

  const events = data?.content ?? []
  const totalPages = data?.page?.totalPages ?? 1

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 animate-fade-up">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber-500 mb-2">
            Organizer
          </p>
          <h1 className="font-display text-4xl font-800 text-night-50 leading-none">
            My Events
          </h1>
        </div>
        <Link to="/organizer/create" className="btn-primary flex items-center gap-1.5 shrink-0">
          <Plus size={14} />
          Create Event
        </Link>
      </div>

      {/* Events */}
      {isLoading ? (
        <PageLoader />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Settings}
          title="No events yet"
          description="Create your first event to get started."
          action={
            <Link to="/organizer/create" className="btn-primary inline-flex items-center gap-1.5 mt-1">
              <Plus size={14} />
              Create Event
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event, i) => (
              <div
                key={event.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 50}ms`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <EventCard
                  event={event}
                  linkTo={null}
                  actions={
                    <>
                      <button
                        onClick={() => navigate(`/organizer/edit/${event.id}`)}
                        className="btn-ghost py-1 px-2 text-xs text-amber-400 hover:bg-amber-500/10 flex items-center gap-1"
                      >
                        <Edit size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal(event)}
                        className="btn-ghost py-1 px-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  }
                />
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {/* Delete confirmation */}
      <Modal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Event"
      >
        <p className="text-night-300 mb-4 text-sm">
          Are you sure you want to delete <strong className="text-night-100">{deleteModal?.name}</strong>?
          This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setDeleteModal(null)} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={() => deleteMutation.mutate(deleteModal.id)}
            disabled={deleteMutation.isPending}
            className="btn-danger"
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
