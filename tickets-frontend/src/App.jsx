import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import EventsPage from './pages/public/EventsPage'
import EventDetailPage from './pages/public/EventDetailPage'
import MyTicketsPage from './pages/attendee/MyTicketsPage'
import TicketDetailPage from './pages/attendee/TicketDetailPage'
import OrganizerDashboard from './pages/organizer/OrganizerDashboard'
import CreateEventPage from './pages/organizer/CreateEventPage'
import EditEventPage from './pages/organizer/EditEventPage'
import StaffPage from './pages/staff/StaffPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />

                <Route
                  path="/my-tickets"
                  element={
                    <ProtectedRoute>
                      <MyTicketsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-tickets/:id"
                  element={
                    <ProtectedRoute>
                      <TicketDetailPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/organizer"
                  element={
                    <ProtectedRoute requireRole="ORGANIZER">
                      <OrganizerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/create"
                  element={
                    <ProtectedRoute requireRole="ORGANIZER">
                      <CreateEventPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/edit/:id"
                  element={
                    <ProtectedRoute requireRole="ORGANIZER">
                      <EditEventPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute requireRole="STAFF">
                      <StaffPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <footer className="border-t border-night-700/50 py-6 mt-20">
              <div className="max-w-6xl mx-auto px-4 text-center">
                <p className="font-mono text-xs text-night-600">
                  TicketVault &copy; {new Date().getFullYear()} • Built with Spring Boot + React
                </p>
              </div>
            </footer>
          </div>

          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'font-body text-sm',
              style: {
                background: '#1e1e1a',
                color: '#e8e8e4',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
