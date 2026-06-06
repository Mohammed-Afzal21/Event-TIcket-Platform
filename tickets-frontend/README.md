# TicketVault Frontend

React + Vite + Tailwind CSS frontend for the Event Ticket Platform.

## Features

**Public**
- Browse and search published events
- View event details and ticket types
- Purchase tickets (authenticated users)

**Attendee**
- View purchased tickets
- Display QR code for entry validation
- Download QR code

**Organizer** (requires `ROLE_ORGANIZER`)
- Create, edit, delete events
- Manage ticket types and availability
- Set sales windows and event status

**Staff** (requires `ROLE_STAFF`)
- Scan QR codes for validation
- Manual ticket validation by ID
- Real-time validation status

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set environment variables
```bash
cp .env.example .env
# Edit .env with your Keycloak details
```

### 3. Start dev server
```bash
npm run dev
```

Frontend runs on `http://localhost:3000` with API proxy to `:8080`.

---

## Keycloak Setup

1. Create realm: `event-ticket-platform`
2. Create roles: `ROLE_ORGANIZER`, `ROLE_STAFF`
3. Create client:
   - Client ID: `tickets-frontend`
   - Client type: **Public**
   - Standard flow: ✓
   - Direct access grants: ✓
   - Valid redirect URIs: `http://localhost:3000/*`
   - Web origins: `http://localhost:3000`
4. Create test users and assign roles

---

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** — industrial dark theme
- **React Router** — SPA routing with protected routes
- **Tanstack Query** — server state management
- **Keycloak JS** — authentication
- **Axios** — API client with JWT injection
- **html5-qrcode** — QR scanning for staff
- **react-hot-toast** — notifications

---

## Design Direction

**Dark Industrial**
- Night slate backgrounds (`#0c0c09` → `#4f4f47`)
- Amber accents (`#f59e0b`)
- Typography: `Syne` (display), `DM Sans` (body), `DM Mono` (data)
- Subtle grid background
- Minimal shadows, flat surfaces
- High-contrast UI optimized for quick scanning

---

## Project Structure

```
src/
├── components/
│   ├── layout/         # Navbar, Footer
│   ├── ui/             # Reusable UI components
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx # Keycloak auth state
├── hooks/              # Custom hooks
├── lib/
│   ├── api.js          # Axios + API methods
│   ├── keycloak.js     # Keycloak init
│   └── utils.js        # Helpers
├── pages/
│   ├── public/         # Events browse, detail
│   ├── attendee/       # My tickets, QR view
│   ├── organizer/      # Dashboard, CRUD
│   └── staff/          # QR scanner
├── App.jsx             # Router
├── main.jsx            # Entry
└── index.css           # Global styles
```

---

## Build for Production

```bash
npm run build
```

Static files output to `dist/`. Serve with any static host or reverse proxy to your backend.
