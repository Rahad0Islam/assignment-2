# DevPulse API

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

## Live URL

https://devpulse-beta-ten.vercel.app

## Features

- Role-based auth with JWT (contributor, maintainer)
- Issue tracking with status workflow (open, in_progress, resolved)
- Public issue browsing with sorting and filtering
- Maintainer-only delete and privileged updates
- Raw SQL with PostgreSQL using the native pg driver

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL (pg)
- bcrypt
- jsonwebtoken

## Project Structure

- src/app.ts - Express app wiring
- src/server.ts - Server bootstrap
- src/config - Environment config
- src/db - Database pool and table init
- src/module/Authentication - Auth module
- src/module/Issues - Issues module
- src/middleware - Auth and error middleware
- src/utility - Response helpers

## Setup

### Prerequisites

- Node.js 24.x or higher
- PostgreSQL database

### Installation

```bash
npm install
```

### Environment Variables

Create a .env file in the project root:

```env
PORT=5000
CONNECTION_STRING=postgres://USER:PASSWORD@HOST:PORT/DB
JWT_SECRET=your_jwt_secret
JWT_VALIDITY_TIME=1d
```

### Database

Tables are created automatically on server startup.

### Run Locally

```bash
npm run dev
```

### Build and Start

```bash
npm run build
npm run start
```

## API Endpoints

### Auth

- POST /api/auth/signup
- POST /api/auth/login

### Issues

- POST /api/issues (auth required)
- GET /api/issues
- GET /api/issues/:id
- PATCH /api/issues/:id (auth required)
- DELETE /api/issues/:id (maintainer only)

### Query Parameters (GET /api/issues)

- sort: newest | oldest (default: newest)
- type: bug | feature_request
- status: open | in_progress | resolved

### Authorization Header

Send the JWT token as a raw value in the Authorization header:

```
Authorization: <JWT_TOKEN>
```

## Response Format

```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error details"
}
```

## Database Schema Summary

### users

- id: serial primary key
- name: text, required
- email: varchar(255), unique, required
- password: text, required
- role: contributor | maintainer (default: contributor)
- created_at: timestamp, default now
- updated_at: timestamp, default now

### issues

- id: serial primary key
- title: varchar(150), required
- description: text, required (min length: 20)
- type: bug | feature_request
- status: open | in_progress | resolved (default: open)
- reporter_id: int, required
- created_at: timestamp, default now
- updated_at: timestamp, default now

## Notes

- Reporter details are fetched without SQL JOINs.
- Passwords are never returned in responses.
