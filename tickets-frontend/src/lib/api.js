import axios from 'axios'
import keycloak from './keycloak'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
  if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30)
    } catch {
      keycloak.login()
    }
    config.headers.Authorization = `Bearer ${keycloak.token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) keycloak.login()
    return Promise.reject(err)
  }
)

// ── Events (organizer) ──────────────────────────────────────────────────────
export const createEvent = (data) => api.post('/events', data)
export const updateEvent = (id, data) => api.put(`/events/${id}`, data)
export const listMyEvents = (page = 0, size = 10) =>
  api.get('/events', { params: { page, size } })
export const getMyEvent = (id) => api.get(`/events/${id}`)
export const deleteEvent = (id) => api.delete(`/events/${id}`)

// ── Published events (public) ────────────────────────────────────────────────
export const listPublishedEvents = (page = 0, size = 12) =>
  api.get('/published-events', { params: { page, size } })
export const searchPublishedEvents = (q, page = 0, size = 12) =>
  api.get('/published-events/search', { params: { q, page, size } })
export const getPublishedEvent = (id) => api.get(`/published-events/${id}`)

// ── Tickets (attendee) ────────────────────────────────────────────────────────
export const purchaseTicket = (ticketTypeId) =>
  api.post(`/ticket-types/${ticketTypeId}/purchase`)
export const listMyTickets = (page = 0, size = 10) =>
  api.get('/tickets', { params: { page, size } })
export const getMyTicket = (id) => api.get(`/tickets/${id}`)
export const getTicketQrCode = (id) =>
  api.get(`/tickets/${id}/qr-code`, { responseType: 'blob' })

// ── Validation (staff) ────────────────────────────────────────────────────────
export const validateTicket = (id, method) =>
  api.post('/ticket-validations', { id, method })

export default api
