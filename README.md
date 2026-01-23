Backend Authentication API

A production-ready authentication and account management API built with Node.js, Express, and MongoDB.
Designed following clean architecture principles and implemented strictly according to the Product Requirements Document (PRD).

This project focuses on security, scalability, and maintainability, serving as the foundation for a larger role-based collaborative backend system.

* Features

User Registration & Login

Secure Password Hashing using bcrypt

JWT-based Authentication

Input Validation with express-validator

Centralized Error Handling

Modular MVC-style Architecture

Environment-based Configuration

Scalable, GitHub-ready codebase

* Tech Stack

Runtime: Node.js

Framework: Express.js

Database: MongoDB + Mongoose

Authentication: JSON Web Tokens (JWT)

Security: bcrypt

Validation: express-validator

Dev Tools: nodemon, dotenv

* Project Structure
src/
│── controllers/        # Business logic
│── routes/             # API route definitions
│── models/             # Mongoose schemas
│── middlewares/        # Auth, validation, error handlers
│── utils/              # Helper utilities (ApiError, ApiResponse, etc.)
│── app.js              # Express app setup
│── index.js            # Server entry point


* Authentication Flow

User registers using email/username and password

Password is hashed before storing in the database

User logs in with valid credentials

JWT access token is generated and returned

Protected routes validate JWT using authentication middleware

* Environment Variables

Create a .env file in the root directory:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d


▶️ Getting Started
1 Clone the repository
git clone https://github.com/kajalsanwalll/backend-project.git
cd backend-project

2 Install dependencies
npm install

3 Run the development server
npm run dev


Server will start at:
* http://localhost:5000

* API Endpoints (Phase 1)
Authentication Routes
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Authenticate a user


❗ Error Handling

Consistent JSON error responses across the API

Centralized error handling middleware

Custom ApiError class for structured errors

Validation errors are aggregated and returned clearly

 Future Enhancements (Phase 2+)

Integration with Frontend

* Project Status

Phase 1 Completed
Phase 2 (RBAC, projects, tasks, subtasks, notes, file uploads) implemented in the extended backend system.

* Author

Kajal Sanwal
Built with focus, persistence, and a lot of debugging.
(Thank you if you made it till here)