import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyEvent, updateEvent } from '../../lib/api'
import EventForm from '../../components/ui/EventForm'
import { PageLoader, ErrorMessage } from '../../components/ui'
import toast from 'react-hot-toast'

export default function EditEventPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['my-event', id],
    queryFn: () => getMyEvent(id).then((r) => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: (data) => updateEvent(id, data),
    onSuccess: () => {
      toast.success('Event updated!')
      qc.invalidateQueries(['my-event', id])
      qc.invalidateQueries(['my-events'])
      navigate('/organizer')
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to update event')
    },
  })

  if (isLoading) return <PageLoader />
  if (error || !event) return (
    <div className="page-container">
      <ErrorMessage message="Event not found." />
    </div>
  )

  return (
    <div className="page-container max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="font-mono text-xs text-night-500 hover:text-amber-400 mb-6 flex items-center gap-1 transition-colors"
      >
        ← Back
      </button>

      <div className="mb-6 animate-fade-up">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-500 mb-2">
          Organizer
        </p>
        <h1 className="font-display text-3xl font-800 text-night-50 leading-none">
          Edit Event
        </h1>
      </div>

      <div className="card p-6 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <EventForm
          initial={event}
          onSubmit={(data) => updateMutation.mutate(data)}
          loading={updateMutation.isPending}
        />
      </div>
    </div>
  )
}
