# Binge-Buddy

BingeBuddy Technical Workflow

## Development Environment
1. **Node.js Setup**
   - Requires Node.js v18+
   - Verify installation: `node --version`

2. **Dependency Management**
   - Core dependencies:
     - React 18
     - TypeScript 5
     - Vite 5
     - Tailwind CSS 3

3. **API Configuration**
   - TMDB API requirements:
     - Register at TMDB Developers
     - Rate limiting: 40 requests/10 seconds
     - Base URL: `VITE_TMDB_BASE_URL=https://api.themoviedb.org/3`

## Architecture Guide

### Component Structure
```tsx
// Example component composition
<App>
  <ThemeProvider>
    <MovieContextProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
          </Routes>
        </Layout>
      </Router>
    </MovieContextProvider>
  </ThemeProvider>
</App>

### Service Layer
- tmdbService.ts handles:
  - Movie search API ( /search/movie )
  - Details endpoint ( /movie/{id} )
  - Pagination support
  - Error handling with Axios interceptors
### State Management
- MovieContext.tsx provides:
  - Global movie data store
  - Watchlist functionality
  - Search filters persistence
- ThemeContext.tsx manages:
  - Dark/light mode toggling
  - UI theme consistency
## CI/CD Pipeline
1. Pre-commit Hooks:
   - npm run lint : ESLint with TypeScript rules
   - npm run type-check : TS validation
2. GitHub Actions:
   - Build test: npm run build
   - Lighthouse audit
   - Vercel deployment
## Performance Optimization
- Code splitting for route components
- Image lazy loading with loading="lazy"
- Vite PWA configuration for offline support
- Tree-shaking for Tailwind CSS
## Testing Strategy
1. Unit Tests:
   - Jest + Testing Library
   - Component snapshot tests
   - Context provider tests
2. E2E Tests:
   - Cypress navigation tests
   - API mock testing
