# **myCampus - Campus Club Hub**

## Project Overview

myCampus is a comprehensive web application designed to be the central hub for campus clubs and student activities. The platform features a fully public interface for community discovery and authenticated sections for management and interaction.

## ✅ Implemented Core Features

### **Public Interface (No Authentication Required)**
- **Public Landing Page**: Modern homepage with real-time data showcasing featured clubs, events, and news
- **Club Directory**: Browse all campus clubs with advanced filtering and search capabilities
- **Event Calendar**: View all upcoming and past events with detailed information
- **News & Announcements**: Read latest updates, stories, and announcements from clubs
- **Clean Public Navigation**: Custom headers optimized for public browsing experience

### **Authentication & User Management**
- **Dual Login System**: Support for both email and registration number authentication
- **Role-Based Access Control**: Four distinct user roles (super_admin, sdo_admin, club_lead, student)
- **JWT Authentication**: Secure token-based authentication with automatic role-based redirection
- **User Registration**: Self-service account creation with role assignment

### **Admin Management Tools**
- **User Management**: Complete CRUD operations for user accounts (admin only)
- **Club Creation**: Admin-only club creation with direct student assignment as leaders
- **Content Management**: Admin-controlled creation of events and posts
- **Club Assignment**: Real-time search and assignment of students as club leaders
- **System Dashboard**: Real-time statistics and analytics for administrators

### **Club Management System**
- **Direct Image Upload**: File upload with drag-and-drop, validation, and preview
- **Template Image System**: Professional fallback images for consistent visual experience
- **Club Editing**: Full club profile management with rich media support
- **Membership Management**: Join/leave functionality with real-time updates
- **Leader Dashboard**: Dedicated management interface for club leaders

### **Smart Navigation & UX**
- **Conditional Navigation**: Navigation completely hidden for unauthenticated users
- **Mobile Optimization**: Hidden mobile navigation on public pages for clean experience
- **Role-Based UI**: Buttons and features visible only to authorized user roles
- **Responsive Design**: Fully optimized for all devices and screen sizes

## 🎨 Style Guidelines

### **Color Scheme**
- **Primary**: University Blue (#004D98) - Trust and academic authority
- **Secondary**: Light Grey (#F2F2F2) - Clean backgrounds and content separation
- **Accent**: Teal (#008080) - Modern highlights and interactive elements
- **Background**: Clean white/light grey for optimal readability

### **Typography**
- **Sans-serif fonts** for body text ensuring maximum legibility
- **Consistent font hierarchy** with clear heading and body text distinctions
- **Readable line spacing** and character spacing for accessibility

### **Visual Design**
- **Minimalist icon set** (Lucide React) for consistent visual language
- **Grid-based layouts** for organized information architecture
- **Subtle shadows and borders** for depth and content separation
- **Smooth transitions** and hover states for enhanced user experience

### **Component Standards**
- **ShadCN UI components** for consistent design system
- **Tailwind CSS** for utility-first styling approach
- **Custom template images** with professional fallbacks
- **Responsive breakpoints** optimized for mobile, tablet, and desktop

## 🔧 Technical Architecture

### **Frontend Stack**
- **Next.js 15** with App Router and Server Components
- **TypeScript** for type safety and developer experience
- **React 18** with modern hooks and context management
- **Tailwind CSS** for responsive utility-first styling

### **Backend Integration**
- **MySQL Database** with Prisma ORM for type-safe operations
- **JWT Authentication** with secure token management
- **File Upload System** with validation and local storage
- **Public API Endpoints** for unauthenticated content access

### **Security Features**
- **Role-based access control** with granular permissions
- **Password hashing** with bcryptjs for secure storage
- **File upload validation** with type and size restrictions
- **Authentication middleware** for protected routes

## 📱 User Experience Principles

### **Public First Approach**
- All content accessible without authentication for community discovery
- Clean, focused interface without navigation clutter for public users
- Professional appearance with custom branding and template images

### **Progressive Enhancement**
- Additional features unlocked through authentication
- Role-based functionality with appropriate access levels
- Seamless transition from public browsing to authenticated experience

### **Mobile Optimization**
- Touch-friendly interface design
- Responsive layouts adapting to screen size
- Optimized navigation patterns for mobile users

## 🚀 Production Ready Status

The application is fully functional and production-ready with:
- Complete authentication and authorization system
- Real database integration with proper schema design
- File upload and image management capabilities
- Admin tools for content and user management
- Public interface optimized for community engagement
- Mobile-responsive design with excellent UX

**Built with modern web technologies for campus communities worldwide.**