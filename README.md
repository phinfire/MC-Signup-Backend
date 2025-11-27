# MegaCampaign Backend

## API Endpoints

| Endpoint | Method | Auth Required | Role | Description |
|---|---|---|---|---|
| `/api/auth` | POST | ❌ None | Public | Exchange Discord OAuth code for JWT token |
| `/api/health` | GET | ❌ None | Public | Check API and database health |
| **Signup Routes** | | | | |
| `/api/signup` | POST | ✅ JWT | User | Create/update signup with region picks |
| `/api/signup` | GET | ✅ JWT | User | Get current user's signup |
| `/api/signup/counts` | GET | ❌ None | Public | Get aggregate pick counts |
| `/api/signup/users` | GET | ❌ None | Public | Get list of all signed up users |
| **User Routes** | | | | |
| `/api/user` | GET | ✅ JWT | User | Get current user profile |
| `/api/user/assignment` | GET | ✅ JWT | User | Get my current assignment |
| `/api/user/startingPosition` | POST | ✅ JWT | User | Set my starting position |
| **Admin Routes** | | | | |
| `/api/admin/signups/:discordId` | DELETE | ✅ JWT | Admin | Remove a signup |
| **Public Routes** | | | | |
| `/api/moderator/assignments` | GET | ❌ None | Public | Get all assignments |
| **Moderator Routes** | | | | |
| `/api/moderator/signups` | GET | ✅ JWT | Moderator+ | Get all signups |
| `/api/moderator/signups/detailed` | GET | ✅ JWT | Moderator+ | Get all signups with full details |
| `/api/moderator/assignments` | POST | ✅ JWT | Moderator+ | Bulk update assignments |
