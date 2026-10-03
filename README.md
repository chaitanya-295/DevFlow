# DevFlow — Multi-User Developer Project & Issue Management Platform

A full-stack, enterprise-grade project and issue tracker built for high-performance developer teams.

## Tech Stack
- **Frontend**:
  - React 18 (ES6+ Javascript)
  - React Router v6
  - Redux Toolkit & RTK Query
  - React Hook Form + Zod validation
  - Tailwind CSS / Vanilla CSS modern aesthetics
  - Recharts for metrics & sprint burndown visualizations
  - Lucide Icons
- **Backend**:
  - Java 17 + Spring Boot 3
  - Spring Security 6 + Stateless JWT Authentication
  - Spring Data MongoDB (NoSQL Document Store)
  - MongoDB 6.0 distributed database
  - RESTful APIs with role-based access control (ADMIN, PROJECT_MANAGER, DEVELOPER)
- **DevOps & Containerization**:
  - Docker & Docker Compose
  - Multi-stage Dockerfiles for Frontend and Backend

---

## Directory Structure
```
DevFlow/
├── docker-compose.yml
├── README.md
├── frontend/             # React + Vite + Tailwind + RTK Query + Recharts
│   ├── src/
│   │   ├── api/          # RTK Query service slices
│   │   ├── components/   # UI components (Kanban, charts, navigation, modals)
│   │   ├── pages/        # LandingPage, Dashboard, Projects, Issues, Analytics
│   │   ├── store/        # Redux Toolkit store & slices
│   │   └── App.jsx
├── backend/              # Spring Boot 3 application
│   ├── src/main/java/com/devflow/
│   │   ├── config/       # SecurityConfig, CorsConfig
│   │   ├── controller/   # Auth, Project, Issue, Analytics controllers
│   │   ├── dto/          # Requests & Response DTOs
│   │   ├── model/        # MongoDB Document entities (User, Project, Issue, Release)
│   │   ├── repository/   # Spring Data Mongo repositories
│   │   ├── security/     # JWT filter, UserDetailsService
│   │   └── service/      # Business logic
│   └── pom.xml
```

## Running with Docker
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/api`
- MongoDB: `localhost:27017`
