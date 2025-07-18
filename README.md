# MCPFactory

A universal platform that transforms ANY code interface into a fully compliant, certified MCP (Model Context Protocol) server. Whether you have a REST API, GraphQL endpoint, Python library, JavaScript module, or any other code interface, MCPFactory converts it into an MCP server that AI assistants can use.

## Features

- **Universal Code Import**: Support for REST APIs, GraphQL, Python libraries, JavaScript modules, databases, and more
- **AI-Powered Generation**: Intelligent analysis and optimal MCP tool mapping
- **Automated Testing & Certification**: Comprehensive compliance testing with Bronze, Silver, Gold, and Platinum certification levels
- **Flexible Deployment**: Host on MCPFactory cloud or download for self-hosting
- **Enterprise Ready**: SOC2, HIPAA compliant options with VPC peering and dedicated support
- **Marketplace**: Discover and monetize MCP servers

## Quick Start

1. **Import** - Upload code, API specs, or provide repository URL
2. **Configure** - Map functions to MCP tools with AI assistance  
3. **Test** - Validate MCP compliance and functionality
4. **Deploy** - Host with us or download for self-hosting

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Web Portal    │     │   API Gateway   │     │ Desktop Client  │
│    (Vue.js)     │────▶│  (.NET Core)    │◀────│  (Electron)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
            ┌───────▼────────┐   ┌───────▼────────┐
            │ Code Analyzer  │   │ MCP Generator  │
            │    Engine      │   │    Service     │
            └────────────────┘   └────────────────┘
                    │                     │
            ┌───────▼────────┐   ┌───────▼────────┐
            │ Test Framework │   │ Deploy Service │
            │   & Certify    │   │   & Hosting    │
            └────────────────┘   └────────────────┘
```

## Technology Stack

- **Backend**: .NET Core 8.0, Entity Framework Core, Azure Services
- **Frontend**: Vue.js 3, Tailwind CSS, Tailwind UI, TypeScript
- **Infrastructure**: Azure App Services, Azure SQL, Azure Storage, Docker, Kubernetes
- **Desktop Client**: Electron, Vue.js, Node.js
- **CI/CD**: Azure DevOps, GitHub Actions

## Development Setup

### Prerequisites

- .NET 8.0 SDK
- Node.js 18+
- Docker Desktop
- Azure CLI
- Visual Studio 2022 or VS Code

### Backend Setup

```bash
cd src
dotnet new sln -n MCPFactory
dotnet new webapi -n MCPFactory.API
dotnet new classlib -n MCPFactory.Core
dotnet new classlib -n MCPFactory.Infrastructure
dotnet new classlib -n MCPFactory.Services
dotnet sln add **/*.csproj
```

### Frontend Setup

```bash
cd src/MCPFactory.Web
npm create vue@latest .
npm install
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/typography
npm install @headlessui/vue @heroicons/vue axios pinia vue-router
```

## Project Structure

```
mcpfactory/
├── docs/                    # Documentation
│   ├── api/                # API documentation
│   ├── architecture/       # Architecture decisions
│   └── guides/            # User guides
├── src/                    # Source code
│   ├── MCPFactory.API/    # REST API
│   ├── MCPFactory.Core/   # Domain models and interfaces
│   ├── MCPFactory.Infrastructure/  # Data access and external services
│   ├── MCPFactory.Services/        # Business logic
│   └── MCPFactory.Web/            # Vue.js frontend
├── tests/                  # Test projects
├── deploy/                # Deployment scripts and templates
└── tools/                 # Development tools and scripts
```

## Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

## License

MCPFactory is proprietary software. See [LICENSE](LICENSE) for details.

## Support

- Documentation: [docs.mcpfactory.net](https://docs.mcpfactory.net)
- API Reference: [api.mcpfactory.net/swagger](https://api.mcpfactory.net/swagger)
- Support: [support@mcpfactory.net](mailto:support@mcpfactory.net)
