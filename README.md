
# myCampus - Campus Club Hub

## Overview

myCampus is a web application designed to be the central hub for campus clubs and student activities. It features a public-facing landing page for discovery and dedicated sections for registered users to discover, join, and interact with various clubs, stay updated on events, and read news and announcements. The platform also provides administrative tools for managing clubs and content, and a dedicated management area for club leads.

This project is built with a modern Next.js frontend.

## Tech Stack

*   **Framework:** Next.js 15 (App Router, Server Components)
*   **Language:** TypeScript
*   **UI Library:** React 18
*   **Styling:** Tailwind CSS
*   **Component Library:** ShadCN UI
*   **Icons:** Lucide React
*   **State Management:** React Hooks (useState, useEffect), React Context (for UI state like Sidebar)
*   **Forms:** React Hook Form with Zod for validation
*   **Linting/Formatting:** ESLint, Prettier (implied by Next.js setup)

## Key Features

*   **Public Landing Page (`/`):**
    *   A modern, responsive landing page serving as the primary entry point.
    *   Sections for Hero, Featured Clubs, Upcoming Events, Trending Posts, and Testimonials.
    *   Directs users to Login/Register or to explore club/event directories.
*   **User Authentication:**
    *   **Login Page (`/login`):** Allows users to sign in (simulated, any email/password works). Redirects to `/clubs-directory` on success.
    *   **Registration Page (`/register`):** Allows new users to create accounts (simulated).
    *   Logout functionality (from main app header/sidebar) redirects to the login page.
*   **Club Directory (`/clubs-directory`):**
    *   Browse a list of campus clubs (accessible after login or via landing page).
    *   Filter clubs by category and search term (client-side mock).
    *   View detailed club pages (`/clubs/[slug]`) with descriptions, member counts, meeting schedules, and social links.
    *   Simulated "Join/Leave Club" functionality on club detail pages.
*   **Event Calendar (`/events`):**
    *   View upcoming and past events.
    *   Filter events by type and search term (placeholder filters).
    *   View detailed event pages (`/events/[slug]`) with descriptions, date/time, location, and host club.
    *   Simulated RSVP functionality on event detail pages.
*   **Newsfeed (`/news`):**
    *   Read the latest news, announcements, achievements, and event recaps from clubs.
    *   Filter posts by type and search term (placeholder filters).
    *   View detailed post pages (`/news/[slug]`) with full content, author details, and club information.
    *   Placeholder for comments and like functionality.
*   **Content Creation (Simulated):**
    *   **Create Club Page (`/clubs/create`):** Form for proposing a new club.
    *   **Create Event Page (`/events/create`):** Form for club leads to create new events.
    *   **Create Post Page (`/news/create`):** Form for club leads to write and submit posts.
*   **My Memberships (`/my-memberships`):**
    *   A dedicated page for users to see the clubs they have joined (currently uses mock data).
*   **Club Lead Features:**
    *   **My Club Management Page (`/my-club-management`):** A dashboard for club leads to manage their club(s), view stats, and access quick links to create content or edit club details. (Simulated, assumes user manages a predefined club).
    *   **Edit Club Page (`/clubs/[slug]/edit`):** Form for club leads to edit details of their club.
*   **Admin Features:**
    *   **Admin Dashboard (`/admin/dashboard`):** An overview page for administrators with stats and quick actions (currently uses mock data). Links to "Manage Clubs", "Manage Users", etc., are placeholders for future development.
*   **Layout:**
    *   Main application layout (sidebar, header, mobile bottom navigation) is hidden on landing (`/`), login (`/login`), and register (`/register`) pages.
    *   Responsive sidebar (collapsible on desktop, sheet on mobile trigger).
    *   Mobile bottom navigation for key sections.


## Project Structure

