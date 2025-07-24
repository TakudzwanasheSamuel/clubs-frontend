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

## 2. Getting Started (Development)

Follow these instructions to get the project running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18.x or later)
*   npm or yarn
*   A database system (e.g., MySQL, PostgreSQL, or a NoSQL option like MongoDB). The provided script is for MySQL.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd my-campus
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the project root by copying `.env`. You will need to add your database connection string here.
    ```
    # Example for MySQL with Prisma
    DATABASE_URL="mysql://user:password@host:port/database"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

---

## 3. Backend API Overview

This project uses **Next.js API Routes** to create a backend directly within the Next.js application. The API endpoints are located in the `src/app/api/` directory.

Currently, these endpoints simulate a real database by fetching and manipulating data from the `src/lib/mock-data.ts` file. To transition to a full-stack application, these files should be modified to interact with a real database.

See the `src/API.md` file for detailed documentation on each endpoint.

---

## 4. Database Setup

The following section provides instructions for setting up the database. A ready-to-use SQL script is provided for MySQL.

### 4.1. MySQL Database Setup

This is the recommended setup for this project.

**Using MySQL Workbench or a similar GUI tool:**

1.  Open MySQL Workbench and connect to your MySQL server.
2.  Create a new schema (database) for the project. You can name it `mycampus_db`.
3.  Open a new query tab for the `mycampus_db` schema.
4.  Copy the entire SQL script from the `mycampus.sql` section below.
5.  Paste the script into the query tab and execute it. This will create all the necessary tables and define their structures.
6.  Your database is now ready. Update your `.env.local` file with the correct database connection string.

**Using the MySQL command line:**

1.  Log in to MySQL: `mysql -u your_user -p`
2.  Create the database: `CREATE DATABASE mycampus_db;`
3.  Use the new database: `USE mycampus_db;`
4.  Save the SQL script below as a file (e.g., `schema.sql`).
5.  Run the script: `source /path/to/your/schema.sql;`

---

### 4.2. `mycampus.sql` - Ready-to-use Script for MySQL

```sql
-- Create the `users` table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'club_lead', 'student') NOT NULL DEFAULT 'student',
  `profile_image_url` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the `club_categories` table
CREATE TABLE `club_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `icon_name` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the `clubs` table
CREATE TABLE `clubs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `category_id` INT,
  `logo_url` VARCHAR(255),
  `banner_image_url` VARCHAR(255),
  `meeting_schedule` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `club_categories`(`id`) ON DELETE SET NULL
);

-- Create the `club_members` join table
CREATE TABLE `club_members` (
  `user_id` INT NOT NULL,
  `club_id` INT NOT NULL,
  `role` ENUM('lead', 'member') NOT NULL DEFAULT 'member',
  `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `club_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON DELETE CASCADE
);

-- Create the `events` table
CREATE TABLE `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `date` DATE NOT NULL,
  `time` TIME NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `cover_image_url` VARCHAR(255),
  `club_id` INT NOT NULL,
  `status` ENUM('upcoming', 'past', 'cancelled') NOT NULL DEFAULT 'upcoming',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON DELETE CASCADE
);

-- Create the `posts` table
CREATE TABLE `posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `featured_image_url` VARCHAR(255),
  `type` ENUM('announcement', 'news', 'achievement', 'event_recap') NOT NULL,
  `club_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  `publish_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `likes_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
```

---

### 4.3. MongoDB Setup (Alternative)

While this project is designed with a relational model, you could adapt it for MongoDB. You would not use the SQL script. Instead, you would define Mongoose schemas (if using Mongoose with Node.js) that mirror the relational structure, likely embedding some data (like categories within clubs) and referencing others (like users in a club's member list). This setup is more advanced and would require restructuring the backend logic.

---

## 5. Connecting the Backend and Frontend

To connect the API routes to a real database, you will need a database adapter or ORM (Object-Relational Mapper). **Prisma** is an excellent choice for Next.js applications.

**Steps to connect with Prisma:**

1.  **Install Prisma:**
    ```bash
    npm install prisma --save-dev
    npm install @prisma/client
    ```

2.  **Initialize Prisma:**
    ```bash
    npx prisma init
    ```
    This creates a `prisma` directory with a `schema.prisma` file. Your `.env.local` file will also be updated.

3.  **Define your schema in `schema.prisma`**: You would translate the SQL table definitions into Prisma's schema language.

4.  **Update API Routes**: Modify the files in `src/app/api/` to use the Prisma Client to query your database instead of using the mock data.

    *Example (`src/app/api/clubs/route.ts`):*
    ```typescript
    import { NextResponse } from 'next/server';
    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    export async function GET() {
      const clubs = await prisma.club.findMany({
        include: { category: true },
      });
      return NextResponse.json(clubs);
    }
    ```
---

## 6. User Roles & Permissions

The application uses a role-based access control system to provide a tailored experience.

### 6.1. Anonymous Visitor (Not Logged In)
*   **Access:** Can only view the public landing page (`/`), login page (`/login`), and registration page (`/register`).
*   **Actions:** Can browse featured content on the landing page and sign up or log in.

### 6.2. Student (Default Authenticated Role)
*   **Access:** Can access the full application, including the Club Directory, Event Calendar, and Newsfeed.
*   **Actions:**
    *   Browse, search, and filter all clubs, events, and news.
    *   Join or leave clubs.
    *   RSVP to events.
    *   View their joined clubs on the "My Memberships" page.

### 6.3. Club Lead
*   **Access:** Has all student permissions, plus a "My Club Management" dashboard.
*   **Actions:**
    *   Edit the details of the club they manage.
    *   Create new events and posts on behalf of their club.

### 6.4. Admin
*   **Access:** Has full access to all parts of the application, including an "Admin Dashboard".
*   **Actions:**
    *   **Club Management:** Create new clubs. Edit or delete any existing club.
    *   **User Management:** Assign users as Club Leads. Manage all user accounts.
    *   **Content Moderation:** Edit or delete any post or event.
---

## 7. Application Features & User Guide

### 7.1. Public Landing Page (`/`)
The entry point for all visitors. It showcases the best of campus life to encourage sign-ups.

### 7.2. Authentication (`/login`, `/register`)
Users can sign in using mock credentials (for now) to test different roles. The system implements role-based redirection upon successful login.

### 7.3. Club Directory (`/clubs-directory`)
The central place to discover all clubs on campus. Users can search and filter to find communities that interest them.

### 7.4. Club Detail Page (`/clubs/[slug]`)
A dedicated page for each club, displaying its full description, events, and news.

### 7.5. Club Creation & Management
*   **Create Club (`/clubs/create`):** An **admin-only** form to create a new club profile.
*   **Edit Club (`/clubs/[slug]/edit`):** A form for Club Leads or Admins to update a club's details.

### 7.6. Admin Dashboard (`/admin/dashboard`)
The control center for administrators, providing at-a-glance statistics and quick actions.
