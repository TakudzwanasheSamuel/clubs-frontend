# myCampus API Documentation

This document provides a comprehensive overview of the backend API endpoints for the myCampus application. These endpoints are designed to be used by the Next.js frontend to fetch and manipulate data.

**Base URL:** All endpoints are prefixed with `/api`.

---

## Authentication

In a production environment, all `POST`, `PUT`, and `DELETE` requests, as well as certain `GET` requests (e.g., `/api/users`), would be protected. An authentication token (like a JWT) would be required in the `Authorization` header. The current implementation does not include this layer, but the documentation specifies the intended user roles for each protected endpoint.

---

## Data Models (Schemas)

### Club
```json
{
  "id": "string",
  "slug": "string",
  "name": "string",
  "description": "string",
  "category": {
    "id": "string",
    "name": "string",
    "icon": "string"
  },
  "logoUrl": "string",
  "bannerImageUrl": "string",
  "socialLinks": {
    "facebook": "string",
    "instagram": "string",
    "twitter": "string",
    "website": "string"
  },
  "meetingSchedule": "string",
  "memberCount": "integer",
  "userId": "string"
}
```

### Event
```json
{
  "id": "string",
  "slug": "string",
  "title": "string",
  "description": "string",
  "date": "string (ISO 8601)",
  "time": "string",
  "location": "string",
  "clubName": "string",
  "clubId": "string",
  "coverImageUrl": "string",
  "status": "string (upcoming | past | cancelled)"
}
```

### Post
```json
{
  "id": "string",
  "slug": "string",
  "title": "string",
  "author": {
    "name": "string",
    "avatarUrl": "string"
  },
  "clubName": "string",
  "clubId": "string",
  "content": "string",
  "featuredImageUrl": "string",
  "publishDate": "string (ISO 8601)",
  "likes": "integer",
  "commentsCount": "integer",
  "type": "string (announcement | news | achievement | event_recap)"
}
```

### User
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "role": "string (admin | club_lead | student)"
}
```

### ClubCategory
```json
{
  "id": "string",
  "name": "string",
  "icon": "string"
}
```

---

## Endpoints

### Clubs

#### `GET /api/clubs`
- **Description:** Retrieve a list of all clubs.
- **Access:** Public
- **Responses:**
  - `200 OK`: Returns an array of `Club` objects.

#### `POST /api/clubs`
- **Description:** Create a new club.
- **Access:** Admin
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "categoryId": "string",
    "logoUrl": "string (optional)",
    "bannerImageUrl": "string (optional)",
    "userId": "string (ID of the assigned club lead)"
  }
  ```
- **Responses:**
  - `201 Created`: Returns the newly created `Club` object.
  - `400 Bad Request`: If required fields are missing.

#### `GET /api/clubs/{slug}`
- **Description:** Get a single club by its slug.
- **Access:** Public
- **Parameters:**
  - `slug` (string): The URL-friendly slug of the club.
- **Responses:**
  - `200 OK`: Returns a single `Club` object.
  - `404 Not Found`: If no club with the given slug exists.

#### `PUT /api/clubs/{slug}`
- **Description:** Update an existing club's details.
- **Access:** Admin, Club Lead (of that club)
- **Parameters:**
  - `slug` (string): The slug of the club to update.
- **Request Body:** A partial `Club` object with the fields to update.
- **Responses:**
  - `200 OK`: Returns the updated `Club` object.
  - `404 Not Found`: If the club doesn't exist.

#### `DELETE /api/clubs/{slug}`
- **Description:** Delete a club.
- **Access:** Admin
- **Parameters:**
  - `slug` (string): The slug of the club to delete.
- **Responses:**
  - `204 No Content`: On successful deletion.
  - `404 Not Found`: If the club doesn't exist.


### Categories

#### `GET /api/categories`
- **Description:** Retrieve a list of all club categories.
- **Access:** Public
- **Responses:**
  - `200 OK`: Returns an array of `ClubCategory` objects.

### Events

#### `GET /api/events`
- **Description:** Retrieve a list of all events.
- **Access:** Public
- **Responses:**
  - `200 OK`: Returns an array of `Event` objects.

#### `POST /api/events`
- **Description:** Create a new event.
- **Access:** Admin, Club Lead
- **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "date": "string (YYYY-MM-DD)",
    "time": "string (HH:MM AM/PM)",
    "location": "string",
    "clubId": "string",
    "coverImageUrl": "string (optional)"
  }
  ```
- **Responses:**
  - `201 Created`: Returns the newly created `Event` object.
  - `400 Bad Request`: If required fields are missing.

### Posts

#### `GET /api/posts`
- **Description:** Retrieve a list of all posts.
- **Access:** Public
- **Responses:**
  - `200 OK`: Returns an array of `Post` objects.

#### `POST /api/posts`
- **Description:** Create a new post.
- **Access:** Admin, Club Lead
- **Request Body:**
  ```json
  {
    "title": "string",
    "content": "string",
    "postType": "string",
    "clubId": "string",
    "featuredImageUrl": "string (optional)"
  }
  ```
- **Responses:**
  - `201 Created`: Returns the newly created `Post` object.
  - `400 Bad Request`: If required fields are missing.

### Users

#### `GET /api/users`
- **Description:** Retrieve a list of all users.
- **Access:** Admin
- **Responses:**
  - `200 OK`: Returns an array of `User` objects.
