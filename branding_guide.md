# myCampus Branding Guide

## 🎨 Overview
This guide provides comprehensive specifications for all images used throughout the myCampus application, ensuring consistent design and optimal user experience across all platforms.

## 🖼️ Image Categories

### 1. **App Branding Images (Hardcoded)**
These are core application images that are part of the application itself.

#### **Application Logo**
- **File**: `/public/logo.png`
- **Dimensions**: 40x40 pixels
- **Format**: PNG (recommended) or SVG
- **Usage**: Header logo, sidebar logo, favicon
- **Design**: Rounded with shadow, University Blue border
- **Styling**: `rounded-full shadow-lg border-2 border-primary/20`

#### **Landing Page Banner**
- **File**: `/public/banner.png`
- **Dimensions**: 1200x600 pixels (2:1 aspect ratio)
- **Format**: PNG or JPG
- **Usage**: Hero section on landing page
- **Styling**: `rounded-lg shadow-2xl mx-auto`

---

### 2. **User-Generated Content Images**
These are images uploaded by users through various forms and interfaces.

#### **Club Logos**
- **Upload Location**: Club creation/edit forms (`/clubs/create`, `/clubs/[slug]/edit`)
- **Field**: `logoUrl`
- **Recommended Dimensions**: 100x100 pixels (square)
- **Minimum Dimensions**: 60x60 pixels
- **Maximum Dimensions**: 200x200 pixels
- **Format**: PNG, JPG, WebP
- **Usage**: Club cards, club detail pages, club management
- **Display Size**: 60x60px in club cards, 50x50px in event details
- **Styling**: `rounded-md border-2 border-background shadow-md`

#### **Club Banner Images**
- **Upload Location**: Club creation/edit forms (`/clubs/create`, `/clubs/[slug]/edit`)
- **Field**: `bannerImageUrl`
- **Recommended Dimensions**: 800x300 pixels (8:3 aspect ratio)
- **Minimum Dimensions**: 600x225 pixels
- **Maximum Dimensions**: 1200x450 pixels
- **Format**: PNG, JPG, WebP
- **Usage**: Club cards, club detail pages
- **Display Size**: Full width, height varies by context (h-32 in cards, h-48 in details)
- **Styling**: `objectFit="cover"` with gradient overlay for text readability

#### **Event Cover Images**
- **Upload Location**: Event creation forms (`/events/create`)
- **Field**: `coverImageUrl`
- **Recommended Dimensions**: 600x400 pixels (3:2 aspect ratio)
- **Minimum Dimensions**: 400x267 pixels
- **Maximum Dimensions**: 800x533 pixels
- **Format**: PNG, JPG, WebP
- **Usage**: Event cards, event detail pages
- **Display Size**: Full width, h-48 in event cards
- **Styling**: `objectFit="cover"` with `rounded-t-lg`

#### **News Post Featured Images**
- **Upload Location**: News post creation forms (`/news/create`)
- **Field**: `featuredImageUrl`
- **Recommended Dimensions**: 600x300 pixels (2:1 aspect ratio)
- **Minimum Dimensions**: 400x200 pixels
- **Maximum Dimensions**: 800x400 pixels
- **Format**: PNG, JPG, WebP
- **Usage**: News post cards, post detail pages
- **Display Size**: Full width, h-56 in post cards
- **Styling**: `objectFit="cover"` with `rounded-t-lg`

#### **User Profile Pictures**
- **Upload Location**: User profile settings (future feature)
- **Field**: `profilePictureUrl`
- **Recommended Dimensions**: 100x100 pixels (square)
- **Minimum Dimensions**: 50x50 pixels
- **Maximum Dimensions**: 200x200 pixels
- **Format**: PNG, JPG, WebP
- **Usage**: User avatars, post author images, header user menu
- **Display Sizes**: 
  - Header: 32x32px (`h-8 w-8`)
  - Post author: 24x24px (`h-6 w-6`)
  - Testimonials: 56x56px (`h-14 w-14`)
- **Styling**: `rounded-full` with fallback to initials

#### **Post Author Avatars**
- **Upload Location**: News post creation forms (`/news/create`)
- **Field**: `authorAvatarUrl`
- **Recommended Dimensions**: 50x50 pixels (square)
- **Minimum Dimensions**: 40x40 pixels
- **Maximum Dimensions**: 100x100 pixels
- **Format**: PNG, JPG, WebP
- **Usage**: Post author identification
- **Display Size**: 24x24px in post cards
- **Styling**: `rounded-full` with fallback to user icon

