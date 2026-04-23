# Shopping PWA — Backend API

<p align="center">
  The REST API and real-time server powering the Shopping PWA platform.<br/>
  Built with Node.js, Express, MongoDB, Redis, and Socket.IO.
</p>

<p align="center">
  <a href="https://github.com/Min-Thant794/shoppingWebsite">Customer Repo</a>
  ·
  <a href="https://github.com/Min-Thant794/shopping-pwa-admin-ui">Admin Repo</a>
  ·
  <a href="https://shopping-website-delta-five.vercel.app">Customer Demo</a>
  ·
  <a href="https://shopping-pwa-admin-ui.vercel.app">Admin Demo</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Runtime-Node.js-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Framework-Express-black?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Cache-Redis-DC382D?style=for-the-badge&logo=redis" alt="Redis" />
  <img src="https://img.shields.io/badge/Realtime-Socket.IO-010101?style=for-the-badge&logo=socket.io" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Storage-Supabase-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
</p>

---

## Overview

This is the backend for the Shopping PWA platform — a full-stack e-commerce system split across three repositories. The API handles authentication, business logic, data persistence, file storage, and real-time communication for both the customer-facing website and the admin dashboard.

| Part | Repo |
|------|------|
| Customer Website | [shoppingWebsite](https://github.com/Min-Thant794/shoppingWebsite) |
| **Backend API** | **shopping-backend** ← you are here |
| Admin Dashboard | [shopping-pwa-admin-ui](https://github.com/Min-Thant794/shopping-pwa-admin-ui) |

---

## Architecture

```text
Customer Website (React + Vite)
          │
          ├── Axios (REST) + Socket.IO (real-time)
          │
          ▼
Backend API — Node.js + Express            ← this repo
  ├── MongoDB (via Mongoose) — main data store
  ├── Redis — caching and session support
  ├── Socket.IO — real-time order events
  └── Supabase — file and image storage
          ▲
          │
          └── Admin Dashboard (React + Vite)
```

---

## Features

- **RESTful API** — structured routes for products, orders, users, and authentication
- **JWT authentication** — token-based auth with secure route protection
- **MongoDB + Mongoose** — data modelling and persistence
- **Redis** — caching layer for performance and session support
- **Socket.IO** — real-time event broadcasting to both frontends (e.g. order status updates)
- **File uploads** — handled via Multer, stored in Supabase
- **CORS** — configured to allow requests from the customer and admin frontends
- **UUID** — unique ID generation for resources

---

## Tech Stack

`Node.js` `Express v5` `MongoDB` `Mongoose` `JWT` `Redis` `Socket.IO` `Multer` `Supabase` `UUID` `CORS` `Dotenv` `Nodemon`

---

## Project Structure

```
shopping-backend/
├── src/
│   ├── routes/          # API route definitions
│   ├── controllers/     # Route handler logic
│   ├── models/          # Mongoose schemas
│   ├── middleware/       # Auth and other middleware
│   └── config/          # DB, Redis, and Supabase setup
├── server.js            # Entry point — Express + Socket.IO init
├── package.json
└── .env
```

> Note: This reflects the likely structure based on the codebase. Update if your folder layout differs.

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/Min-Thant794/shopping-backend.git
cd shopping-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```env
PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

| Variable | Description |
|----------|-------------|
| `PORT` | Port the server listens on (default: 4000) |
| `MONGODB_URL` | MongoDB connection string (e.g. from MongoDB Atlas) |
| `JWT_SECRET` | Secret key for signing and verifying JWTs |
| `REDIS_URL` | Redis connection string (e.g. from Upstash or Railway) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase service role or anon key |

### 4. Start the server

```bash
npm start
```

The server runs with `nodemon`, so it will auto-restart on file changes during development.

---

## API Overview

> Full API documentation is planned. The sections below give a high-level summary.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT |
| POST | `/api/auth/logout` | Log out and invalidate session |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Fetch all products |
| GET | `/api/products/:id` | Fetch a single product |
| POST | `/api/products` | Create a product (admin) |
| PUT | `/api/products/:id` | Update a product (admin) |
| DELETE | `/api/products/:id` | Delete a product (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Fetch all orders (admin) |
| POST | `/api/orders` | Place a new order |
| PATCH | `/api/orders/:id` | Update order status (admin) |

> Endpoints may vary. Update this table to match your actual routes.

---

## Real-Time Events (Socket.IO)

The server emits events to connected clients when order-related changes occur.

| Event | Direction | Description |
|-------|-----------|-------------|
| `order:new` | Server → Admin | Broadcast when a new order is placed |
| `order:updated` | Server → All | Broadcast when an order status changes |

---

## Environment Notes

- The frontend and admin app both need `VITE_API_BASE_URL` and `VITE_SOCKET_URL` pointing to this server
- Redis and MongoDB can be hosted locally or on a cloud provider (e.g. MongoDB Atlas, Upstash, Railway)
- Supabase is used for persistent file/image storage — set up a storage bucket and update the keys accordingly

---

## Planned Improvements

- [ ] Add full API documentation
- [ ] Add input validation (e.g. with Zod or Joi)
- [ ] Improve error handling and standardize error responses
- [ ] Add unit and integration tests
- [ ] Add deployment guide

---

## Author

**Min Thant Tun** — [@Min-Thant794](https://github.com/Min-Thant794)

> Part of the Shopping PWA project — a full-stack e-commerce platform built during a mentorship program.