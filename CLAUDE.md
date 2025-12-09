# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ADLEX is a React-based license application management system built with Vite, TypeScript, and Tailwind CSS. The application provides a multi-step wizard interface for creating and managing business license applications with integrated AI assistance powered by CopilotKit.

**Tech Stack:**
- React 19.1 + TypeScript 5.9
- Vite 7.1 for build tooling
- Tailwind CSS v4.1 for styling
- Untitled UI React component library
- React Router v7 for routing
- TanStack Query for server state management
- Zustand for client state management
- CopilotKit for AI-powered chat assistance
- React Aria Components for accessible UI primitives

## Development Commands

```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Type check
tsc -b

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### State Management Strategy

The application uses a **hybrid state management approach**:

1. **Zustand** (`src/stores/`) - Client-side state that needs persistence
   - Auth store ([src/stores/auth.ts](src/stores/auth.ts)) manages user authentication, access/refresh tokens
   - Persisted to localStorage via `zustand/middleware` persist

2. **TanStack Query** (`src/queries/`) - Server state and API data fetching
   - Each domain has its own query file (auth, license-application, activities, company)
   - Automatic refetching, caching, and error handling
   - Query client configured in [src/queries/client.ts](src/queries/client.ts)

3. **React State** - Component-local UI state
   - Form data in multi-step wizards
   - UI interactions and temporary state

### Authentication Flow

Authentication uses JWT tokens with automatic refresh:

1. **Initial auth** ([src/providers/auth-provider.tsx](src/providers/auth-provider.tsx)):
   - On app load, checks for stored tokens in Zustand auth store
   - Validates access token by fetching current user
   - Falls back to refresh token if access token expired
   - Clears auth if both tokens invalid

2. **Auto-refresh**:
   - React Query interval (every 5 minutes) refreshes tokens in background
   - Updates Zustand store with new tokens
   - Clears auth on refresh failure

3. **API requests**:
   - All API calls include `Authorization: Bearer ${accessToken}` header
   - Access token retrieved from Zustand store via `useAuthStore.getState()`

4. **Protected routes**:
   - `<ProtectedRoute>` component ([src/components/protected-route.tsx](src/components/protected-route.tsx)) wraps authenticated pages
   - Redirects to `/auth` if not authenticated

### Multi-Step Form Architecture

The license application wizard ([src/pages/create-license-application/index.tsx](src/pages/create-license-application/index.tsx)) implements a complex multi-step form:

**Step progression:**
1. Contact Email
2. Business Activities (1-3 selections)
3. Company Names (3 required alternatives)
4. Visa Packages
5. Shareholders Info (number + total shares)
6. Shareholder Details (for each shareholder)
7. Passport Review (OCR extraction + confirmation)
8. Payment
9. KYC

**Key patterns:**

- **Auto-save**: Each step saves to backend API via mutation before advancing
- **Resume capability**: `determineCurrentStep()` function analyzes existing data to resume from correct step
- **Backend sync**: Form state syncs with `LicenseApplicationResponse` from API
- **File uploads**: Passport documents uploaded separately after shareholder details saved
- **OCR integration**: Backend extracts passport data, frontend displays for user confirmation

**CopilotKit Integration:**

- Form state exposed to AI via `useCopilotFormState()` custom hook
- AI chat sidebar provides contextual assistance during form completion
- Custom actions (e.g., `show_step_transition`) render UI components in chat
- Agent state shared between user and AI for collaborative form filling

### API Integration

**Base URL:** `https://agent.adlex.azamat.ai`

All API functions follow consistent patterns in `src/queries/`:

- **Query hooks** for GET requests: `useGetLicenseApplication()`, `useLicenseApplications()`
- **Mutation functions** for POST/PATCH/DELETE: `updateLicenseApplication()`, `uploadPassport()`
- TypeScript types generated from OpenAPI schema
- Authorization header automatically included from Zustand auth store

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── base/           # Basic UI elements (buttons, inputs, badges, etc.)
│   ├── application/    # Complex application components (tables, modals, navigation)
│   └── foundations/    # Design system primitives (icons, logos)
├── pages/              # Top-level route components
│   ├── home-screen/
│   ├── create-license-application/
│   │   └── components/  # Page-specific components
│   │       └── steps/   # Form step components
│   ├── sign-in/
│   └── profile/
├── providers/          # React context providers
│   ├── auth-provider.tsx    # Authentication with auto-refresh
│   ├── theme-provider.tsx   # Theme management
│   └── router-provider.tsx  # Router context
├── queries/            # TanStack Query hooks and API functions
│   ├── client.ts       # Query client + BASE_URL config
│   ├── auth.ts
│   ├── license-application.ts
│   ├── activities.ts
│   └── company.ts
├── stores/             # Zustand state stores
│   └── auth.ts         # Persisted auth state
├── hooks/              # Custom React hooks
│   ├── use-copilot-form-state.ts  # Sync form state with CopilotKit
│   └── use-steps-info.ts          # Form step metadata
├── utils/              # Utility functions
└── styles/             # Global styles
    └── globals.css
```

## Important Conventions

### Path Aliases

The project uses `@/` alias for imports from `src/`:

```typescript
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/base/buttons/button';
```

### Component Patterns

**Untitled UI Components:**
- Follow Untitled UI design system conventions
- Built on React Aria Components for accessibility
- Accept standard props + custom style props
- Component documentation: https://www.untitledui.com/react/docs

**Form Components:**
- Multi-step forms use controlled components with local state
- Form handlers passed via `FormHandlers` interface
- Validation logic in `canGoNext()` function per step

### TypeScript Types

- API types defined alongside query functions (e.g., `LicenseApplicationResponse`)
- Separate input/output types for API operations (e.g., `ShareholderInput` vs `ShareholderResponse`)
- Form types in page-specific `types.ts` files

### Styling

- **Tailwind CSS v4** with Untitled UI preset
- Custom plugin: `tailwindcss-react-aria-components` for styling React Aria states
- Animation via `tailwindcss-animate` and Motion (successor to Framer Motion)
- Utility function `cx()` ([src/utils/cx.ts](src/utils/cx.ts)) for conditional class names

### CopilotKit Integration

When working with AI features:

- Agent configured with public API key in [src/main.tsx](src/main.tsx)
- Custom actions defined with `useCopilotAction()` hook
- Shared state via `useCopilotFormState()` custom hook
- Chat UI rendered in `<AIChat>` component with headless hooks

## Key Files Reference

- [src/main.tsx](src/main.tsx) - App entry point with provider hierarchy
- [src/providers/auth-provider.tsx](src/providers/auth-provider.tsx) - Authentication logic
- [src/stores/auth.ts](src/stores/auth.ts) - Auth state with localStorage persistence
- [src/queries/license-application.ts](src/queries/license-application.ts) - License application API integration
- [src/pages/create-license-application/index.tsx](src/pages/create-license-application/index.tsx) - Main form wizard implementation
- [vite.config.ts](vite.config.ts) - Vite configuration with path aliases
