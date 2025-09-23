# Future Modules

This directory will contain feature modules as the application grows:

- `auth/` - JWT authentication and OAuth integration
- `tokens/` - Internal token economy management  
- `votes/` - Song voting system
- `auctions/` - Song auction mechanics
- `draws/` - Raffle and prize system
- `realtime/` - Advanced Socket.IO room management
- `billing/` - Stripe payment integration
- `tenancy/` - Multi-venue support

Each module should follow the pattern:
```
module-name/
├── controllers/
├── services/
├── routes/
├── schemas/
├── types/
└── index.ts
```