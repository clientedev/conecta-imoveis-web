# M&M Conecta Imóveis - Real Estate Management Platform

## Overview
This is a full-stack real estate management platform built with React, TypeScript, Vite, and Hono. It features a complete lead distribution system, property management, appointment scheduling, and user role management.

## Project Structure
- **Frontend**: React + Vite + TypeScript + shadcn/ui + Tailwind CSS (runs on port 5000)
- **Backend**: Hono API server with TypeScript (runs on port 3001)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Role-based access (Admin, Broker/Corretor, Client)

## Key Features
- Property listing and management
- Lead capture and automatic distribution to brokers
- Appointment scheduling system
- User role management (Admin, Broker, Client)
- Real-time broker queue system for lead assignment
- Multi-image property uploads
- WhatsApp integration

## Development

### Running the Application
The app runs with the "Full Stack" workflow which starts both frontend and backend:
```bash
npm run dev
```

This command runs:
- Vite dev server on port 5000 (frontend)
- Hono API server on port 3001 (backend)

### Database Management
Database schema is managed with Drizzle ORM. The schema is defined in `shared/schema.ts`.

To push schema changes to the database:
```bash
npm run db:push
```

If you encounter warnings, use:
```bash
npm run db:push --force
```

**Important**: Never manually write SQL migrations. Always use `npm run db:push` or `npm run db:push --force`.

### Database Schema
The database includes tables for:
- `profiles` - User profiles with roles (admin, corretor, client)
- `properties` - Property listings
- `property_images` - Multiple images per property
- `leads` - Lead information and status
- `appointments` - Scheduled property visits
- `broker_order` - Broker queue for lead distribution
- `lead_distribution_log` - Lead assignment history
- `admin_emails` - Admin email whitelist

### API Endpoints
All API endpoints are prefixed with `/api`:
- `/api/properties` - Property CRUD operations
- `/api/leads` - Lead management and assignment
- `/api/appointments` - Appointment scheduling
- `/api/profiles` - User profile management
- `/api/brokers` - Broker-specific operations
- `/api/broker-order` - Lead distribution queue management
- `/api/admin/*` - Admin operations

## Architecture

### Frontend Structure
- `src/pages/` - Page components (Index, Properties, PropertyDetail, etc.)
- `src/components/` - Reusable UI components
- `src/components/ui/` - shadcn/ui components
- `src/contexts/` - React contexts (AuthContext)
- `src/lib/` - Utilities and API client
- `src/hooks/` - Custom React hooks

### Backend Structure
- `server/index.ts` - Server entry point
- `server/routes.ts` - API route definitions
- `server/storage.ts` - Database operations layer
- `server/db.ts` - Database connection setup
- `shared/schema.ts` - Drizzle ORM schema

### Configuration Files
- `vite.config.ts` - Vite configuration (includes HMR for Replit)
- `drizzle.config.ts` - Drizzle ORM configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

## Environment Variables
The following environment variables are automatically configured:
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Database credentials
- `PORT` - Backend server port (defaults to 3001)
- `NODE_ENV` - Environment (development/production)

## Deployment

### Railway Deployment
This app is prepared for deployment on Railway:
- Build command: `npm run build`
- Start command: `npm start`
- The server serves both API and static files in production
- Make sure to set the `DATABASE_URL` environment variable on Railway
- Port is automatically assigned by Railway via the `PORT` environment variable

### Replit Deployment (Alternative)
The app is also configured for Replit Autoscale deployment:
- Build command: `npm run build`
- Start command: `npm start`

## User Roles
1. **Admin**: Full system access, user management, lead oversight
2. **Corretor (Broker)**: Access to assigned leads, property viewing, appointment management
3. **Client**: Property browsing, appointment scheduling

## Lead Distribution System
The platform features an automatic lead distribution system:
- Leads are automatically assigned to brokers in a round-robin fashion
- Brokers are ordered in a queue (configurable by admins)
- System tracks assignment history and broker workload
- New leads are marked as "pending" then auto-assigned to the next broker

## Recent Changes
- Removed all Supabase dependencies and code
- Using PostgreSQL directly with Drizzle ORM
- Updated Zod to v4 for compatibility
- Configured Vite HMR for Replit proxy support
- Set up TypeScript path aliases (@shared, @server, @/)
- Prepared for Railway deployment
- Image upload simplified to use base64 encoding (no external storage)

## Technologies Used
- React 18
- TypeScript
- Vite
- Hono (backend framework)
- Drizzle ORM
- PostgreSQL
- Tailwind CSS
- shadcn/ui
- React Router
- React Query
- Zod validation
