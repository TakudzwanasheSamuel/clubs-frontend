# Backend Requirements for myCampus Campus Club Hub

## Overview

This document outlines the comprehensive backend requirements for the myCampus Campus Club Hub application. The frontend is already implemented with Next.js 15 and TypeScript, using mock data and simulated functionality. This backend needs to replace all simulated operations with real implementations.

## 1. Authentication & User Management System

### 1.1 User Registration & Login
- **Endpoint**: `POST /api/auth/register`
  - Email validation and uniqueness check
  - Password hashing (bcrypt/argon2)
  - Email verification workflow
  - User role assignment (default: student)
  
- **Endpoint**: `POST /api/auth/login`
  - Email/password authentication
  - JWT token generation
  - Session management
  - Login attempt tracking (security)

### 1.2 Password Management
- **Endpoint**: `POST /api/auth/forgot-password`
  - Password reset email generation
  - Secure token creation with expiration
  
- **Endpoint**: `POST /api/auth/reset-password`
  - Token validation
  - Password update with hashing

### 1.3 Profile Management
- **Endpoint**: `GET /api/users/profile` - Get current user profile
- **Endpoint**: `PUT /api/users/profile` - Update profile information
- **Endpoint**: `POST /api/users/upload-avatar` - Profile picture upload

### 1.4 Role-Based Access Control
Implement middleware for role verification:
- `super_admin`: Full system access
- `sdo_admin`: Club oversight and user management
- `club_lead`: Manage assigned clubs
- `student`: Basic user functionality

## 2. Database Schema Requirements

### 2.1 Core Tables

