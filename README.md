# BePARTy Server

Backend API for **BePARTy** - A platform for nightclubs and DJs where users earn digital tokens and spend them to vote for songs, creating an interactive nightlife experience.

## 🎯 Product Context

BePARTy is a SaaS platform that transforms nightclub experiences by:

- **Token Economy**: Users earn digital tokens by buying tickets, drinks, or directly in-app
- **Song Voting**: Spend tokens to vote for songs and influence DJ playlists
- **Real-time Dashboard**: DJs get live audience preference data
- **Enhanced Engagement**: Features like song auctions, golden hours, and raffles
- **Business Model**: SaaS for clubs and DJs

## 🛠 Tech Stack

- **Runtime**: Node.js 20 LTS
- **Framework**: Express 5 with TypeScript
- **Database**: PostgreSQL 16 with Prisma ORM
- **Real-time**: Socket.IO
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Zod
- **Documentation**: OpenAPI/Swagger
- **Logging**: Pino
- **Testing**: Jest + Supertest
- **Containerization**: Docker & Docker Compose

## 🚀 Quick Start

### Prerequisites

- Node.js 20 LTS
- Docker & Docker Compose
- npm (comes with Node.js)

### Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd beparty-server
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env.development
   ```

3. **Start the infrastructure**:
   ```bash
   npm run docker:up
   ```

4. **Database setup**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init_mvp
   npm run prisma:seed
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

### Verification

- **API Health**: http://localhost:3000/api/health
- **API Documentation**: http://localhost:3000/api/docs
- **Socket.IO**: http://localhost:3000/realtime

## 📊 Database & Migrations — MVP

### Schema Overview

The MVP includes a minimal but complete token-based voting system:

- **Users**: DJ and USER roles with token balances
- **Sessions**: DJ-created rooms for voting
- **SessionSongs**: Song aggregates with Spotify integration
- **Votes**: Individual token spending records
- **TokenTransactions**: Complete token ledger for audit

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init_mvp

# Seed with sample data
npm run prisma:seed

# Reset database (development only)
npx prisma migrate reset --force
```

### Verification Query

Check the session scoreboard with:

```sql
SELECT ss.spotify_track_id, ss.track_name, ss.artist_name, ss.total_tokens
FROM "session_songs" ss
WHERE ss.session_id = 1  -- Session ID is now INTEGER
ORDER BY ss.total_tokens DESC;
```

Example with seeded data:

```sql
SELECT ss.spotify_track_id, ss.track_name, ss.artist_name, ss.total_tokens
FROM "session_songs" ss
WHERE ss.session_id = 1  -- Use integer session ID
ORDER BY ss.total_tokens DESC;
```

### Token Integrity

The system maintains token balance integrity:

```sql
-- Verify user token balance matches transaction ledger
SELECT 
  u.display_name,
  u.tokens_balance as current_balance,
  COALESCE(SUM(CASE WHEN tt.direction = 'EARN' THEN tt.amount ELSE 0 END), 0) -
  COALESCE(SUM(CASE WHEN tt.direction = 'SPEND' THEN tt.amount ELSE 0 END), 0) as ledger_balance
FROM "users" u
LEFT JOIN "token_transactions" tt ON u.id = tt.user_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.display_name, u.tokens_balance;
```

## 📋 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Database
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with test data

### Docker
- `npm run docker:up` - Start all services
- `npm run docker:down` - Stop all services  
- `npm run docker:logs` - View logs

## 🐳 Docker Services

The `docker-compose.yml` includes:

- **api**: BePARTy server (port 3000)
- **db**: PostgreSQL 16 (port 5432)  
- **pgadmin**: Database management UI (port 8080) - optional

### Docker Commands

```bash
# Start all services
docker compose up -d

# Start with PgAdmin
docker compose --profile tools up -d

# View logs
docker compose logs -f api

# Stop services
docker compose down
```

## 📁 Project Structure

```
src/
├── config/          # Configuration (env, logger)
├── loaders/         # App initialization (express, prisma, socket)
├── api/
│   ├── routes/      # Route definitions
│   ├── controllers/ # Request handlers
│   ├── middlewares/ # Custom middleware
│   ├── schemas/     # Validation schemas
│   └── docs/        # OpenAPI documentation
├── modules/         # Future feature modules
├── app.ts           # App setup and configuration
└── server.ts        # Server entry point

prisma/
├── schema.prisma    # Database schema
└── seed.ts          # Database seeding

tests/
├── setup.ts         # Test configuration
└── *.test.ts        # Test files
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Test the API endpoints:
```bash
# Health check
curl http://localhost:3000/api/health

# Socket.IO (using wscat or similar)
wscat -c "http://localhost:3000/realtime"
```

## 📚 API Documentation

Interactive API documentation is available at `/api/docs` when the server is running.

For quick examples and curl commands, see [API_EXAMPLES.md](./API_EXAMPLES.md).

### MVP Endpoints
- `GET /api/health` - Health check with server status
- `POST /api/auth/login` - User authentication
- `GET /api/users/me` - Get current user profile
- `GET /api/sessions` - Get all live sessions
- `GET /api/sessions/songs?session_id=1` - Get session scoreboard
- `POST /api/votes` - Vote for a song with tokens

### Example Vote Request
```json
{
  "session_id": 1,
  "song_id": "cmgsjtw75000exq087icrby56",
  "token_amount": 25
}
```

## 🔧 Development Guidelines

### Code Style
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier integration
- **Imports**: Organized with import/order plugin

### Commit Convention
Use Conventional Commits format:
- `feat/`: New features
- `fix/`: Bug fixes  
- `chore/`: Maintenance tasks
- `docs/`: Documentation updates

### Branch Naming
- `feat/feature-name`
- `fix/bug-description`
- `chore/task-description`

## 🔮 Future Evolution

### Planned Modules
- **Authentication**: JWT + OAuth integration
- **Token Economy**: Internal token management
- **Voting System**: Song voting mechanics
- **Auctions**: Bidding system for songs
- **Draws/Raffles**: Prize distribution system
- **Real-time**: Advanced room management
- **Billing**: Stripe integration
- **Multi-tenancy**: Support for multiple venues

### Architecture Considerations
- **Multi-tenancy**: `tenant_id` in relevant tables
- **RBAC**: Role-based access (owner, dj, staff, user)
- **Observability**: Enhanced logging and monitoring
- **CI/CD**: Automated testing and deployment

## 🚨 Troubleshooting

### Common Issues

**Port conflicts**:
```bash
# Check what's using port 3000
netstat -tulpn | grep 3000
# Kill the process or change PORT in .env
```

**Database connection**:
```bash
# Check if PostgreSQL is running
docker compose ps
# View database logs
docker compose logs db
```

**Permission issues (Linux/Mac)**:
```bash
# Fix Docker permissions
sudo chown -R $USER:$USER .
```

**Prisma issues**:
```bash
# Reset database
npm run prisma:migrate -- --name reset
npm run prisma:seed
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

---

Built with ❤️ for the nightlife community
