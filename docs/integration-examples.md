# Frontend-Backend Integration Examples

## Example 1: Login Form Integration

### Current Implementation (Simulated)
```typescript
// src/app/login/page.tsx - Current simulated version
async function onSubmit(data: LoginFormValues) {
  setIsSubmitting(true);
  console.log("Login data (simulated):", data);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  toast({
    title: "Login Successful!",
    description: "Welcome to myCampus. Redirecting to Club Directory...",
  });

  router.push('/clubs-directory'); 
  setIsSubmitting(false);
}
```

### Required Backend Integration
```typescript
// src/app/login/page.tsx - With real backend integration
async function onSubmit(data: LoginFormValues) {
  setIsSubmitting(true);
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const { user, token } = await response.json();
    
    // Store token (localStorage, cookies, or context)
    localStorage.setItem('authToken', token);
    
    toast({
      title: "Login Successful!",
      description: `Welcome back, ${user.firstName}!`,
    });

    router.push('/clubs-directory');
  } catch (error) {
    toast({
      title: "Login Failed",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
}
```

## Example 2: Club Creation Form Integration

### Current Implementation (Simulated)
```typescript
// src/app/clubs/create/page.tsx - Current simulated version
function onSubmit(data: CreateClubFormValues) {
  console.log("Create club data:", data);
  toast({
    title: "Club Creation Submitted (Simulated)",
    description: "In a real app, this would go through an approval process.",
  });
  form.reset();
}
```

### Required Backend Integration
```typescript
// src/app/clubs/create/page.tsx - With real backend integration
async function onSubmit(data: CreateClubFormValues) {
  setIsSubmitting(true);
  
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/clubs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Club creation failed');
    }

    const club = await response.json();
    
    toast({
      title: "Club Submitted for Approval",
      description: "Your club application will be reviewed by administrators.",
    });
    
    form.reset();
    router.push('/clubs-directory');
  } catch (error) {
    toast({
      title: "Submission Failed",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
}
```

## Example 3: Club Directory with Real Data

### Current Implementation (Mock Data)
```typescript
// src/app/clubs-directory/page.tsx - Current mock data version
import { mockClubs, clubCategories } from '@/lib/mock-data';

export default function ClubsDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Filter clubs based on search and category
  const filteredClubs = mockClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || club.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    // ... JSX using filteredClubs
  );
}
```

### Required Backend Integration
```typescript
// src/app/clubs-directory/page.tsx - With real backend integration
'use client';

import { useState, useEffect } from 'react';
import { Club, ClubCategory } from '@/types';

export default function ClubsDirectoryPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [categories, setCategories] = useState<ClubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const [clubsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/clubs'),
          fetch('/api/categories')
        ]);

        if (!clubsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const clubsData = await clubsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setClubs(clubsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load clubs data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Client-side filtering (or use server-side filtering with query params)
  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || club.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div>Loading clubs...</div>;
  }

  return (
    // ... JSX using filteredClubs
  );
}
```

## Example 4: Required Backend API Endpoints

### Authentication Endpoints
```typescript
// Backend API endpoints needed

POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@university.edu",
  "password": "securePassword123"
}
Response: { "message": "Registration successful. Please verify your email." }

POST /api/auth/login
{
  "email": "john.doe@university.edu",
  "password": "securePassword123"
}
Response: { 
  "user": { "id": "...", "firstName": "John", "role": "student" },
  "token": "jwt_token_here"
}

POST /api/auth/logout
Headers: { "Authorization": "Bearer jwt_token_here" }
Response: { "message": "Logged out successfully" }
```

### Club Management Endpoints
```typescript
GET /api/clubs?search=coding&category=technology&page=1&limit=10
Response: {
  "clubs": [...],
  "total": 50,
  "page": 1,
  "totalPages": 5
}

POST /api/clubs
Headers: { "Authorization": "Bearer jwt_token_here" }
{
  "name": "New Coding Club",
  "description": "...",
  "categoryId": "tech-category-id",
  "logoUrl": "...",
  "meetingSchedule": "..."
}
Response: { 
  "club": { "id": "...", "slug": "new-coding-club", "status": "pending" },
  "message": "Club submitted for approval"
}

GET /api/clubs/coding-club
Response: { "club": { "id": "...", "name": "Coding Club", ... } }

POST /api/clubs/coding-club/join
Headers: { "Authorization": "Bearer jwt_token_here" }
Response: { "message": "Successfully joined the club" }
```

## Example 5: Required Environment Variables

```bash
# .env.local (Frontend)
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_UPLOAD_URL=https://your-cdn.com

# .env (Backend)
DATABASE_URL=postgresql://user:password@localhost:5432/mycampus
JWT_SECRET=your-jwt-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Summary of Required Changes

1. **Replace all mock data imports** with API calls
2. **Add authentication state management** (Context API or Zustand)
3. **Add loading states** for all data fetching
4. **Add error handling** for failed API calls
5. **Add form validation** that matches backend validation
6. **Add file upload components** to replace URL inputs
7. **Add protected route middleware** for authenticated pages
8. **Add real-time features** for notifications (WebSocket/SSE)

The frontend architecture is solid and ready for backend integration. Most changes will be in the data fetching and form submission logic.