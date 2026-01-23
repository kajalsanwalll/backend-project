Backend Authentication API 

A production‑ready backend API for user authentication and account management, built with Node.js, Express, and MongoDB. This project follows clean architecture principles and was developed according to the PRD file shared.

* Features

User Registration & Login

Secure Password Hashing (bcrypt)

JWT‑based Authentication

Input Validation (express‑validator)

Centralized Error Handling

Modular MVC‑style Architecture

Environment‑based Configuration

GitHub‑ready, scalable codebase

* Tech Stack

Runtime: Node.js

Framework: Express.js

Database: MongoDB + Mongoose

Auth: JWT (JSON Web Tokens)

Security: bcrypt

Validation: express‑validator

Dev Tools: nodemon, dotenv

📁 Project Structure
src/
│── controllers/        # Business logic
│── routes/             # API route definitions
│── models/             # Mongoose schemas
│── middlewares/        # Auth, validation, error handlers
│── utils/              # Helper utilities (ApiError, ApiResponse, etc.)
│── app.js              # Express app setup
│── index.js            # Server entry point

* Authentication Flow

User registers with email/username & password

Password is hashed before saving to DB

On login, credentials are verified

JWT is generated and returned

Protected routes validate JWT via middleware

* Environment Variables

Create a .env file in the root directory:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d

▶️ Getting Started
1. Clone the repo
git clone https://github.com/kajalsanwalll/backend-project.git
cd backend-project
2. Install dependencies
npm install
3. Run the server
npm run dev

Server will start at: http://localhost:5000

* API Endpoints (Phase 1)
Auth Routes
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user

❗ Error Handling

All errors are returned in a consistent JSON format

Custom ApiError class is used

Validation errors are aggregated and returned cleanly

* Future Enhancements (Phase 2+)

Email verification

Forgot / Reset password

Refresh tokens

Role‑based access control

Rate limiting & logging

* Status

✅ Phase 1 completed

* Author

Built with focus and bugs (quiet a lot) by Kajal Sanwal 
