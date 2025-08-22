
# myCampus - Campus Club Hub

## Overview

myCampus is a comprehensive web application designed to be the central hub for campus clubs and student activities. It features a fully public-facing interface for discovery and dedicated sections for authenticated users to manage, join, and interact with various clubs, stay updated on events, and read news and announcements. The platform includes role-based access control, authentication systems, image upload functionality, and comprehensive administrative tools.

This project is built with a modern Next.js frontend and a complete MySQL backend with Prisma ORM.

## Tech Stack

### Frontend
*   **Framework:** Next.js 15 (App Router, Server Components)
*   **Language:** TypeScript
*   **UI Library:** React 18
*   **Styling:** Tailwind CSS
*   **Component Library:** ShadCN UI
*   **Icons:** Lucide React
*   **State Management:** React Context (AuthContext), React Hooks (useState, useEffect)
*   **Forms:** React Hook Form with Zod for validation
*   **Image Handling:** Next.js Image component with file upload support

### Backend
*   **Database:** MySQL
*   **ORM:** Prisma
*   **Authentication:** JWT (JSON Web Tokens)
*   **Password Hashing:** bcryptjs
*   **API Routes:** Next.js API Routes
*   **File Storage:** Local file system (public/uploads/)

## Key Features

### Public Interface (No Authentication Required)
*   **Public Landing Page (`/`):**
    *   Modern, responsive landing page with custom banner and logo
    *   Real-time data from database showing featured clubs, upcoming events, and trending posts
    *   Uses custom template images as fallbacks for optimal visual experience
    *   Clean navigation header with login/register options
    
*   **Public Club Directory (`/clubs-directory`):**
    *   Browse all campus clubs without authentication
    *   Real-time filtering by category and search functionality
    *   View detailed club pages (`/clubs/[slug]`) with complete information
    *   Custom public header with navigation to other public pages
    
*   **Public Event Calendar (`/events`):**
    *   View all upcoming and past events publicly
    *   Filter events by type and search functionality
    *   Detailed event pages (`/events/[slug]`) with full event information
    
*   **Public Newsfeed (`/news`):**
    *   Read all latest news, announcements, and stories publicly
    *   Filter posts by type and search functionality
    *   Detailed post pages (`/news/[slug]`) with complete content

### Authentication System
*   **Dual Login System (`/login`):**
    *   Support for both email and registration number login
    *   Role-based authentication with JWT tokens
    *   Password reveal/hide toggle for better UX
    *   Automatic redirection based on user role
    
*   **Registration Page (`/register`):**
    *   User registration with email validation
    *   Automatic role assignment and profile setup
    
*   **Role-Based Access Control:**
    *   **super_admin:** Full system access, user management, content moderation
    *   **sdo_admin:** Club management, event approval, content oversight
    *   **club_lead:** Manage assigned clubs, create events and posts
    *   **student:** Join clubs, RSVP events, view content

### Authenticated User Features
*   **Content Management (Admin Only):**
    *   **Create Club:** Only super_admin and sdo_admin can create clubs
    *   **Create Event:** Admin-only event creation with full details
    *   **Create Post:** Admin-only news and announcement posting
    *   **User Management:** Complete CRUD operations for user accounts
    
*   **Club Management:**
    *   **My Club Management (`/my-club-management`):** Dashboard for club leads
    *   **Club Assignment:** Admins can assign students as club leaders
    *   **Edit Club (`/clubs/[slug]/edit`):** Direct image upload with preview and drag-and-drop
    *   **Membership Management:** Join/leave functionality with real-time updates
    
*   **Image Upload System:**
    *   Direct file upload from computer (no URL input required)
    *   Drag-and-drop interface with preview functionality
    *   File validation (type, size) and secure storage
    *   Custom template images as defaults and fallbacks
    
*   **Admin Dashboard (`/admin/dashboard`):**
    *   Real-time statistics and data visualization
    *   User management with CRUD operations
    *   Club oversight and management tools
    *   Content moderation capabilities

### Navigation & UX
*   **Smart Navigation:**
    *   Sidebar and navigation completely hidden for unauthenticated users
    *   Public pages have custom headers with relevant navigation
    *   Mobile bottom navigation hidden on public pages
    *   Role-based menu items and access control
    
*   **Responsive Design:**
    *   Fully responsive across all devices
    *   Mobile-optimized interface with touch-friendly controls
    *   Adaptive layouts for different screen sizes


