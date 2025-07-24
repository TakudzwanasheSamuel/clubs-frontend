# myCampus - Campus Club Hub: User Manual & Technical Documentation

## 1. Overview

myCampus is a comprehensive web application designed to serve as the central hub for campus clubs and student activities at a university. It provides a structured platform for students to discover, join, and interact with clubs. The application also includes robust management tools for club leads and administrators to oversee content and user activities.

This document serves as both a user manual and technical documentation for the project, covering its features, user roles, and underlying database architecture.

### Tech Stack

*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **UI:** React 18 with ShadCN UI components
*   **Styling:** Tailwind CSS
*   **State Management:** React Hooks (`useState`, `useEffect`)
*   **Forms:** React Hook Form with Zod for validation
*   **Icons:** Lucide React

---

## 2. Database Schema

The following schema is designed to support the application's core features. It uses a relational model to efficiently store and manage data for users, clubs, events, and their relationships.

### Schema Diagram (Conceptual)

```
+------------------+      +-----------------+      +---------------------+
|      users       |      |  club_members   |      |        clubs        |
+------------------+      +-----------------+      +---------------------+
| id (PK)          |----<| user_id (FK)    |      | id (PK)             |
| first_name       |      | club_id (FK)    |>----| slug                |
| last_name        |      | role            |      | name                |
| email (UNIQUE)   |      | joined_at       |      | description         |
| password_hash    |      +-----------------+      | category_id (FK)    |
| role             |                               | logo_url            |
| profile_image_url|                               | banner_image_url    |
| created_at       |                               | meeting_schedule    |
| updated_at       |                               | created_at          |
+------------------+                               | updated_at          |
                                                   +---------------------+
                                                          |      ^
                                                          |      |
                                     +--------------------+      +--------------------+
                                     |                           |
                            +--------v---------+      +----------v---------+      +------------------+
                            |      events      |      |       posts        |      | club_categories  |
                            +------------------+      +--------------------+      +------------------+
                            | id (PK)          |      | id (PK)            |      | id (PK)          |
                            | slug             |      | slug               |      | name (UNIQUE)    |
                            | title            |      | title              |      | icon_name        |
                            | description      |      | content            |      | created_at       |
                            | date             |      | featured_image_url |      | updated_at       |
                            | time             |      | type               |      +------------------+
                            | location         |      | club_id (FK)       |               ^
                            | cover_image_url  |      | author_id (FK)     |               |
                            | club_id (FK)     |>-----| publish_date       |---------------+
                            | status           |      | likes_count        |
                            | created_at       |      | created_at         |
                            | updated_at       |      | updated_at         |
                            +------------------+      +--------------------+
```

### Table Definitions

#### `users`
Stores information about all registered users.

| Column            | Type                               | Description                                     |
| ----------------- | ---------------------------------- | ----------------------------------------------- |
| `id`              | `INT` (PK, Auto-Increment)         | Unique identifier for each user.                |
| `first_name`      | `VARCHAR(255)`                     | User's first name.                              |
| `last_name`       | `VARCHAR(255)`                     | User's last name.                               |
| `email`           | `VARCHAR(255)` (UNIQUE)            | User's email address, used for login.           |
| `password_hash`   | `VARCHAR(255)`                     | Hashed password for secure authentication.      |
| `role`            | `ENUM('admin', 'club_lead', 'student')` | Defines user permissions across the app.    |
| `profile_image_url`| `VARCHAR(255)` (Nullable)         | URL to the user's profile picture.              |
| `created_at`      | `TIMESTAMP`                        | Timestamp of when the user account was created. |
| `updated_at`      | `TIMESTAMP`                        | Timestamp of the last profile update.           |

---

#### `club_categories`
Stores the different categories a club can belong to.

| Column       | Type                       | Description                                |
| ------------ | -------------------------- | ------------------------------------------ |
| `id`         | `INT` (PK, Auto-Increment) | Unique identifier for each category.       |
| `name`       | `VARCHAR(255)` (UNIQUE)    | The name of the category (e.g., "Academic"). |
| `icon_name`  | `VARCHAR(255)` (Nullable)  | Name of the Lucide icon for the category.  |
| `created_at` | `TIMESTAMP`                | Timestamp of when the category was created.|
| `updated_at` | `TIMESTAMP`                | Timestamp of the last category update.     |

---

