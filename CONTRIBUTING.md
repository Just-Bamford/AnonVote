# Contributing to AnonVote

AnonVote is a privacy-preserving anonymous voting platform built on the Stellar blockchain. It enables secure, verifiable, and private voting with cryptographic guarantees, using AES-256-GCM encryption for vote privacy and Stellar for immutable anchoring.

## Prerequisites

- **Node.js 20+** and npm/yarn
- **Docker** and Docker Compose (for PostgreSQL)
- **Stellar testnet account** (for blockchain operations)
- **Git** for version control

## Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/anonvote.git
   cd anonvote
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies (if any)
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   cd ..
   ```

3. **Configure environment**

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env with your configuration
   # Set DATABASE_URL, STELLAR_SECRET_KEY, JWT_SECRET, etc.
   ```

4. **Start PostgreSQL with Docker**

   ```bash
   docker-compose up -d postgres
   ```

5. **Run database migrations**

   ```bash
   cd backend
   npx prisma migrate dev
   cd ..
   ```

6. **Start development servers**

   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Prisma Studio: `npx prisma studio` (in backend directory)

## Project Structure

```
anonvote/
├── backend/              # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic
│   │   ├── middleware/  # Auth, rate limiting, error handling
│   │   ├── prisma/      # Database client
│   │   └── utils/       # Crypto, errors, helpers
│   └── prisma/          # Database schema and migrations
├── frontend/            # React 18 + Vite application
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── hooks/       # Custom React hooks
│       ├── utils/       # Frontend utilities
│       └── styles/      # CSS and theme files
└── contracts/           # Stellar Soroban smart contracts
```

## Finding and Claiming Issues

We use GitHub Issues with the **Wave Program** labels to indicate difficulty:

- **Trivial**: Documentation, minor UI fixes, simple refactors
- **Medium**: Feature implementation, bug fixes, API changes
- **High**: Core cryptography, blockchain integration, security fixes

1. Browse open issues in the repository
2. Comment on an issue to express interest
3. Wait for maintainer assignment before starting work
4. For new features, discuss the approach in the issue first

## Branch Naming Convention

Use descriptive branch names with issue numbers:

```
feature/123-add-ranked-choice-voting
fix/456-resolve-token-validation-bug
docs/789-update-api-documentation
```

## Pull Request Guidelines

1. **Create a PR** from your feature branch to `main`
2. **Title** should be clear and concise (e.g., "Add ranked-choice voting support")
3. **Description** should include:
   - What changes were made
   - Link to related issue (#123)
   - Testing performed
   - Screenshots for UI changes
4. **Ensure**:
   - Code follows existing style and patterns
   - All tests pass (`npm test` in both frontend and backend)
   - No new linting errors
   - Database migrations are included if needed
5. **Request review** from maintainers

## Privacy and Security Considerations

⚠️ **Critical**: AnonVote handles sensitive voting data. Contributors must:

- **Never** log or expose vote data, voter tokens, or private keys
- **Always** use encryption for sensitive operations
- **Follow** existing cryptographic patterns (AES-256-GCM for votes)
- **Validate** all security-related changes with maintainers
- **Test** privacy features thoroughly before submission

## Getting Help

- Check existing documentation in `/docs` (if available)
- Join our community chat/discussions
- Ask questions in issue comments
- Review existing code for patterns

Thank you for contributing to privacy-preserving voting technology! 🗳️🔒