## Project Structure

```
clubs-frontend/
├── .env                    # Environment variables (DATABASE_URL, JWT_SECRET, etc.)
├── .gitignore              # Git ignore rules (includes uploaded files management)
├── components.json         # ShadCN UI configuration
├── next.config.ts          # Next.js configuration with image domains
├── package.json            # Project dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration (for Tailwind)
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── branding_guide.md       # Image dimensions and branding guidelines
├── users.md                # Test user credentials and registration numbers
├── dev.log                 # Development changelog and feature updates
├── public/                 # Static assets
│   ├── images/
│   │   └── defaults/       # Template images for fallbacks
│   │       ├── default-club-logo.png
│   │       ├── default-club-banner.png
│   │       ├── default-event-cover.png
│   │       ├── default-news-image.png
│   │       ├── default-user-avatar.png
│   │       └── default-post-avatar.png
│   ├── uploads/
│   │   └── clubs/          # User-uploaded club images
│   ├── banner.png          # Landing page banner
│   ├── logo.png            # Application logo
│   └── favicon.ico
├── prisma/                 # Database schema and configuration
│   ├── schema.prisma       # Database schema definition
│   └── seed.ts             # Database seeding script
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   ├── clubs/      # Club management APIs
│   │   │   │   ├── [slug]/ # Dynamic club operations
│   │   │   │   ├── public/ # Public club data endpoint
│   │   │   │   └── assign-leader/
│   │   │   ├── events/     # Event management APIs
│   │   │   │   ├── [slug]/ # Dynamic event operations
│   │   │   │   └── public/ # Public event data endpoint
│   │   │   ├── posts/      # Post management APIs
│   │   │   │   ├── [slug]/ # Dynamic post operations
│   │   │   │   └── public/ # Public post data endpoint
│   │   │   ├── users/      # User management APIs
│   │   │   │   ├── [id]/   # User by ID operations
│   │   │   │   └── search/ # User search functionality
│   │   │   ├── upload/     # File upload endpoint
│   │   │   └── my-*/       # User-specific data endpoints
│   │   ├── admin/          # Admin-only pages
│   │   │   ├── dashboard/  # Admin dashboard with real data
│   │   │   ├── users/      # User management interface
│   │   │   ├── manage-clubs/ # Club assignment interface
│   │   │   └── sdo-dashboard/ # SDO admin dashboard
│   │   ├── clubs/
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx      # Public club detail page
│   │   │   │   └── edit/page.tsx # Club editing with image upload
│   │   │   ├── create/page.tsx   # Admin-only club creation
│   │   │   └── invite/accept/    # Club leadership acceptance
│   │   ├── clubs-directory/page.tsx # Public club directory
│   │   ├── events/
│   │   │   ├── [slug]/page.tsx   # Public event detail page
│   │   │   └── create/page.tsx   # Admin-only event creation
│   │   ├── news/
│   │   │   ├── [slug]/page.tsx   # Public news detail page
│   │   │   └── create/page.tsx   # Admin-only post creation
│   │   ├── my-memberships/page.tsx    # User's club memberships
│   │   ├── my-club-management/page.tsx # Club lead dashboard
│   │   ├── login/page.tsx        # Dual login (email/reg number)
│   │   ├── register/page.tsx     # User registration
│   │   ├── globals.css           # Global styles and Tailwind CSS
│   │   ├── layout.tsx            # Root layout with auth context
│   │   ├── page.tsx              # Public landing page with real data
│   │   ├── error.tsx             # Global error boundary
│   │   └── loading.tsx           # Global loading UI
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # ShadCN UI components + custom components
│   │   │   ├── image-upload.tsx  # File upload component
│   │   │   └── user-avatar.tsx   # Smart user avatar component
│   │   ├── layout/         # Layout components
│   │   │   ├── header.tsx        # App header
│   │   │   ├── sidebar-nav.tsx   # Sidebar navigation
│   │   │   ├── main-layout.tsx   # Smart layout with auth detection
│   │   │   ├── logout-button.tsx # Logout functionality
│   │   │   └── mobile-bottom-nav.tsx # Mobile navigation
│   │   ├── clubs/          # Club-specific components
│   │   │   ├── club-card.tsx     # Club display with fallback images
│   │   │   ├── club-filters.tsx  # Search and filter controls
│   │   │   └── student-assignment.tsx # Leader assignment interface
│   │   ├── events/         # Event-specific components
│   │   │   └── event-card.tsx    # Event display with fallback images
│   │   ├── news/           # News-specific components
│   │   │   └── post-card.tsx     # Post display with fallback images
│   │   └── logo.tsx        # Application logo component
│   ├── contexts/           # React contexts
│   │   └── auth-context.tsx      # Authentication state management
│   ├── hooks/              # Custom React hooks
│   │   ├── use-toast.ts          # Toast notifications
│   │   └── use-mobile.tsx        # Mobile detection
│   ├── lib/                # Utility functions and configurations
│   │   ├── auth.ts         # JWT authentication utilities
│   │   ├── prisma.ts       # Prisma client configuration
│   │   ├── constants.ts    # Image paths and dimensions
│   │   └── utils.ts        # General utility functions
│   └── types/              # TypeScript type definitions
│       └── index.ts        # Core application types
└── README.md               # This file
```