#### `clubs`
Stores detailed information for each club.

| Column             | Type                       | Description                                     |
| ------------------ | -------------------------- | ----------------------------------------------- |
| `id`               | `INT` (PK, Auto-Increment) | Unique identifier for each club.                |
| `slug`             | `VARCHAR(255)` (UNIQUE)    | URL-friendly identifier for the club.           |
| `name`             | `VARCHAR(255)`             | The official name of the club.                  |
| `description`      | `TEXT`                     | A detailed description of the club.             |
| `category_id`      | `INT` (FK -> `club_categories.id`) | Links to the club's category.            |
| `logo_url`         | `VARCHAR(255)`             | URL to the club's logo image.                   |
| `banner_image_url` | `VARCHAR(255)` (Nullable)  | URL to the club's banner image.                 |
| `meeting_schedule` | `VARCHAR(255)` (Nullable)  | Information on when and where the club meets.   |
| `created_at`       | `TIMESTAMP`                | Timestamp of when the club was created.         |
| `updated_at`       | `TIMESTAMP`                | Timestamp of the last club profile update.      |

---

#### `club_members`
A join table that manages the many-to-many relationship between `users` and `clubs`.

| Column      | Type                       | Description                                     |
| ----------- | -------------------------- | ----------------------------------------------- |
| `user_id`   | `INT` (FK -> `users.id`)   | The ID of the user who is a member.             |
| `club_id`   | `INT` (FK -> `clubs.id`)   | The ID of the club the user has joined.         |
| `role`      | `ENUM('lead', 'member')`   | The user's role within the club.                |
| `joined_at` | `TIMESTAMP`                | Timestamp of when the user joined the club.     |
| **Primary Key** | `(user_id, club_id)`     | Ensures a user can only join a club once.       |

---

#### `events`
Stores information about all events organized by clubs.

| Column            | Type                       | Description                                     |
| ----------------- | -------------------------- | ----------------------------------------------- |
| `id`              | `INT` (PK, Auto-Increment) | Unique identifier for each event.               |
| `slug`            | `VARCHAR(255)` (UNIQUE)    | URL-friendly identifier for the event.          |
| `title`           | `VARCHAR(255)`             | The title of the event.                         |
| `description`     | `TEXT`                     | A detailed description of the event.            |
| `date`            | `DATE`                     | The date the event will take place.             |
| `time`            | `TIME`                     | The time the event will start.                  |
| `location`        | `VARCHAR(255)`             | The location of the event.                      |
| `cover_image_url` | `VARCHAR(255)` (Nullable)  | URL to the event's cover image.                 |
| `club_id`         | `INT` (FK -> `clubs.id`)   | The club that is hosting the event.             |
| `status`          | `ENUM('upcoming', 'past', 'cancelled')` | The current status of the event.   |
| `created_at`      | `TIMESTAMP`                | Timestamp of when the event was created.        |
| `updated_at`      | `TIMESTAMP`                | Timestamp of the last event update.             |

---

#### `posts`
Stores all news and announcements published by clubs.

| Column               | Type                       | Description                                     |
| -------------------- | -------------------------- | ----------------------------------------------- |
| `id`                 | `INT` (PK, Auto-Increment) | Unique identifier for each post.                |
| `slug`               | `VARCHAR(255)` (UNIQUE)    | URL-friendly identifier for the post.           |
| `title`              | `VARCHAR(255)`             | The title of the post.                          |
| `content`            | `TEXT`                     | The main body content of the post.              |
| `featured_image_url` | `VARCHAR(255)` (Nullable)  | URL to the post's featured image.               |
| `type`               | `ENUM('announcement', 'news', 'achievement', 'event_recap')` | The type of post. |
| `club_id`            | `INT` (FK -> `clubs.id`)   | The club that published the post.               |
| `author_id`          | `INT` (FK -> `users.id`)   | The user who wrote the post.                    |
| `publish_date`       | `TIMESTAMP`                | The date and time the post was published.       |
| `likes_count`        | `INT` (Default: 0)         | A counter for the number of likes.              |
| `created_at`         | `TIMESTAMP`                | Timestamp of when the post was created.         |
| `updated_at`         | `TIMESTAMP`                | Timestamp of the last post update.              |


---

## 3. User Roles & Permissions

The application uses a role-based access control system to provide a tailored experience.

