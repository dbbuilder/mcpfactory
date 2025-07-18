# MCPFactory Development Context

## Project Overview
MCPFactory is a universal platform for transforming any code interface into Model Context Protocol (MCP) servers. It supports multiple input formats including OpenAPI, GraphQL, Protocol Buffers, Python modules, JavaScript modules, and SQL databases.

## Current Development Status (As of Latest Session)

### Completed Features

#### Frontend (Vue.js 3 + Vite)
1. **Authentication System**
   - Login/Register forms with validation
   - JWT token management
   - Protected routes with navigation guards
   - Social login UI (GitHub, Google)

2. **Dashboard**
   - Project management interface
   - Real-time stats display
   - Search and filtering capabilities
   - Project cards with status indicators

3. **MCP Import Wizard**
   - Multi-step import flow
   - Support for URL, file upload, GitHub, and paste methods
   - File type detection and validation
   - UTF-8 encoding handling with BOM removal

4. **Code Editor**
   - CodeMirror integration
   - Real-time validation
   - Multi-tab interface (config, generated code, tools, preview)
   - Auto-save functionality

5. **Pricing Page**
   - Three-tier pricing structure
   - Monthly/annual billing toggle
   - Feature comparison table
   - FAQ section

6. **UI/UX Enhancements**
   - Loading states and skeleton screens
   - Empty states with action prompts
   - Page transitions
   - Responsive design throughout

7. **Analytics & Monitoring**
   - Modular analytics plugin supporting Google Analytics, Plausible
   - Error monitoring with Sentry support
   - Performance tracking
   - Custom event tracking

8. **SEO Improvements**
   - Dynamic meta tag management
   - Structured data (JSON-LD)
   - Sitemap generation utility
   - robots.txt configuration
   - Open Graph and Twitter Card support

### Technical Implementation Details

#### State Management (Pinia)
```javascript
// Auth Store
- User authentication state
- Token management
- Login/logout actions
- Error handling

// Projects Store  
- Project CRUD operations
- Filtering and search
- Deployment management
```

#### API Service Layer
```javascript
// Centralized API client
- Axios instance with interceptors
- Token refresh handling
- Error transformation
- Request/response logging
```

#### File Handling Utilities
```javascript
// UTF-8 encoding safety
- BOM removal
- Safe JSON parsing
- File type detection
- OpenAPI validation
```

#### Composables
```javascript
- useLoadingState() - Loading state management
- useAsyncData() - Async data fetching with retry
- useInfiniteScroll() - Infinite scroll handling
- useAnalytics() - Analytics tracking
- useSEO() - SEO meta tag management
```

### Project Structure
```
src/MCPFactory.Web/
├── src/
│   ├── components/
│   │   ├── common/         # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── editor/        # Code editor components
│   │   ├── home/          # Landing page sections
│   │   └── import/        # Import wizard
│   ├── composables/       # Vue composition utilities
│   ├── plugins/           # Vue plugins (analytics, monitoring)
│   ├── router/            # Vue Router configuration
│   ├── services/          # API services
│   ├── stores/            # Pinia stores
│   ├── utils/             # Utility functions
│   └── views/             # Page components
├── public/                # Static assets
└── index.html            # Entry HTML with SEO tags
```

### Deployment Configuration
- **Port**: 16600 (configured in vite.config.js)
- **Vercel**: Deployed and connected to GitHub
- **Environment Variables**: Configured for analytics and monitoring

### Key Technical Decisions

1. **Vue 3 Composition API**: Used throughout for better TypeScript support and reusability
2. **Tailwind CSS v3**: For utility-first styling (v4 had compatibility issues)
3. **CodeMirror 6**: For the code editor with syntax highlighting
4. **Vite**: As the build tool for fast development
5. **Pinia**: For state management (Vue 3 recommended)

### Pending Tasks
1. Create comprehensive test suite
2. Build actual backend API integration
3. Implement real-time features for collaboration
4. Add more import format support
5. Create documentation site

### Development Patterns

#### Component Structure
- Single File Components (SFC) with `<script setup>`
- Composition API for logic
- Scoped styling where needed
- Props validation with TypeScript-like definitions

#### Error Handling
- Global error boundaries
- Form validation with inline errors
- API error transformation
- User-friendly error messages

#### Performance Optimizations
- Lazy loading for routes
- Component code splitting
- Image optimization
- Skeleton screens for loading states

### Known Issues & Solutions

1. **WSL to Windows SQL Server Connection**
   - Use WSL host IP (e.g., 172.31.208.1) instead of localhost
   - Always include `-C` flag for certificate trust
   - Never quote passwords in command line

2. **Tailwind CSS v4 Compatibility**
   - Downgraded to v3 due to PostCSS plugin issues
   - Configuration remains in tailwind.config.js

3. **UTF-8 File Encoding**
   - Always check for and remove BOM
   - Use custom file utilities for safe parsing

### Git Workflow
- Frequent commits with conventional commit messages
- Feature branches for major changes
- Pull requests for code review
- Automated deployment via Vercel

### Future Enhancements
1. WebSocket support for real-time updates
2. Advanced project templates
3. Team collaboration features
4. API rate limiting and usage tracking
5. Custom domain support for deployed MCP servers
6. Plugin system for extensibility

## For Future Claude Instances

When continuing development:
1. Run `npm install` to install dependencies
2. Use `npm run dev` to start the development server on port 16600
3. Check `.env.example` for required environment variables
4. Follow the established patterns for components and state management
5. Ensure all new features include loading states and error handling
6. Add SEO metadata for new pages using the `useSEO` composable
7. Track significant user actions with analytics
8. Validate all file inputs for encoding issues

The project is ready for backend integration. The frontend provides a complete UI for the MCP transformation workflow with proper state management, error handling, and user experience considerations.