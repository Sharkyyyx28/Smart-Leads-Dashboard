# 🚀 Smart Leads Dashboard — Enterprise SaaS CRM

A production-quality, enterprise-grade Lead Management Dashboard built with the MERN stack and a strict **TypeScript-first architecture**. Designed to look and function like a real, scalable SaaS dashboard built by senior engineering teams.

---

## 🌟 Key Features

### 🔐 1. Advanced Authentication System
- **Secure JWT Auth**: Access token-based authentication with `bcrypt` password hashing.
- **Role-Based Access Control (RBAC)**: Supports **Admin** (full access) and **Sales User** (manages only permitted/assigned leads).
- **Protected Routes & Middleware**: Fully typed Express request objects (`req.user`) and centralized React Router route guards.

### 📊 2. Comprehensive Leads Management (CRUD)
- **Optimistic UI Updates**: Instantaneous UI state feedback on updates and deletions using TanStack Query `onMutate`.
- **Confirmation Guards**: Professional deletion confirmation modals preventing accidental data loss.
- **Lead Tracking**: Tracks Name, Email, Status (`New`, `Contacted`, `Qualified`, `Lost`), Source (`Website`, `Instagram`, `Referral`), and Assigned Reps.

### 🔍 3. Professional Advanced Filtering & Search
- **Multi-Filter Syncing**: Combine Status, Source, Search queries, and Sorting (`Latest`, `Oldest`) seamlessly.
- **URL Query Param Synchronization**: Active filters are fully synced with browser URL search params (`?status=Qualified&source=Instagram&search=Rahul`) for bookmarking and sharing.
- **Debounced Search**: 300ms debounce on search inputs preventing API flood.
- **Server-Side Filtering**: Clean query builder on the Express backend handling complex `$or` and `$and` regex queries.

### 📑 4. Enterprise Pagination
- **Backend Pagination**: Strict `skip` + `limit` implementation returning comprehensive metadata (`total`, `page`, `pages`, `hasNextPage`, `hasPrevPage`).
- **Polished UI**: Disabled pagination states, smooth UX transitions, and clear total count metrics.

### 📈 5. Modern SaaS UI/UX & Charts
- **Responsive Design**: Flawless experience across Mobile, Tablet, and Desktop displays.
- **Recharts Analytics**: Interactive Bar Charts (Leads by Status) and Pie Charts (Leads by Source) with custom dark-mode tooltips.
- **State Feedback**: Elegant Skeleton Loaders, Empty States, Error Boundaries, and `react-hot-toast` notifications.
- **Framer Motion**: Smooth, premium modal entry and exit animations.
- **Dark Mode**: Fully persisted, toggleable Dark Mode using Tailwind CSS class strategy.

### 📥 6. Instant CSV Export
- **Filtered Exports**: Export exactly what is currently filtered on the screen instantly to a beautifully formatted `.csv` file.

---

## 💻 Tech Stack

### Frontend Architecture
- **React.js 18** (Vite + TypeScript)
- **Tailwind CSS v4** (Utility-first styling with `@theme` configuration)
- **Zustand**: Clean, boilerplate-free global state management (`authStore`, `themeStore`).
- **TanStack Query (React Query v5)**: Server state management, caching, and optimistic updates.
- **React Hook Form + Zod**: Enterprise form validation matching backend schemas.
- **Lucide React**: Beautiful, consistent SaaS icon pack.
- **Recharts & Framer Motion**: Data visualization and micro-animations.

### Backend Architecture
- **Node.js + Express.js** (TypeScript ONLY)
- **MongoDB + Mongoose ODM**: Fully indexed schemas for high-performance querying.
- **Zod**: Runtime validation for `req.body`, `req.query`, and `req.params`.
- **Security Suite**: `helmet`, `cors`, `express-rate-limit`, `morgan` logging.

---

## 📁 Scalable Folder Structure

