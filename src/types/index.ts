export type ClubCategory = {
  id: string;
  name: string;
  icon?: string; // Corresponds to lucide icon name or path to custom icon
};

export type Club = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ClubCategory;
  logoUrl: string;
  bannerImageUrl?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  meetingSchedule?: string;
  memberCount: number;
  userId?: string; // ID of the user who created/manages the club
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string; // ISO string or formatted date
  time: string;
  location: string;
  clubName: string; // Name of the club hosting the event
  clubId: string;
  coverImageUrl?: string;
  status?: 'upcoming' | 'ongoing' | 'past' | 'cancelled';
};

export type Post = {
  id:string;
  slug: string;
  title: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  clubName: string; // Name of the club that made the post
  clubId: string;
  content: string;
  featuredImageUrl?: string;
  publishDate: string; // ISO string or formatted date
  likes: number;
  commentsCount: number;
  type: 'announcement' | 'news' | 'achievement' | 'event_recap';
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'sdo_admin' | 'club_lead' | 'student';
  profilePictureUrl?: string;
};