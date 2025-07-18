# MCPFactory Web Frontend

The Vue.js frontend for MCPFactory - a universal platform that transforms any code interface into MCP servers for AI assistants.

## 🚀 Live Site

- Production: https://mcpfactory-web.vercel.app
- GitHub: https://github.com/dbbuilder/mcpfactory

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management (ready to implement)

## 📦 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

The site is automatically deployed to Vercel on every push to the master branch.

## 📁 Project Structure

```
src/
├── assets/          # Static assets and global CSS
├── components/      # Reusable Vue components
│   └── home/       # Homepage specific components
├── views/          # Page components
├── router/         # Vue Router configuration
├── stores/         # Pinia stores (for state management)
├── services/       # API services (ready for backend integration)
├── composables/    # Vue composition API utilities
└── utils/          # Helper functions
```

## 🎨 Features

- Responsive design with mobile-first approach
- Modular component architecture
- SaaS landing page best practices
- SEO optimized with meta tags
- Fast performance with Vite
- Automatic deployments via Vercel