## Getting Started

### Prerequisites

*   **Node.js** (v18.x or later recommended)
*   **npm** or **yarn**
*   **MySQL** (v8.0 or later)
*   **Git**

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd clubs-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory:
    ```bash
    # Database
    DATABASE_URL="mysql://username:password@localhost:3306/mycampus_db"
    
    # Authentication
    JWT_SECRET="your-super-secret-jwt-key-here"
    
    # Optional: OpenAI API (if using AI features)
    OPENAI_API_KEY="your-openai-api-key"
    
    # Application URL
    NEXT_PUBLIC_APP_URL="http://localhost:9002"
    ```

4.  **Set up the database:**
    ```bash
    # Create the database in MySQL
    mysql -u root -p -e "CREATE DATABASE mycampus_db;"
    
    # Push the schema to the database
    npx prisma db push
    
    # Seed the database with initial data
    npx tsx prisma/seed.ts
    ```

5.  **Set up upload directories:**
    ```bash
    mkdir -p public/uploads/clubs
    ```

### Running the Development Server

```bash
npm run dev
```
This will start the Next.js development server on `http://localhost:9002`.

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio --port 5556

# Reset database (caution: deletes all data)
npx prisma db push --force-reset

# Re-seed database
npx tsx prisma/seed.ts
```

### Building for Production

```bash
npm run build
npm run start
```

## User Credentials for Testing

The system comes pre-seeded with test users for each role. **All users have the password: `takudzwa`**

### Admin Users
- **🔴 Super Admin (Full Access)**
  - Email: `superadmin@mycampus.com`
  - Role: `super_admin`
  - Access: Complete system access, user management, content moderation

- **🔵 SDO Admin (Student Development Office)**
  - Email: `sdo@mycampus.com`
  - Role: `sdo_admin`
  - Access: Club management, event approval, content oversight

### Regular Users
- **🟡 Club Lead (Club Manager)**
  - Email: `clublead@mycampus.com`
  - Role: `club_lead`
  - Access: Manage assigned clubs, create events and posts
  - Manages: MSU Coding Club, Debate Society, Varsity Soccer Club

- **🟢 Student (Basic Access)**
  - Email: `student@mycampus.com` or use registration number `R000003C`
  - Role: `student`
  - Access: Join clubs, RSVP to events, view content

### Additional Test Users
The database is seeded with 100+ additional student users with registration numbers in the format `Rxxxxxxx` (e.g., `R941974A`). See `users.md` for the complete list.

## Usage Guide

### For First-Time Users (Public Access)
1. **Visit the Landing Page** - Browse featured clubs, events, and news without login
2. **Explore Public Pages**:
   - `/clubs-directory` - Browse all clubs with filtering and search
   - `/events` - View upcoming and past events
   - `/news` - Read latest announcements and stories
3. **Register or Login** when ready to join the community

### For Students
1. **Login Options**:
   - Use email: `student@mycampus.com`
   - Use registration number: `R000003C`
   - Password: `takudzwa`
2. **After Login**:
   - Automatically redirected to `/clubs-directory`
   - Access sidebar navigation for full app features
   - Join clubs, RSVP to events, view personal dashboard

### For Admins (Club Creation & Management)
1. **Login as Admin**:
   - Super Admin: `superadmin@mycampus.com`
   - SDO Admin: `sdo@mycampus.com`
   - Password: `takudzwa`
2. **Admin Capabilities**:
   - Create clubs, events, and posts (buttons visible only to admins)
   - Access `/admin/dashboard` for system overview
   - Manage users via `/admin/users`
   - Assign club leaders via `/admin/manage-clubs`

### For Club Leaders
1. **Login**: `clublead@mycampus.com` / `takudzwa`
2. **Club Management**:
   - Access `/my-club-management` for club dashboard
   - Edit club details with direct image upload
   - Manage club activities and membership

## API Documentation

### Public Endpoints (No Authentication Required)
- `GET /api/clubs/public` - Fetch all clubs for public viewing
- `GET /api/events/public` - Fetch all public events
- `GET /api/posts/public` - Fetch all public posts

### Authentication Endpoints
- `POST /api/auth/login` - User login (email or registration number)
- `POST /api/auth/register` - User registration

### Protected Endpoints (Authentication Required)
- `GET /api/clubs` - Get clubs for authenticated users
- `POST /api/clubs` - Create new club (admin only)
- `PUT /api/clubs/[slug]` - Update club details
- `POST /api/clubs/assign-leader` - Assign club leader (admin only)
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create new user (admin only)
- `GET /api/users/search` - Search users by name/registration number
- `POST /api/upload` - Upload images (authenticated users only)

## Database Schema

### Core Models
- **User**: Authentication, roles, profile information
- **ClubCategory**: Club categorization system
- **Club**: Club information, leadership, and metadata
- **Membership**: User-club relationships
- **Event**: Club events with scheduling and details
- **Post**: News, announcements, and club content
- **ClubInvitation**: Club leadership invitation system

## Development Features

### Image Management
- **Direct File Upload**: Users can upload images directly from their computer
- **Template System**: Custom fallback images for professional appearance
- **File Validation**: Type and size validation with secure storage
- **Drag & Drop**: Modern file upload interface

### Authentication & Security
- **JWT Tokens**: Secure authentication with role-based access
- **Dual Login**: Support for both email and registration number login
- **Password Security**: bcrypt hashing for password protection
- **Role-Based Routing**: Automatic redirection based on user roles

### Public Interface Design
- **Clean Public Pages**: No navigation clutter for unauthenticated users
- **Smart Layout**: Conditional navigation based on authentication status
- **Mobile Optimization**: Hidden mobile navigation on public pages
- **Custom Headers**: Public-specific navigation for better UX

## Future Enhancements

### Planned Features
- **Real-time Notifications**: Push notifications for events and announcements
- **Advanced Search**: Full-text search across all content types
- **Event Calendar Integration**: iCal export and calendar sync
- **Club Analytics**: Detailed insights for club leads and admins
- **Social Features**: Comments, likes, and social interactions
- **Email Integration**: Automated email notifications and invitations
- **Mobile App**: React Native mobile application
- **Multi-language Support**: Internationalization for diverse campuses

---

## 📋 Project Status

### ✅ Completed Features
- **Full Authentication System** with JWT and role-based access control
- **Complete Database Integration** with MySQL and Prisma ORM
- **Public Interface Design** with clean, navigation-free browsing
- **Image Upload System** with direct file upload and template fallbacks
- **Admin Management Tools** with user management and club assignment
- **Role-Based Permissions** with proper access control throughout the app
- **Responsive Design** optimized for all devices and screen sizes
- **Smart Navigation** that adapts based on authentication and page context

### 🚀 Ready for Production
This application is fully functional and ready for deployment with:
- Complete user authentication and authorization
- Real database integration with proper schema
- File upload and image management
- Admin tools for content and user management
- Public-facing interface for community engagement
- Mobile-responsive design with optimized UX

### 🔧 Technical Highlights
- **Next.js 15** with App Router and Server Components
- **TypeScript** for type safety and better development experience
- **Prisma ORM** for type-safe database operations
- **Custom Image Management** with upload validation and template system
- **JWT Authentication** with secure token management
- **Role-Based Access Control** with granular permissions
- **Public API Endpoints** for unauthenticated content access
- **Smart Layout System** with conditional navigation rendering

---

## 📞 Support & Documentation

For additional information, refer to:
- `branding_guide.md` - Complete image specifications and design guidelines
- `users.md` - All test user credentials and registration numbers
- `dev.log` - Detailed development history and feature changelog

**Created with ❤️ for campus communities**