### 3.1. Anonymous Visitor (Not Logged In)
*   **Access:** Can only view the public landing page (`/`), login page (`/login`), and registration page (`/register`).
*   **Actions:** Can browse featured content on the landing page and sign up or log in.
*   **Restrictions:** Cannot access the main application dashboard, directories, or any interactive features.

### 3.2. Student (Default Authenticated Role)
*   **Access:** Can access the full application, including the Club Directory, Event Calendar, and Newsfeed.
*   **Actions:**
    *   Browse, search, and filter all clubs, events, and news.
    *   View detailed pages for any item.
    *   Join or leave clubs (simulated).
    *   RSVP to events (simulated).
    *   View their joined clubs on the "My Memberships" page.
*   **Restrictions:** Cannot create or edit clubs, events, or posts (unless they are a Club Lead).

### 3.3. Club Lead
*   **Access:** Has all student permissions, plus a "My Club Management" dashboard.
*   **Actions:**
    *   View their club's management dashboard with quick stats and actions.
    *   Edit the details of the club they manage.
    *   Create new events on behalf of their club.
    *   Create new posts (news, announcements) for their club.
*   **Restrictions:** Can only manage content and details for their own assigned club. Cannot access the Admin Dashboard.

### 3.4. Admin
*   **Access:** Has full access to all parts of the application, including an "Admin Dashboard".
*   **Actions:**
    *   **Club Management:** Create new clubs. Edit or delete any existing club.
    *   **Event Management:** Delete any event.
    *   **User Management (Conceptual):** Can assign users as Club Leads. Has the ability to manage all user accounts.
    *   **Content Moderation:** Can edit or delete any post or event.
    *   **System Configuration:** Can access a settings area to manage the platform.
*   **Restrictions:** None. This role has superuser privileges.

---

## 4. Application Features & User Guide

### 4.1. Public Landing Page (`/`)
The entry point for all visitors. It showcases the best of campus life to encourage sign-ups.
*   **Hero Section:** A welcoming banner with calls to action.
*   **Featured Clubs:** A curated list of interesting clubs.
*   **Upcoming Events:** A preview of soon-to-happen events.
*   **Trending Posts:** Highlights from the newsfeed.
*   **Testimonials:** Quotes from students and club leads.

### 4.2. Authentication (`/login`, `/register`)
*   **Login:** Users can sign in using mock credentials provided on the page to test different roles. The system implements role-based redirection upon successful login.
*   **Registration:** A standard form for new users to create an account (simulated).

### 4.3. Club Directory (`/clubs-directory`)
The central place to discover all clubs on campus.
*   **Search & Filter:** Users can search for clubs by name or description and filter by category.
*   **Club Cards:** Each club is represented by a card showing its logo, name, member count, and a brief description.

### 4.4. Club Detail Page (`/clubs/[slug]`)
A dedicated page for each club.
*   **Information:** Displays the club's banner, logo, full description, meeting schedule, and social media links.
*   **Actions:** Students can join or leave the club. Club Leads can find a link to edit the page.
*   **Related Content:** Shows recent events and posts published by that specific club.

### 4.5. Club Creation & Management
*   **Create Club (`/clubs/create`):** An **admin-only** form to create a new club profile. It allows for uploading a logo and banner directly from the user's device.
*   **Edit Club (`/clubs/[slug]/edit`):** A form for Club Leads or Admins to update a club's details.

### 4.6. Event Calendar (`/events`)
A chronological listing of all campus events.
*   **Layout:** Separated into "Upcoming" and "Past" events.
*   **Event Cards:** Each card shows the event's title, date, location, and hosting club.
*   **Admin Actions:** Admins can see a "Delete" button on event detail pages to remove events, with a confirmation dialog to prevent accidents.

### 4.7. Admin Dashboard (`/admin/dashboard`)
The control center for administrators.
*   **Overview:** Shows at-a-glance statistics for total clubs, users, and pending approvals.
*   **Quick Actions:** Provides direct links to key admin functions like "Create New Club" and placeholders for "Manage Users" and "View Reports."

---

## 5. Getting Started (Development)

### Prerequisites
*   Node.js (v18.x or later)
*   npm or yarn

### Installation
1.  Clone the repository.
2.  Install dependencies: `npm install` or `yarn install`.
3.  Create a `.env` file in the root of the project.
4.  Run the development server: `npm run dev`. The app will be available at `http://localhost:9002`.
