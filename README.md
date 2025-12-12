# MegaCampaign Backend

1. Admin creates new MegaCampaign (ssh)
2. Install dependencies: run `npm install` or `yarn`.
3. Configure environment: copy `.env.example` to `.env` and set `DATABASE_URL`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `JWT_SECRET`.
4. Database: run migrations and seeds (e.g., `npm run migrate` && `npm run seed`).
5. Start the server: `npm start` (use `npm run dev` for local development).
6. Tests: run `npm test` to execute the test suite.

## API Endpoints

| Endpoint | Method | Auth Required | Role | Description |
|---|---|---|---|---|
| `/api/auth` | POST | ❌ None | Public | Exchange Discord OAuth code for JWT token |
| `/api/health` | GET | ❌ None | Public | Check API and database health |
| **Megacampaigns Routes** | | | | |
| `/api/megacampaigns` | GET | ❌ None | Public | Get all megacampaigns |
| `/api/megacampaigns` | POST | ✅ JWT | Admin | Create a new megacampaign |
| **Signup Routes** | | | | |
| `/api/signup` | POST | ✅ JWT | User | Create/update signup with region picks |
| `/api/signup` | GET | ✅ JWT | User | Get current user's signup |
| `/api/signup/counts` | GET | ❌ None | Public | Get aggregate pick counts |
| `/api/signup/users` | GET | ❌ None | Public | Get list of all signed up users |
| **Assingment Routes** | | | | |
| `/api/user` | GET | ✅ JWT | User | Get current user profile |
| `/api/user/assignment` | GET | ✅ JWT | User | Get my current assignment |
| `/api/user/startingPosition` | POST | ✅ JWT | User | Set my starting position |
| `/api/assignments` | GET | ❌ None | Public | Get all assignments for a campaign |
| **Admin Routes** | | | | |
| `/api/admin/signups/:discordId` | DELETE | ✅ JWT | Admin | Remove a signup |
| **Moderator Routes** | | | | |
| `/api/moderator/signups` | GET | ✅ JWT | Moderator+ | Get all signups |
| `/api/moderator/signups/detailed` | GET | ✅ JWT | Moderator+ | Get all signups with full details |
| `/api/moderator/assignments` | POST | ✅ JWT | Moderator+ | Bulk update assignments |
