import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listPublishedEvents, searchPublishedEvents } from '../../lib/api'
import EventCard from '../../components/ui/EventCard'
import { PageLoader, EmptyState, Pagination } from '../../components/ui'
import { Search, CalendarDays } from 'lucide-react'

export default function EventsPage() {
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const handleSearch = (val) => {
    setQuery(val)
    clearTimeout(window._searchTimer)
    window._searchTimer = setTimeout(() => {
      setDebouncedQuery(val)
      setPage(0)
    }, 400)
  }

  const { data, isLoading } = useQuery({
    queryKey: ['published-events', debouncedQuery, page],
    queryFn: () =>
      debouncedQuery
        ? searchPublishedEvents(debouncedQuery, page).then((r) => r.data)
        : listPublishedEvents(page).then((r) => r.data),
  })

  const events = data?.content ?? []
  const totalPages = data?.page?.totalPages ?? 1

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="mb-10 animate-fade-up">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-500 mb-2">
          Discover
        </p>
        <h1 className="font-display text-4xl font-800 text-night-50 leading-none mb-3">
          Upcoming Events
        </h1>
        <p className="text-night-400 text-sm max-w-md">
          Find concerts, conferences, and experiences near you.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-night-500" />
        <input
          className="input pl-10"
          placeholder="Search by name or venue…"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <PageLoader />
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events found"
          description={debouncedQuery ? 'Try a different search term.' : 'Check back soon for upcoming events.'}
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
                <EventCard event={event} linkTo={`/events/${event.id}`} />
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