#### Users Table
```sql
- id (UUID, Primary Key)
- email (Unique, Not Null)
- password_hash (Not Null)
- first_name (Not Null)
- last_name (Not Null)
- role (Enum: super_admin, sdo_admin, club_lead, student)
- profile_picture_url (Text)
- email_verified_at (Timestamp)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### Club_Categories Table
```sql
- id (UUID, Primary Key)
- name (Unique, Not Null)
- icon (Text)
- created_at (Timestamp)
```

#### Clubs Table
```sql
- id (UUID, Primary Key)
- slug (Unique, Not Null)
- name (Unique, Not Null)
- description (Text, Not Null)
- category_id (UUID, Foreign Key)
- logo_url (Text)
- banner_image_url (Text)
- social_links (JSON)
- meeting_schedule (Text)
- member_count (Integer, Default: 0)
- status (Enum: pending, approved, suspended)
- created_by (UUID, Foreign Key to Users)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### Club_Memberships Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- club_id (UUID, Foreign Key)
- role (Enum: member, lead)
- joined_at (Timestamp)
- Unique(user_id, club_id)
```

#### Events Table
```sql
- id (UUID, Primary Key)
- slug (Unique, Not Null)
- title (Not Null)
- description (Text)
- date (Date, Not Null)
- time (Time, Not Null)
- location (Text, Not Null)
- club_id (UUID, Foreign Key)
- cover_image_url (Text)
- status (Enum: upcoming, ongoing, past, cancelled)
- max_attendees (Integer)
- created_by (UUID, Foreign Key)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### Event_RSVPs Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- event_id (UUID, Foreign Key)
- status (Enum: attending, maybe, not_attending)
- rsvp_at (Timestamp)
- Unique(user_id, event_id)
```

#### Posts Table
```sql
- id (UUID, Primary Key)
- slug (Unique, Not Null)
- title (Not Null)
- content (Text, Not Null)
- type (Enum: announcement, news, achievement, event_recap)
- featured_image_url (Text)
- author_id (UUID, Foreign Key)
- club_id (UUID, Foreign Key)
- status (Enum: draft, published, archived)
- likes_count (Integer, Default: 0)
- comments_count (Integer, Default: 0)
- published_at (Timestamp)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### Post_Likes Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- post_id (UUID, Foreign Key)
- created_at (Timestamp)
- Unique(user_id, post_id)
```

#### Post_Comments Table
```sql
- id (UUID, Primary Key)
- post_id (UUID, Foreign Key)
- user_id (UUID, Foreign Key)
- content (Text, Not Null)
- parent_id (UUID, Foreign Key, Nullable) // For nested comments
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### Notifications Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- type (Enum: event_created, post_published, club_invitation, etc.)
- title (Text, Not Null)
- message (Text, Not Null)
- data (JSON) // Additional context data
- read_at (Timestamp, Nullable)
- created_at (Timestamp)
```

## 3. API Endpoints

### 3.1 Club Management APIs

#### Club CRUD Operations
- `GET /api/clubs` - List clubs with filtering and pagination
- `GET /api/clubs/:slug` - Get club details
- `POST /api/clubs` - Create new club (requires approval)
- `PUT /api/clubs/:slug` - Update club (club leads only)
- `DELETE /api/clubs/:slug` - Delete club (admin only)

#### Club Membership APIs
- `POST /api/clubs/:slug/join` - Join a club
- `DELETE /api/clubs/:slug/leave` - Leave a club
- `GET /api/clubs/:slug/members` - List club members
- `PUT /api/clubs/:slug/members/:userId/role` - Update member role (leads only)

### 3.2 Event Management APIs

#### Event CRUD Operations
- `GET /api/events` - List events with filtering
- `GET /api/events/:slug` - Get event details
- `POST /api/events` - Create event (club leads only)
- `PUT /api/events/:slug` - Update event (creator/admin only)
- `DELETE /api/events/:slug` - Delete event (creator/admin only)

#### Event RSVP APIs
- `POST /api/events/:slug/rsvp` - RSVP to event
- `GET /api/events/:slug/attendees` - List event attendees

### 3.3 Post/News Management APIs

#### Post CRUD Operations
- `GET /api/posts` - List posts with filtering
- `GET /api/posts/:slug` - Get post details
- `POST /api/posts` - Create post (club leads only)
- `PUT /api/posts/:slug` - Update post (author/admin only)
- `DELETE /api/posts/:slug` - Delete post (author/admin only)

#### Post Interaction APIs
- `POST /api/posts/:slug/like` - Like/unlike post
- `GET /api/posts/:slug/comments` - Get post comments
- `POST /api/posts/:slug/comments` - Add comment
- `PUT /api/comments/:id` - Update comment (author only)
- `DELETE /api/comments/:id` - Delete comment (author/admin only)

### 3.4 User Management APIs

#### User Profile APIs
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users/me/memberships` - Get user's club memberships
- `GET /api/users/me/events` - Get user's RSVP'd events
- `GET /api/users/me/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

### 3.5 Admin APIs

#### User Management (Admin Only)
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user (role changes, etc.)
- `DELETE /api/admin/users/:id` - Deactivate user

#### Club Management (Admin Only)
- `GET /api/admin/clubs/pending` - List pending club approvals
- `PUT /api/admin/clubs/:id/approve` - Approve club
- `PUT /api/admin/clubs/:id/reject` - Reject club
- `GET /api/admin/analytics` - System analytics

## 4. File Upload & Storage

### 4.1 File Upload Requirements
- **Profile Pictures**: User avatars (max 2MB, jpg/png)
- **Club Logos**: Club branding (max 1MB, jpg/png)
- **Club Banners**: Club page headers (max 5MB, jpg/png)
- **Event Images**: Event cover photos (max 5MB, jpg/png)
- **Post Images**: Featured post images (max 5MB, jpg/png)

### 4.2 Storage Implementation
- Cloud storage integration (AWS S3, Google Cloud Storage, or Cloudinary)
- Image optimization and resizing
- CDN integration for fast delivery
- File validation (type, size, dimensions)
- Secure upload URLs with expiration

### 4.3 Upload Endpoints
- `POST /api/upload/profile-picture` - Upload user avatar
- `POST /api/upload/club-logo` - Upload club logo
- `POST /api/upload/club-banner` - Upload club banner
- `POST /api/upload/event-image` - Upload event cover
- `POST /api/upload/post-image` - Upload post featured image

## 5. Search & Filtering

### 5.1 Search Requirements
- **Full-text search** across clubs, events, and posts
- **Filtering capabilities**:
  - Clubs: by category, member count, meeting schedule
  - Events: by date range, club, location, status
  - Posts: by type, club, date range
- **Sorting options**: relevance, date, popularity, alphabetical
- **Pagination**: Server-side pagination with configurable page sizes

### 5.2 Search Implementation
- Search engine integration (Elasticsearch, Algolia, or database full-text search)
- Search indexing for optimal performance
- Auto-complete suggestions
- Search analytics and popular queries

## 6. Notification System

### 6.1 Notification Types
- **Club Events**: New events from joined clubs
- **Post Updates**: New posts from joined clubs
- **Membership**: Club join requests, approvals
- **System**: Account updates, security alerts
- **Admin**: Pending approvals, system issues

### 6.2 Notification Channels
- **In-app notifications**: Real-time UI updates
- **Email notifications**: Configurable email preferences
- **Push notifications**: Optional browser/mobile notifications

### 6.3 Implementation Requirements
- Real-time notification delivery (WebSockets/Server-Sent Events)
- Notification preferences management
- Email templates and SMTP configuration
- Notification queuing and batching
- Unsubscribe management

## 7. Security Requirements

### 7.1 Authentication Security
- JWT token management with refresh tokens
- Rate limiting on authentication endpoints
- Account lockout after failed attempts
- Secure password requirements
- Two-factor authentication (optional enhancement)

### 7.2 Authorization Security
- Role-based access control middleware
- Resource ownership verification
- API endpoint protection
- Input validation and sanitization
- SQL injection prevention

### 7.3 Data Security
- Encrypted data storage for sensitive information
- HTTPS enforcement
- CORS configuration
- Security headers implementation
- Regular security audits

## 8. Performance & Scalability

### 8.1 Database Optimization
- Proper indexing strategy
- Query optimization
- Connection pooling
- Database caching (Redis)
- Read replicas for scalability

### 8.2 API Performance
- Response caching strategies
- API rate limiting
- Compression (gzip)
- Monitoring and logging
- Performance metrics tracking

## 9. Technology Stack Recommendations

### 9.1 Backend Framework Options
- **Node.js**: Express.js, NestJS, or Fastify
- **Python**: Django, FastAPI, or Flask
- **PHP**: Laravel or Symfony
- **Java**: Spring Boot
- **C#**: ASP.NET Core

### 9.2 Database Options
- **Primary Database**: PostgreSQL or MySQL
- **Caching**: Redis
- **Search**: Elasticsearch or built-in database search
- **File Storage**: AWS S3, Google Cloud Storage, or local storage

### 9.3 Additional Services
- **Email Service**: SendGrid, Mailgun, or AWS SES
- **Image Processing**: Cloudinary or ImageKit
- **Monitoring**: New Relic, DataDog, or custom logging
- **Deployment**: Docker containers with Kubernetes or cloud services

## 10. Implementation Priority

### Phase 1: Core Backend (MVP)
1. User authentication and registration
2. Basic CRUD for clubs, events, and posts
3. Club membership system
4. File upload for images
5. Basic search and filtering

### Phase 2: Enhanced Features
1. Comment system and post interactions
2. Event RSVP functionality
3. Admin panel backend
4. Email notifications
5. Advanced search capabilities

### Phase 3: Advanced Features
1. Real-time notifications
2. Advanced analytics
3. Two-factor authentication
4. Performance optimizations
5. Mobile app API support

## 11. API Documentation

The backend should include comprehensive API documentation using:
- **OpenAPI/Swagger** specification
- Interactive API explorer
- Request/response examples
- Authentication requirements
- Error code documentation

## 12. Testing Requirements

### 12.1 Testing Strategy
- **Unit tests**: Individual function testing
- **Integration tests**: API endpoint testing
- **Database tests**: Data persistence and relationships
- **Security tests**: Authentication and authorization
- **Performance tests**: Load and stress testing

### 12.2 Testing Tools
- Test frameworks appropriate for chosen technology stack
- Database seeding for test data
- Automated testing in CI/CD pipeline
- Code coverage reporting

This comprehensive backend implementation will transform the current mock-based frontend into a fully functional campus club management system.