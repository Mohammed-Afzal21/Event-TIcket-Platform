# Event Ticket Platform

A multi-role ticketing system built with Spring Boot 4.0.5 and Java 21.

## Roles
- **ROLE_ORGANIZER** — create and manage events
- **ROLE_STAFF** — validate tickets at the door
- **Authenticated users** — purchase tickets, view their QR codes
- **Public** — browse published events

---

## Prerequisites
- Java 21
- Maven 3.9+
- Docker & Docker Compose

---

## Quick Start

### 1. Set environment variables
```bash
cp .env.example .env
# Edit .env with your passwords
```

### 2. Start infrastructure
```bash
docker compose --env-file .env up -d
```

### 3. Configure Keycloak
1. Open http://localhost:9090 and log in as admin
2. Create realm: `event-ticket-platform`
3. Create realm roles: `ROLE_ORGANIZER`, `ROLE_STAFF`
4. Create a client (public, direct access grants enabled)
5. Create test users and assign roles

### 4. Run the application
```bash
export DB_PASSWORD=<your-password>
mvn spring-boot:run
```

---

## API Overview

| Method | Path | Role | Description |
|--------|------|------|-------------|
| POST | /api/v1/events | ORGANIZER | Create event |
| PUT | /api/v1/events/{id} | ORGANIZER | Update event |
| GET | /api/v1/events | ORGANIZER | List own events |
| GET | /api/v1/events/{id} | ORGANIZER | Get event |
| DELETE | /api/v1/events/{id} | ORGANIZER | Delete event |
| GET | /api/v1/published-events | Public | List published events |
| GET | /api/v1/published-events/search?q= | Public | Full-text search |
| GET | /api/v1/published-events/{id} | Public | Get published event |
| POST | /api/v1/ticket-types/{id}/purchase | Auth | Purchase ticket |
| GET | /api/v1/tickets | Auth | List own tickets |
| GET | /api/v1/tickets/{id} | Auth | Get ticket details |
| GET | /api/v1/tickets/{id}/qr-code | Auth | Get QR code (PNG) |
| POST | /api/v1/ticket-validations | STAFF | Validate ticket |

---

## Tech Stack
- Java 21, Spring Boot 4.0.5
- Spring Data JPA + PostgreSQL (H2 for tests)
- Spring Security + OAuth2 Resource Server (Keycloak JWT)
- MapStruct 1.6.3 + Lombok 1.18.36
- ZXing 3.5.1 (QR code generation)
