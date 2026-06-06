import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createEvent } from '../../lib/api'
import EventForm from '../../components/ui/EventForm'
import toast from 'react-hot-toast'

export default function CreateEventPage() {
  const navigate = useNavigate()

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      toast.success('Event created!')
      navigate('/organizer')
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to create event')
    },
  })

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
          Create Event
        </h1>
      </div>

      <div className="card p-6 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <EventForm
          onSubmit={(data) => createMutation.mutate(data)}
          loading={createMutation.isPending}
        />
      </div>
    </div>
  )
}