---

### 3. **Placeholder Images (Development)**
These are temporary images used during development and testing.

#### **Development Placeholders**
- **Source**: `https://placehold.co/`
- **Current Usage**: 
  - Club logos: `100x100.png`
  - Club banners: `800x300.png`
  - Event covers: `600x400.png`
  - Post featured: `600x300.png`
  - User avatars: `50x50.png`
  - Testimonial avatars: `100x100.png`

---

## 📱 Responsive Design Considerations

### **Mobile-First Approach**
- All images should be optimized for mobile devices
- Consider providing multiple sizes for different screen densities
- Use `objectFit="cover"` for consistent cropping across devices

### **Aspect Ratio Maintenance**
- **Square Images**: Logos, profile pictures, avatars
- **Landscape Images**: Banners, event covers, post featured images
- **Portrait Images**: Not currently used, but consider for future features

---

## 🎯 Image Quality Standards

### **Resolution Requirements**
- **High DPI Support**: Provide 2x resolution for retina displays
- **Minimum Quality**: 72 DPI for web
- **File Size**: Optimize for web (max 500KB for large images, 100KB for small images)

### **Format Recommendations**
- **Photographs**: JPG for better compression
- **Graphics/Logos**: PNG for transparency support
- **Modern Browsers**: WebP for optimal compression
- **Fallback**: Always provide JPG/PNG fallbacks

---

## 🔧 Technical Implementation

### **Next.js Image Component Usage**
```tsx
// Standard image with dimensions
<Image 
  src={imageUrl} 
  alt={altText} 
  width={width} 
  height={height} 
  className={className}
/>

// Responsive fill image
<div className="relative w-full h-32">
  <Image 
    src={imageUrl} 
    alt={altText} 
    layout="fill" 
    objectFit="cover"
  />
</div>
```

### **Image Optimization**
- **Remote Patterns**: Configured in `next.config.ts` for external domains
- **Lazy Loading**: Automatic for images below the fold
- **Priority Loading**: Used for above-the-fold images (landing page banner)

---

## 📋 Upload Form Guidelines

### **Form Validation**
- **URL Format**: Must be valid HTTP/HTTPS URLs
- **Required Fields**: Club logos, event covers (if provided)
- **Optional Fields**: Club banners, post featured images, user avatars

### **User Experience**
- **Preview**: Show image preview before submission
- **Error Handling**: Clear error messages for invalid URLs
- **Loading States**: Show loading indicators during image processing

---

## 🎨 Design System Integration

### **Color Scheme**
- **Primary**: University Blue (#004D98)
- **Secondary**: Light Grey (#F2F2F2)
- **Accent**: Teal (#008080)
- **Background**: White (#FFFFFF)
- **Text**: Dark Blue (#001A33)

### **Border Radius**
- **Small**: `rounded-md` (6px) - Club logos, buttons
- **Medium**: `rounded-lg` (8px) - Cards, banners
- **Large**: `rounded-full` - Avatars, logos

### **Shadows**
- **Light**: `shadow-md` - Cards, buttons
- **Medium**: `shadow-lg` - Sidebar, logo
- **Heavy**: `shadow-2xl` - Landing page banner

---

## 🚀 Future Enhancements

### **Planned Features**
- **Image Upload**: Direct file upload instead of URL input
- **Image Cropping**: Built-in image editing tools
- **Multiple Sizes**: Automatic generation of different image dimensions
- **CDN Integration**: Cloud-based image hosting and optimization

### **Accessibility Improvements**
- **Alt Text**: Comprehensive alt text for all images
- **Focus Indicators**: Clear focus states for interactive images
- **Screen Reader Support**: Proper ARIA labels and descriptions

---

## 📞 Support & Maintenance

### **Image Updates**
- **App Images**: Update files in `/public/` directory
- **User Images**: Users update through respective forms
- **Placeholders**: Update seed data in `prisma/seed.ts`

### **Quality Assurance**
- **Regular Audits**: Monthly review of image quality and consistency
- **Performance Monitoring**: Track image loading times and optimization
- **User Feedback**: Collect feedback on image quality and usability

---

*Last Updated: January 2025*
*Version: 1.0*
*Maintained by: myCampus Development Team*
