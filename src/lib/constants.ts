// Default image paths for the application
export const DEFAULT_IMAGES = {
  // Club images
  CLUB_LOGO: '/images/defaults/default-club-logo.png',
  CLUB_BANNER: '/images/defaults/default-club-banner.png',
  
  // Event images
  EVENT_COVER: '/images/defaults/default-event-cover.png',
  
  // News/Post images
  NEWS_FEATURED: '/images/defaults/default-news-image.png',
  
  // User images
  USER_AVATAR: '/images/defaults/default-user-avatar.png',
  POST_AVATAR: '/images/defaults/default-post-avatar.png',
  
  // App branding
  APP_LOGO: '/logo.png',
  APP_BANNER: '/banner.png',
} as const;

// Image dimensions for reference
export const IMAGE_DIMENSIONS = {
  CLUB_LOGO: { width: 100, height: 100 },
  CLUB_BANNER: { width: 800, height: 300 },
  EVENT_COVER: { width: 600, height: 400 },
  NEWS_FEATURED: { width: 600, height: 300 },
  USER_AVATAR: { width: 100, height: 100 },
  POST_AVATAR: { width: 50, height: 50 },
} as const;

// Helper function to get default image with fallback
export function getDefaultImage(type: keyof typeof DEFAULT_IMAGES, fallback?: string): string {
  return DEFAULT_IMAGES[type] || fallback || DEFAULT_IMAGES.USER_AVATAR;
}
