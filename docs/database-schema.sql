# Database Schema for myCampus

## Entity Relationship Diagram (Text Format)

```
Users (1) ──── (M) Club_Memberships (M) ──── (1) Clubs
  │                                              │
  │                                              │
  ├── (1:M) Events ────────────────────────────────┘
  │
  ├── (1:M) Posts ─────────────────────────────────┘
  │                │
  │                ├── (1:M) Post_Likes ──── (M:1) Users
  │                └── (1:M) Post_Comments ── (M:1) Users
  │
  ├── (1:M) Event_RSVPs (M) ──── (1) Events
  │
  └── (1:M) Notifications
```

## Core Tables with Relationships

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    profile_picture_url TEXT,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM ('super_admin', 'sdo_admin', 'club_lead', 'student');
```

### 2. Club Categories Table
```sql
CREATE TABLE club_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO club_categories (name, icon) VALUES
('Academic', 'BookOpen'),
('Service', 'HeartHandshake'),
('Arts & Culture', 'Palette'),
('Sports & Recreation', 'Bike'),
('Technology', 'Laptop'),
('Business & Entrepreneurship', 'Briefcase');
```

### 3. Clubs Table
```sql
CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES club_categories(id),
    logo_url TEXT,
    banner_image_url TEXT,
    social_links JSONB,
    meeting_schedule TEXT,
    member_count INTEGER DEFAULT 0,
    status club_status DEFAULT 'pending',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE club_status AS ENUM ('pending', 'approved', 'suspended');

-- Indexes
CREATE INDEX idx_clubs_category ON clubs(category_id);
CREATE INDEX idx_clubs_status ON clubs(status);
CREATE INDEX idx_clubs_slug ON clubs(slug);
```

### 4. Club Memberships Table
```sql
CREATE TABLE club_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    role membership_role DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, club_id)
);

CREATE TYPE membership_role AS ENUM ('member', 'lead');

-- Indexes
CREATE INDEX idx_memberships_user ON club_memberships(user_id);
CREATE INDEX idx_memberships_club ON club_memberships(club_id);

-- Trigger to update club member count
CREATE OR REPLACE FUNCTION update_club_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE clubs SET member_count = member_count + 1 WHERE id = NEW.club_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE clubs SET member_count = member_count - 1 WHERE id = OLD.club_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_club_member_count
    AFTER INSERT OR DELETE ON club_memberships
    FOR EACH ROW EXECUTE FUNCTION update_club_member_count();
```

### 5. Events Table
```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    cover_image_url TEXT,
    status event_status DEFAULT 'upcoming',
    max_attendees INTEGER,
    rsvp_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'past', 'cancelled');

-- Indexes
CREATE INDEX idx_events_club ON events(club_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
```

### 6. Event RSVPs Table
```sql
CREATE TABLE event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status rsvp_status DEFAULT 'attending',
    rsvp_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

CREATE TYPE rsvp_status AS ENUM ('attending', 'maybe', 'not_attending');

-- Trigger to update event RSVP count
CREATE OR REPLACE FUNCTION update_event_rsvp_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'attending' THEN
        UPDATE events SET rsvp_count = rsvp_count + 1 WHERE id = NEW.event_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'attending' AND NEW.status != 'attending' THEN
            UPDATE events SET rsvp_count = rsvp_count - 1 WHERE id = NEW.event_id;
        ELSIF OLD.status != 'attending' AND NEW.status = 'attending' THEN
            UPDATE events SET rsvp_count = rsvp_count + 1 WHERE id = NEW.event_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'attending' THEN
        UPDATE events SET rsvp_count = rsvp_count - 1 WHERE id = OLD.event_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_rsvp_count
    AFTER INSERT OR UPDATE OR DELETE ON event_rsvps
    FOR EACH ROW EXECUTE FUNCTION update_event_rsvp_count();
```

### 7. Posts Table
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type post_type NOT NULL,
    featured_image_url TEXT,
    author_id UUID NOT NULL REFERENCES users(id),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    status post_status DEFAULT 'published',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE post_type AS ENUM ('announcement', 'news', 'achievement', 'event_recap');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');

-- Indexes
CREATE INDEX idx_posts_club ON posts(club_id);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_published ON posts(published_at) WHERE status = 'published';
```

### 8. Post Likes Table
```sql
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Trigger to update post likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_likes_count
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();
```

### 9. Post Comments Table
```sql
CREATE TABLE post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_post ON post_comments(post_id);
CREATE INDEX idx_comments_user ON post_comments(user_id);
CREATE INDEX idx_comments_parent ON post_comments(parent_id);

-- Trigger to update post comments count
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_comments_count
    AFTER INSERT OR DELETE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();
```

### 10. Notifications Table
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE notification_type AS ENUM (
    'event_created',
    'event_updated', 
    'post_published',
    'club_invitation',
    'club_approved',
    'club_rejected',
    'member_joined',
    'member_left',
    'comment_added',
    'post_liked'
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_type ON notifications(type);
```

## Sample Data Queries

### Get clubs with member count and category info
```sql
SELECT 
    c.id,
    c.slug,
    c.name,
    c.description,
    c.member_count,
    cc.name as category_name,
    cc.icon as category_icon,
    u.first_name || ' ' || u.last_name as created_by_name
FROM clubs c
JOIN club_categories cc ON c.category_id = cc.id
JOIN users u ON c.created_by = u.id
WHERE c.status = 'approved'
ORDER BY c.member_count DESC;
```

### Get user's club memberships with club details
```sql
SELECT 
    c.id,
    c.slug,
    c.name,
    c.logo_url,
    cm.role,
    cm.joined_at
FROM club_memberships cm
JOIN clubs c ON cm.club_id = c.id
WHERE cm.user_id = $1
ORDER BY cm.joined_at DESC;
```

### Get upcoming events for user's clubs
```sql
SELECT DISTINCT
    e.id,
    e.slug,
    e.title,
    e.event_date,
    e.event_time,
    e.location,
    c.name as club_name,
    CASE WHEN er.status IS NOT NULL THEN er.status ELSE 'not_responded' END as rsvp_status
FROM events e
JOIN clubs c ON e.club_id = c.id
JOIN club_memberships cm ON c.id = cm.club_id
LEFT JOIN event_rsvps er ON e.id = er.event_id AND er.user_id = $1
WHERE cm.user_id = $1 
  AND e.event_date >= CURRENT_DATE
  AND e.status = 'upcoming'
ORDER BY e.event_date ASC, e.event_time ASC;
```

### Get posts from user's clubs with interaction data
```sql
SELECT 
    p.id,
    p.slug,
    p.title,
    p.content,
    p.type,
    p.featured_image_url,
    p.likes_count,
    p.comments_count,
    p.published_at,
    u.first_name || ' ' || u.last_name as author_name,
    u.profile_picture_url as author_avatar,
    c.name as club_name,
    CASE WHEN pl.id IS NOT NULL THEN true ELSE false END as user_liked
FROM posts p
JOIN users u ON p.author_id = u.id
JOIN clubs c ON p.club_id = c.id
JOIN club_memberships cm ON c.id = cm.club_id
LEFT JOIN post_likes pl ON p.id = pl.post_id AND pl.user_id = $1
WHERE cm.user_id = $1
  AND p.status = 'published'
ORDER BY p.published_at DESC;
```

This schema provides a solid foundation for the myCampus backend with proper relationships, constraints, and performance optimizations.