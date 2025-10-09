# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Development Server
- **Start development server**: `npm run dev` (runs on port 9002 with turbopack)
- **Build for production**: `npm run build`
- **Start production server**: `npm run start`
- **Type checking**: `npm run typecheck`
- **Linting**: `npm run lint`

### Database Management
- **View database in Prisma Studio**: `npx prisma studio --port 5556`
- **Push schema to database**: `npx prisma db push`
- **Reset database (destructive)**: `npx prisma db push --force-reset`
- **Seed database**: `npm run db:seed` or `npx tsx prisma/seed.ts`

### Single Test/Development Commands
- **Run specific file with tsx**: `npx tsx <file-path>`
- **Check specific file types**: `tsc --noEmit <file-path>`

## Architecture Overview

### Core Architecture Pattern
This is a **hybrid public/private Next.js application** with sophisticated navigation conditional logic:

- **Public Interface**: Landing page, club directory, events, and news are fully accessible without authentication
- **Smart Navigation**: Navigation is completely hidden for unauthenticated users, providing a clean public experience
- **Role-Based Access**: Four distinct user roles (super_admin, sdo_admin, club_lead, student) with granular permissions
- **Conditional Layout Rendering**: The `MainLayout` component dynamically shows/hides navigation based on authentication status and current route

### Key Architectural Components

#### Authentication System (`src/contexts/auth-context.tsx`)
- **Dual Login Support**: Users can login with either email or registration number
- **JWT-based authentication** with localStorage persistence
- **Role-based routing**: Automatic redirection based on user role after login
- **Context-based state management** throughout the application

#### Layout Management (`src/components/layout/main-layout.tsx`)
- **Smart Navigation Logic**: Complex conditional rendering based on:
  - Authentication status
  - Current route (public vs private pages)
  - User role permissions
- **Public Page Detection**: Dynamically identifies public pages including dynamic routes like `/clubs/[slug]`
- **Mobile Optimization**: Conditional mobile navigation that's hidden on public pages

#### Database Architecture (`prisma/schema.prisma`)
- **Core Models**: User, Club, ClubCategory, Membership, Event, Post, ClubInvitation
- **Role-Based Permissions**: UserRole enum (super_admin, sdo_admin, club_lead, student)
- **Relationship Management**: Complex many-to-many relationships between users and clubs
- **MySQL with Prisma ORM**: Type-safe database operations throughout

### File Upload System
- **Direct File Upload**: Users upload files directly (no URL input)
- **Upload Location**: `/public/uploads/clubs/` for club images
- **Template System**: Fallback images in `/public/images/defaults/` for professional appearance
- **Validation**: File type and size validation in upload API

### API Structure
- **Public Endpoints**: `/api/clubs/public`, `/api/events/public`, `/api/posts/public` (no auth required)
- **Protected Endpoints**: Standard CRUD operations with JWT middleware
- **Role-Based API Access**: Admin-only endpoints for user management and content creation
- **Dynamic Routes**: Slug-based routing for clubs, events, and posts

## Development Environment Setup

### Required Environment Variables (.env)
```bash
DATABASE_URL="mysql://username:password@localhost:3306/mycampus_db"
JWT_SECRET="your-super-secret-jwt-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:9002"
OPENAI_API_KEY="your-openai-api-key" # Optional
```

### Database Setup Sequence
1. Create MySQL database: `mysql -u root -p -e "CREATE DATABASE mycampus_db;"`
2. Push schema: `npx prisma db push`
3. Seed data: `npm run db:seed`
4. Create upload directories: `mkdir -p public/uploads/clubs`

### Test Users (All passwords: `takudzwa`)
- **Super Admin**: `superadmin@mycampus.com` → Redirects to `/admin/dashboard`
- **SDO Admin**: `sdo@mycampus.com` → Redirects to `/admin/sdo-dashboard`  
- **Club Lead**: `clublead@mycampus.com` → Redirects to `/my-club-management`
- **Student**: `student@mycampus.com` or `R000004D` → Redirects to `/clubs-directory`

## Key Development Patterns

### Route Protection Pattern
Routes are protected through a combination of:
- **Client-side**: Authentication context checks in components
- **Server-side**: JWT verification in API routes using `src/lib/auth.ts`
- **Middleware**: Authentication verification functions in API handlers

### Role-Based UI Rendering
```tsx
// Example pattern used throughout the app
{user?.role === 'super_admin' || user?.role === 'sdo_admin' ? (
  <AdminOnlyButton />
) : null}
```

### Public vs Private Page Detection
The application uses sophisticated logic in `MainLayout` to detect:
- Static public pages (defined in `publicPages` array)
- Dynamic public pages (like `/clubs/[slug]`)
- Admin creation pages (which should show full navigation even on public routes)

### Image Handling Pattern
- **Default Images**: Template images in `/public/images/defaults/` with specific naming conventions
- **Uploaded Images**: Stored in `/public/uploads/` with organized subdirectories
- **Fallback Logic**: Components gracefully degrade to template images if uploads fail

## Important Development Notes

### Navigation Behavior
The navigation system has complex conditional logic:
- **Unauthenticated users**: No navigation shown on any page for clean public experience
- **Authenticated users on public pages**: Header shown but sidebar hidden
- **Authenticated users on private pages**: Full navigation (sidebar + header + mobile nav)

### Database Relationships
- **Club Leadership**: One-to-one relationship between User and Club via `leadId`
- **Membership**: Many-to-many via explicit Membership model with join timestamps
- **Club Invitations**: Separate model for managing club leadership invitations with expiration

### File Structure Philosophy
- **Public Pages**: Can be accessed by anyone, optimized for discovery
- **Admin Pages**: Only accessible to admin roles, full CRUD operations
- **User-Specific Pages**: Like `/my-club-management` for club leads
- **API Organization**: Mirrors page structure with public/private endpoint separation

### TypeScript Configuration
- **Strict Mode Enabled**: Full TypeScript strict checking
- **Path Aliases**: `@/*` maps to `src/*` for clean imports
- **Build Optimization**: TypeScript and ESLint errors ignored during builds for flexibility

This architecture enables a seamless transition from public content discovery to authenticated club management, with sophisticated role-based access control throughout the application.
