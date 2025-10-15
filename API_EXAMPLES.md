# BePARTy API Examples

Quick reference guide for using the BePARTy API endpoints.

## 🔐 Authentication

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dj@beparty.local",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cm1234567890",
      "email": "dj@beparty.local",
      "display_name": "DJ Master",
      "role": "DJ",
      "tokens_balance": "100"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## 👤 User Profile

### Get My Profile
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎵 Sessions

### Get All Live Sessions
```bash
curl -X GET http://localhost:3000/api/sessions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Session Scoreboard
```bash
curl -X GET "http://localhost:3000/api/sessions/songs?session_id=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": {
      "id": 1,
      "name": "Friday Night Party 🎉",
      "dj": {
        "id": "cm1234567890",
        "display_name": "DJ Master"
      }
    },
    "songs": [
      {
        "id": "cmgsjtw75000exq087icrby56",
        "spotify_track_id": "4iV5W9uYEdYUVa79Axb7Rh",
        "track_name": "Cruel Summer",
        "artist_name": "Taylor Swift",
        "total_tokens": "35"
      }
    ]
  }
}
```

## 🗳️ Voting

### Vote for a Song
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": 1,
    "song_id": "cmgsjtw75000exq087icrby56",
    "token_amount": 25
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Vote cast successfully",
  "data": {
    "vote": {
      "id": "vote_id_here",
      "tokens_spent": "25"
    },
    "new_total_tokens": "60",
    "new_balance": "75"
  }
}
```

## 🔍 Health Check

### Server Status
```bash
curl -X GET http://localhost:3000/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "uptime": 123.456,
  "version": "1.0.0",
  "timestamp": "2025-10-16T10:30:00.000Z"
}
```

## 🧪 Test Users (Development)

The seeded database includes these test users:

| Email | Password | Role | Initial Tokens |
|-------|----------|------|----------------|
| `dj@beparty.local` | `password123` | DJ | 100 |
| `user1@beparty.local` | `password123` | USER | 75 |
| `user2@beparty.local` | `password123` | USER | 65 |

## 📝 Notes

- **Session ID**: Always use integers (e.g., `1`, not `"1"`)
- **Song ID**: Always use CUID strings (e.g., `"cmgsjtw75000exq087icrby56"`)
- **Token Amount**: Always use numbers (e.g., `25`, not `"25"`)
- **Authorization**: Include `Bearer ` prefix in Authorization header
- **Content-Type**: Use `application/json` for all POST requests

## 🔄 Error Responses

All endpoints return errors in this format:

```json
{
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "timestamp": "2025-10-16T10:30:00.000Z",
    "details": [
      // Validation details if applicable
    ]
  }
}
```

---

For complete API documentation, visit: http://localhost:3000/api/docs