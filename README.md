# Adventure Book Frontend

[![Tests](https://github.com/Luckzman/adventure-book-frontend/actions/workflows/test.yml/badge.svg)](https://github.com/Luckzman/adventure-book-frontend/actions/workflows/test.yml)
[![Build](https://github.com/Luckzman/adventure-book-frontend/actions/workflows/build.yml/badge.svg)](https://github.com/Luckzman/adventure-book-frontend/actions/workflows/build.yml)
[![Coverage](https://raw.githubusercontent.com/Luckzman/adventure-book-frontend/blob/dev/coverage/coverage-badge.svg)](./coverage)

An interactive adventure book web application built with React, TypeScript, and Tailwind CSS.

## Features

- 📚 Interactive adventure books with multiple story paths
- 🎮 Health system with consequences
- ⏸️ Pause/Resume functionality
- 🔍 Search and filter adventures
- 💾 Save progress (coming soon)
- ♿ Accessible UI with ARIA attributes
- 🎨 Modern, responsive design

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zod** - Runtime validation
- **Vitest** - Testing

## Getting Started

### Prerequisites

**Frontend:**
- Node.js 18+ 
- npm or yarn

**Backend:**
- JDK 21 ([Download](https://adoptium.net/en-GB/temurin/releases))
- Maven 3.9.x ([Download](https://maven.apache.org/download.cgi))

### Clone the Repository

```bash
git clone https://github.com/Luckzman/adventure-book-frontend.git
cd adventure-book-frontend
```

### Backend Setup

The backend API is built with Java version 21, Spring 3.5 and Maven version 3.9.x.

1. Navigate to the backend directory:
```bash
cd ../backend-api  # Adjust path based on your repository structure
```

2. Start the backend API:
```bash
mvn spring-boot:run
```

3. Verify the backend is running:
   - API Base URL: `http://localhost:8080`
   - API Documentation: `http://localhost:8080/service/swagger-ui/index.html`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

**Note:** Ensure the backend API is running on `http://localhost:8080` before starting the frontend, as the frontend depends on the backend API for data.

### Building for Production

```bash
npm run build
```

The production build will be generated in the `dist/` directory.

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests once
npm run test:run
```

## Project Structure

```
adventure-book-frontend/
├── .github/
│   └── workflows/
│       └── test.yml          # CI/CD test workflow
├── scripts/
│   └── generate-coverage-badge.js  # Coverage badge generator
├── src/
│   ├── components/           # React components
│   │   ├── common/          # Shared/reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── FilterButton.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   └── __tests__/   # Component tests
│   │   │       └── ConfirmDialog.test.tsx
│   │   ├── game/            # Game-specific components
│   │   │   ├── ChoicesList.tsx
│   │   │   ├── ConsequenceFeedback.tsx
│   │   │   ├── DeadEndScreen.tsx
│   │   │   ├── GameContent.tsx          # Main game content
│   │   │   ├── GameErrorBanner.tsx       # Dismissible error banner
│   │   │   ├── GameErrorDisplay.tsx      # Error state display
│   │   │   ├── GameHeader.tsx
│   │   │   ├── GameLayout.tsx            # Layout wrapper
│   │   │   ├── GameOverScreen.tsx
│   │   │   ├── GamePageSkeleton.tsx      # Loading skeleton
│   │   │   ├── PauseOverlay.tsx
│   │   │   ├── SectionView.tsx
│   │   │   ├── mockGameData.ts           # Mock data for development
│   │   │   └── __tests__/                # Component tests
│   │   │       └── ChoicesList.test.tsx
│   │   └── home/            # Homepage components
│   │       ├── AdventureCard.tsx
│   │       ├── AdventureCardList.tsx
│   │       ├── AdventureCardListSkeleton.tsx
│   │       ├── AdventureCardSkeleton.tsx
│   │       ├── AdventureLibrary.tsx
│   │       ├── Header.tsx
│   │       └── mockAdventures.ts         # Mock data for development
│   ├── domain/              # Business logic (Domain-Driven Design)
│   │   └── game/
│   │       ├── gameConstants.ts  # Game constants (health, thresholds)
│   │       ├── gameReducer.ts    # Game state management
│   │       ├── gameSelectors.ts  # Derived state selectors
│   │       ├── gameTypes.ts      # Type definitions
│   │       └── __tests__/        # Domain logic tests
│   │           ├── gameReducer.test.ts
│   │           └── gameSelectors.test.ts
│   ├── services/            # API services & data layer
│   │   ├── booksApi.ts      # API client
│   │   ├── validationSchemas.ts  # Zod validation schemas
│   │   └── __tests__/       # Service tests
│   │       ├── booksApi.test.ts
│   │       └── validationSchemas.test.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useBooks.ts      # Books context hook
│   │   ├── useGameActions.ts    # Game action handlers
│   │   └── useGameData.ts       # Game data loading
│   ├── contexts/            # React Context providers
│   │   ├── BooksProvider.tsx
│   │   └── booksContext.ts
│   ├── pages/               # Page-level components
│   │   ├── HomePage.tsx
│   │   └── GamePage.tsx     # Main game page (orchestrator)
│   ├── utils/               # Utility functions
│   │   ├── errorMessages.ts # Error formatting
│   │   ├── logger.ts        # Centralized logging
│   │   └── notifications.ts # Notification utilities
│   ├── config/              # Configuration
│   │   └── env.ts          # Environment variables
│   ├── test/                # Test configuration
│   │   ├── setup.ts         # Vitest setup
│   │   └── vitest.d.ts      # Type definitions for tests
│   ├── App.tsx              # Root component
│   └── main.tsx             # Application entry point
├── vitest.config.ts         # Vitest configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
├── tsconfig.app.json        # App-specific TS config
└── package.json             # Dependencies and scripts
```

## Project Architecture

### Design Patterns

This project follows several architectural patterns and best practices:

#### 1. **Domain-Driven Design (DDD)**
- **Separation of Concerns**: Business logic is separated from UI components
- **Domain Layer**: Game logic lives in `src/domain/game/`
  - `gameReducer.ts`: Pure functions for state transitions
  - `gameSelectors.ts`: Derived state calculations
  - `gameTypes.ts`: Type definitions for domain entities
  - `gameConstants.ts`: Domain constants (health thresholds, etc.)

**Benefits:**
- Game rules are not tied to rendering
- Easy to test business logic in isolation
- UI components are "dumb" and dispatch intent-driven actions

#### 2. **State Management Pattern**
- **useReducer**: Complex game state managed via reducer pattern
- **Context API**: Global state (books list) via React Context
- **Selectors**: Derived state calculated from base state (no redundant storage)

**Example:**
```typescript
// Bad: Storing derived state
const [healthPercentage, setHealthPercentage] = useState(100);

// Good: Deriving state
const healthPercentage = selectHealthPercentage(state);
```

#### 3. **Component Architecture**
- **Smart Components**: Pages (`GamePage`, `HomePage`) handle orchestration
- **Dumb Components**: Presentational components (`GameHeader`, `ChoicesList`)
- **Component Composition**: Complex UIs built from smaller, focused components
  - `GameLayout`: Reusable layout wrapper eliminating duplication
  - `GameContent`: Main game content display
  - `GameErrorDisplay` & `GameErrorBanner`: Specialized error components
- **Custom Hooks Pattern**: Business logic extracted into reusable hooks
  - `useGameData`: Handles data loading, validation, and error handling
  - `useGameActions`: Centralizes all game action handlers
  - `useBooks`: Provides books context access

#### 4. **Service Layer Pattern**
- **API Abstraction**: `services/booksApi.ts` encapsulates all API calls
- **Data Transformation**: API responses normalized to internal data structures
- **Error Handling**: Centralized error formatting and user-friendly messages

#### 5. **Validation Strategy**
- **Runtime Validation**: Zod schemas validate API responses at runtime
- **Type Safety**: TypeScript for compile-time safety
- **Defensive Programming**: Graceful handling of invalid data

#### 6. **Error Handling**
- **Error Boundaries**: React Error Boundaries catch UI errors
- **User-Friendly Messages**: Technical errors transformed to user-friendly messages
- **Graceful Degradation**: App continues to function even with API errors

### Data Flow

```
┌─────────────┐
│   Backend   │
│     API     │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│   Service   │─────▶│  Validation  │
│    Layer    │      │   (Zod)      │
└──────┬──────┘      └──────────────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│   Context   │─────▶│   Domain     │
│  Provider   │      │    Layer     │
└──────┬──────┘      └──────┬───────┘
       │                    │
       ▼                    ▼
┌─────────────┐      ┌──────────────┐
│Custom Hooks │─────▶│   Pages      │
│(useGameData)│      │(Orchestrator)│
│(useGameAct.)│      └──────┬───────┘
└─────────────┘             │
                            ▼
                   ┌─────────────────┐
                   │   Components    │
                   │  (Composition)  │
                   │  - GameLayout   │
                   │  - GameContent  │
                   │  - GameHeader   │
                   └─────────────────┘
```

### Key Architectural Decisions

1. **No Redux**: Context API + useReducer sufficient for state needs
2. **Custom Hooks for Logic Extraction**: Business logic separated from components via hooks
   - `useGameData`: Encapsulates data fetching and error handling
   - `useGameActions`: Centralizes all user interactions and navigation
3. **Zod Validation**: Runtime type safety for API responses
4. **Selectors Pattern**: Derived state calculated, not stored
5. **Intent-Driven Actions**: UI dispatches "what" not "how"
6. **Component Composition**: Large components broken into smaller, focused pieces
   - GamePage (448 → 136 lines) through composition
   - Reusable layout and content components
7. **Error Boundaries**: Graceful error handling at component boundaries
8. **AbortController**: Request cancellation for cleanup in hooks
9. **React Compiler**: Automatic optimization via Babel plugin
10. **Single Responsibility**: Each component/hook has one clear purpose

### Testing Strategy

- **Unit Tests**: Domain logic (reducers, selectors)
- **Integration Tests**: API services with validation
- **Component Tests**: Critical UI components
- **Coverage Focus**: Business logic prioritized over UI components

## Testing

Tests are written using Vitest and React Testing Library. Coverage reports are generated in the `coverage/` directory.

### Test Coverage

**Current Coverage:**
- **Domain Logic (gameReducer, gameSelectors)**: ~99% ✅
- **Validation Schemas**: 100% ✅
- **Components**: ~19% (core business logic components tested)
- **Overall**: 19% (focusing on critical business logic)

Run `npm run test:coverage` to generate coverage reports.

To view coverage in the browser:
```bash
npm run test:coverage
# Then open coverage/index.html
```

To generate coverage badge:
```bash
npm run test:badge
```

### Test Structure

```
src/
├── domain/game/__tests__/     # Game reducer and selector tests
├── services/__tests__/         # API validation tests
└── components/__tests__/      # Component tests
```

## API Documentation

Once the backend API is running, you can access the interactive API documentation at:

```
http://localhost:8080/service/swagger-ui/index.html
```

This provides:
- Complete API endpoint documentation
- Interactive API testing interface
- Request/response schemas
- Authentication details (if applicable)

## Development Workflow

1. **Start Backend**: Run `mvn spring-boot:run` in the backend directory
2. **Start Frontend**: Run `npm run dev` in the frontend directory
3. **Verify Connection**: Check browser console for API connection
4. **Access App**: Navigate to `http://localhost:5173`

## Troubleshooting

### Frontend can't connect to backend
- Ensure backend is running on `http://localhost:8080`
- Check `vite.config.ts` proxy configuration
- Verify CORS settings in backend

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Clear `node_modules` and reinstall if issues persist
- Check Node.js version matches requirement (18+)

### Test failures
- Run `npm run test:run` to see detailed error messages
- Ensure backend is running for integration tests
- Check test environment setup in `vitest.config.ts`

## License

Private project
