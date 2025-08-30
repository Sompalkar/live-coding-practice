# Todo App - Authentication System

## Overview

This is a Next.js application with a complete authentication system built using Zustand for state management. The app provides user registration, login, logout, and persistent authentication across browser sessions.

## File Structure

```
client/
├── app/
│   ├── components/
│   │   └── AuthProvider.tsx          # Authentication context provider
│   ├── login/
│   │   └── page.tsx                  # Login page
│   ├── register/
│   │   └── page.tsx                  # Registration page
│   ├── todo/
│   │   └── page.tsx                  # Protected todo page
│   ├── layout.tsx                    # Root layout with auth provider
│   └── page.tsx                      # Home page with auth redirect
├── store/
│   └── page.tsx                      # Zustand authentication store
├── types/
│   └── user.ts                       # User type definitions
└── README.md                         # This file
```

## Authentication Flow

### 1. User Registration
- User fills out registration form (name, email, password)
- Form submits to `/api/v1/auth/register` endpoint
- On success, user is automatically logged in and redirected to `/todo`
- On error, error message is displayed

### 2. User Login
- User enters email and password
- Form submits to `/api/v1/auth/login` endpoint
- On success, user is redirected to `/todo`
- On error, error message is displayed

### 3. Authentication Persistence
- User authentication state is stored in Zustand store
- Store uses `persist` middleware to save data in localStorage
- On app reload, `fetchCurrentUser()` is called to verify session
- If session is valid, user stays logged in

### 4. Protected Routes
- `/todo` page checks authentication status
- Unauthenticated users are redirected to `/login`
- Authenticated users can access the page and see logout button

### 5. User Logout
- User clicks logout button
- Logout request is sent to `/api/v1/auth/logout` endpoint
- Local state is cleared
- User is redirected to home page

## Zustand Store Structure

### State Interface
```typescript
interface UserState {
  // User data
  user: UserResponse | null
  
  // Authentication status
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: UserResponse) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Authentication functions
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
}
```

### Store Functions

#### `login(email, password)`
- Makes POST request to `/api/v1/auth/login`
- Sets loading state during request
- Updates user state on success
- Returns boolean indicating success/failure
- Handles errors and sets error state

#### `register(email, password, name)`
- Makes POST request to `/api/v1/auth/register`
- Sets loading state during request
- Updates user state on success
- Returns boolean indicating success/failure
- Handles errors and sets error state

#### `logout()`
- Makes POST request to `/api/v1/auth/logout`
- Clears local user state regardless of API response
- Handles errors gracefully

#### `fetchCurrentUser()`
- Makes GET request to `/api/v1/auth/me`
- Used to check if user is already authenticated
- Updates user state if session is valid
- Clears state if session is invalid

### Persistence
- Store uses Zustand's `persist` middleware
- Only user data and authentication status are persisted
- Loading states and errors are not persisted
- Data is stored in localStorage under key `auth-storage`

## API Endpoints

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Request/Response Format
All endpoints expect and return JSON data with proper error handling.

## Usage Examples

### Using the Store in Components
```typescript
import useAuthStore from '@/store/page'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore()
  
  // Check if user is logged in
  if (isAuthenticated) {
    return <div>Welcome, {user?.name}!</div>
  }
  
  // Handle login
  const handleLogin = async () => {
    const success = await login('user@example.com', 'password')
    if (success) {
      // Redirect or update UI
    }
  }
  
  // Handle logout
  const handleLogout = async () => {
    await logout()
    // Redirect to login
  }
}
```

### Protected Route Pattern
```typescript
function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])
  
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return null
  
  return <div>Protected content</div>
}
```

## Environment Variables

Create a `.env.local` file in the client directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Security Features

1. **HTTP-only Cookies**: Authentication tokens are stored in HTTP-only cookies
2. **CSRF Protection**: Backend should implement CSRF protection
3. **Input Validation**: All user inputs are validated on both frontend and backend
4. **Error Handling**: Sensitive error information is not exposed to users

## Error Handling

- Network errors are caught and displayed to users
- API errors show user-friendly messages
- Loading states prevent multiple simultaneous requests
- Error states are cleared on successful operations

## Performance Considerations

- Authentication state is checked only once on app load
- Store uses selective persistence to minimize localStorage usage
- Loading states prevent UI flickering during requests
- Efficient re-renders with Zustand's built-in optimizations

## Future Enhancements

1. **Refresh Token Rotation**: Implement automatic token refresh
2. **Multi-factor Authentication**: Add 2FA support
3. **Social Login**: Integrate with Google, GitHub, etc.
4. **Password Reset**: Add forgot password functionality
5. **Session Management**: Allow users to manage active sessions
6. **Role-based Access**: Implement user roles and permissions

## Troubleshooting

### Common Issues

1. **Authentication not persisting**: Check if localStorage is enabled and not full
2. **Infinite redirects**: Ensure proper authentication state management
3. **API errors**: Verify backend endpoints and CORS configuration
4. **Type errors**: Ensure all types are properly imported and defined

### Debug Mode
Enable debug logging by adding to your environment:
```env
NEXT_PUBLIC_DEBUG=true
```

## Dependencies

- `zustand`: State management
- `axios`: HTTP client
- `next`: React framework
- `react`: UI library
- `typescript`: Type safety

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables
3. Start development server: `npm run dev`
4. Navigate to `http://localhost:3000`

The app will automatically handle authentication flow and redirect users appropriately.
