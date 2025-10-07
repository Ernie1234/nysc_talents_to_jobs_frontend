# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React TypeScript frontend application for the NYSC Talents to Jobs platform, built with Vite, Redux Toolkit, and Tailwind CSS. The application serves multiple user types (Corps Members, SIWES students, Staff, Admin) with role-based authentication and onboarding flows.

## Development Commands

### Core Development Workflow
```bash
# Start development server with hot reload
npm run dev

# Build the application for production
npm run build

# Lint the codebase
npm run lint

# Preview production build locally
npm run preview
```

### Package Management
```bash
# Install dependencies
npm install

# Add a new dependency
npm install <package-name>

# Add a dev dependency
npm install -D <package-name>
```

## Architecture Overview

### Tech Stack
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **State Management**: Redux Toolkit with RTK Query for API calls
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Routing**: React Router DOM with role-based route protection
- **Forms**: React Hook Form with Zod validation
- **Persistence**: Redux Persist with localStorage
- **Authentication**: JWT tokens with automatic expiration handling

### Project Structure
```
src/
├── app/           # Redux store configuration and API client setup
├── assets/        # Static assets (images, etc.)
├── components/    # Reusable UI components (shadcn/ui based)
├── constant/      # Application constants and configuration
├── context/       # React contexts (theme provider, etc.)
├── features/      # Domain-specific features with API slices
├── hooks/         # Custom React hooks
├── layout/        # Layout components (BaseLayout, AppLayout, HomeLayout)
├── lib/           # Utility functions (cn, utils)
├── pages/         # Page components organized by feature
├── routes/        # Routing configuration and route guards
└── types/         # TypeScript type definitions
```

### Key Architecture Patterns

#### State Management
- **Redux Store**: Centralized state with `authSlice` for authentication
- **API Client**: RTK Query with automatic token injection and caching
- **Persistence**: Auth state persisted to localStorage with encryption support
- **Token Management**: Automatic token expiry checking with 5-minute buffer

#### Routing Architecture
- **Three Route Types**:
  - **Public Routes**: Accessible to all users (HomeLayout)
  - **Auth Routes**: For unauthenticated users only (login/register)
  - **Protected Routes**: Require authentication with nested routes
- **Route Guards**: `AuthRoute` and `ProtectedRoute` components handle access control
- **Layout Hierarchy**: Different layouts for public, auth, and protected sections

#### Authentication Flow
- JWT token-based authentication with automatic expiration handling
- Multi-role support: CORPS_MEMBER, SIWES, STAFF, ADMIN
- Onboarding flow with step tracking
- Profile status management: PENDING, ACCEPTED, REJECTED, SUSPENDED

#### Component Organization
- **shadcn/ui**: Base UI component library with Tailwind CSS
- **Feature Components**: Organized by domain (auth, applications, jobs, etc.)
- **Layout Components**: Handle different app sections and navigation
- **Form Handling**: React Hook Form with Zod schema validation

#### API Integration
- **RTK Query**: Centralized API client with tag-based caching
- **Tag Types**: Jobs, documents, billingSubscription, Resumes, Analysis, etc.
- **Authorization**: Automatic Bearer token injection from Redux state
- **Environment**: API base URL from `VITE_API_URL` environment variable

### Key Features & Modules

#### User Management
- **Authentication**: Login/register with email verification
- **User Profiles**: Skills management, resume uploads, social links
- **Onboarding**: Multi-step user setup process
- **Role-based Access**: Different interfaces for different user types

#### Application System
- **Job Applications**: Apply to jobs with resume analysis
- **Document Management**: Resume uploads and PDF generation
- **QR Code Integration**: Session management and scanning functionality

#### Administrative Features
- **Admin Dashboard**: User and application management
- **Statistics**: Application and user analytics
- **Billing**: Subscription management integration

## Environment Configuration

### Required Environment Variables
```bash
VITE_API_URL=          # Backend API base URL
# Optional: Redux persist encryption
VITE_REDUX_PERSIST_SECRET_KEY=  # Encryption key for persisted state
```

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start development server: `npm run dev`

## Important Implementation Details

### Authentication State Management
- Token expiration is checked with 5-minute buffer for clock differences
- Authentication state persists through browser refresh
- Automatic logout on token expiration
- Manual token refresh capability

### Route Protection
- Authenticated users redirected to dashboard from root
- Unauthenticated users can only access public and auth routes
- Role-based navigation and feature access

### API Error Handling
- Centralized error handling through RTK Query
- Automatic token injection for authenticated requests
- Tag-based cache invalidation for data consistency

### Form Validation
- Zod schemas for type-safe form validation
- React Hook Form integration for performance
- Consistent error display patterns

### Styling Approach
- Tailwind CSS with component variants using class-variance-authority
- shadcn/ui components with customizable themes
- Dark/light theme support with next-themes
- Mobile-responsive design patterns