```
my-campus/
├── .env                    # Environment variables
├── components.json         # ShadCN UI configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration (for Tailwind)
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── public/                 # Static assets (e.g., images, favicons - if any)
├── src/
│   ├── app/                # Next.js App Router: pages, layouts, loading/error states
│   │   ├── (main)/         # Main application routes (implicitly, these are top-level under app/)
│   │   │   ├── clubs/
│   │   │   │   ├── [slug]/
│   │   │   │   │   ├── page.tsx      # Club Detail Page
│   │   │   │   │   └── edit/page.tsx # Edit Club Page
│   │   │   │   └── create/page.tsx   # New Club Creation Page
│   │   │   ├── clubs-directory/page.tsx # Club Directory Page
│   │   │   ├── events/
│   │   │   │   ├── [slug]/page.tsx
│   │   │   │   └── create/page.tsx   # New Event Creation Page
│   │   │   ├── news/
│   │   │   │   ├── [slug]/page.tsx
│   │   │   │   └── create/page.tsx   # New Post Creation Page
│   │   │   ├── my-memberships/page.tsx
│   │   │   └── my-club-management/page.tsx # My Club Management Page
│   │   ├── admin/          # Admin-specific routes
│   │   │   └── dashboard/page.tsx # Admin Dashboard Page
│   │   ├── login/page.tsx  # Login Page
│   │   ├── register/page.tsx # Registration Page
│   │   ├── globals.css     # Global styles and Tailwind CSS theme variables
│   │   ├── layout.tsx      # Root layout for the application
│   │   ├── page.tsx        # Public Landing Page (this is the root page)
│   │   ├── error.tsx       # Global error boundary
│   │   └── loading.tsx     # Global loading UI
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # ShadCN UI components (Button, Card, etc.)
│   │   ├── layout/         # Layout components (Header, Sidebar, MainLayout, LogoutButton, MobileBottomNavigation)
│   │   ├── clubs/          # Components specific to club features (ClubCard, ClubFilters)
│   │   ├── events/         # Components specific to event features (EventCard)
│   │   ├── news/           # Components specific to news features (PostCard)
│   │   └── admin/          # Components specific to admin features
│   ├── hooks/              # Custom React hooks (e.g., useToast, useIsMobile)
│   ├── lib/                # Utility functions and libraries
│   │   ├── mock-data.ts    # Mock data used throughout the application
│   │   └── utils.ts        # General utility functions (e.g., cn for Tailwind)
│   └── types/              # TypeScript type definitions
│       └── index.ts        # Core application types (Club, Event, Post, User, etc.)
└── README.md               # This file
```

## Getting Started

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd my-campus
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables

1.  Create a `.env` file in the root of the project by copying `.env.example` (if provided, otherwise create a new one).
2.  Add any necessary environment variables for your setup (if any beyond standard Next.js).


### Running the Development Server

```bash
npm run dev
# or
yarn dev
```
This will start the Next.js development server, typically on `http://localhost:9002`. The app will open to the public landing page (`/`).


### Building for Production

```bash
npm run build
# or
yarn build
```

### Starting the Production Server

After building, you can start the production server:

```bash
npm run start
# or
yarn start
```

## Future Enhancements (Conceptual with Backend)

With a backend (e.g., PHP as previously outlined, or any other), the following features can be fully implemented:

*   **User Authentication & Profiles:** Secure login, registration, profile management, password reset.
*   **Club & Event Management:** Club leads can create and manage their clubs, events, and posts through their dedicated management page and forms. Admins can oversee all clubs.
*   **Membership System:** Users can join/leave clubs, and club leads can manage members.
*   **Notifications:** Real-time or periodic notifications for new events, posts, or membership updates.
*   **Advanced Search & Filtering:** More powerful server-side search capabilities.
*   **Interactive Comments & Likes:** Real-time updates for post interactions.
*   **Role-Based Access Control:** Properly restrict access to pages and features based on user roles.
*   **Dynamic Landing Page Content:** Testimonials, featured clubs, events, and posts fetched from the database.
*   **Full Admin Management:** Functional "Manage Clubs", "Manage Users", and reporting sections for administrators.