```
Smart-Leads-Dashboard/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & Database configs
│   │   ├── middleware/      # Auth, Error, Validation, Rate Limiter
│   │   ├── modules/         # Domain Modules (Auth & Leads)
│   │   │   ├── auth/        # Auth Controller, Service, Routes, Validation, Model
│   │   │   └── leads/       # Leads Controller, Service, Routes, Validation, Model
│   │   ├── types/           # Express extensions & TypeScript Interfaces
│   │   ├── utils/           # AppError, catchAsync, apiResponse helpers
│   │   ├── index.ts         # Express App entry point
│   │   └── seed.ts          # Database Seeding script
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI Components (Common & Leads)
│   │   ├── hooks/           # TanStack Query custom hooks (useLeads)
│   │   ├── layouts/         # Main Layout & Sidebar/Header navigation
│   │   ├── pages/           # Dashboard, Leads Table, Login, Register
│   │   ├── services/        # Axios API client with interceptors
│   │   ├── store/           # Zustand Auth & Theme stores
│   │   ├── types/           # Frontend TypeScript definitions
│   │   ├── App.tsx          # Router & Providers
│   │   ├── index.css        # Tailwind directives & theme
│   │   └── main.tsx         # React DOM entry
│   ├── Dockerfile
│   ├── nginx.conf           # Production Nginx SPA configuration
│   ├── package.json
│   └── tsconfig.json
│
└── docker-compose.yml       # Multi-container orchestration
```

---

## 🛠️ Setup Instructions & Environment Variables

### 1. Local Development Setup (Without Docker)

#### Prerequisites:
- Node.js (v20+)
- MongoDB Instance (Local or Atlas)

#### Backend Setup:
```bash
cd backend
npm install

# Create a .env file (or rely on defaults in src/config/env.ts)
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/smart_leads
# JWT_SECRET=your_super_secret_jwt_key
# JWT_EXPIRES_IN=7d
# FRONTEND_URL=http://localhost:3000

# Seed the database with Demo Admin/Sales accounts & Mock Leads
npm run seed

# Start development server
npm run dev
```

#### Frontend Setup:
```bash
cd frontend
npm install

# Create a .env file
# VITE_API_URL=http://localhost:5000/api

# Start Vite dev server
npm run dev
```

---

## 🐳 Docker Orchestration

Deploy the entire stack (Frontend, Backend, MongoDB) instantly using Docker Compose.

```bash
# Build and spin up all containers in detached mode
docker-compose up --build -d

# View real-time logs
docker-compose logs -f

# Shut down containers and persist volumes
docker-compose down
```
- **Frontend SPA**: `http://localhost:3000` (Served via high-performance Nginx)
- **Backend API**: `http://localhost:5000`
- **MongoDB**: `localhost:27017`

---

## 📖 API Documentation

### Base URL: `/api`

| Method | Endpoint | Description | Auth Required | Role |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Register new user | No | Public |
| **POST** | `/auth/login` | Authenticate user & get JWT | No | Public |
| **GET** | `/auth/me` | Get current user profile | Yes | Any |
| **GET** | `/leads/stats` | Get dashboard metrics & charts | Yes | Any |
| **GET** | `/leads` | Get paginated & filtered leads | Yes | Any* |
| **GET** | `/leads/:id` | Get single lead by ID | Yes | Any* |
| **POST** | `/leads` | Create a new lead | Yes | Any |
| **PUT** | `/leads/:id` | Update an existing lead | Yes | Any* |
| **DELETE**| `/leads/:id` | Delete a lead | Yes | Any* |

> *`Sales User` role can only view, update, or delete leads assigned to them or created by them. `Admin` role has universal access.

### Standard Enterprise Response Format:
```json
{
  "success": true,
  "message": "Leads retrieved successfully",
  "data": [...],
  "meta": {
    "total": 42,
    "page": 1,
    "pages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 🏛️ Architecture Explanation & Engineering Standards

### 1. Database Schema Design & Indexing
- **Compound Indexing**: `leadSchema.index({ status: 1, source: 1 })` optimizes high-frequency dashboard filter queries.
- **Text Indexing**: `leadSchema.index({ name: 'text', email: 'text' })` supports lightning-fast search queries.
- **Relations**: Leads maintain references to both `createdBy` and `assignedTo` users, establishing a clean audit trail.

### 2. State Management Flow
- **Server State (TanStack Query)**: Manages asynchronous operations, caching, background refetching, and optimistic updates (`onMutate`). Eliminates global state bloat.
- **Client State (Zustand)**: Manages synchronous, persistent client states (`authStore` for user session, `themeStore` for dark mode).

### 3. Security Best Practices
- **Password Hashing**: `bcrypt` with 12 salt rounds.
- **Rate Limiting**: `express-rate-limit` prevents brute-force login attempts and DDoS.
- **Headers & CORS**: `helmet` secures HTTP headers, while CORS is strictly bound to configured frontend origins.
- **Zod Sanitization**: Validates all incoming payloads before they touch Mongoose models or controllers.

---