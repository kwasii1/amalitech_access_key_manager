# Access Key Manager
Simple access key manager built in a monorepo with a React JS Frontend and Express JS backend

## Table of Contents

- [Access Key Manager](#access-key-manager)
  - [Table of Contents](#table-of-contents)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Features](#features)
    - [Backend Dependencies](#backend-dependencies)
    - [Frontend Dependencies](#frontend-dependencies)
    - [Frontend Pages](#frontend-pages)
    - [API Endpoints](#api-endpoints)
    - [Database](#database)


### Installation

1. Clone the repository
```bash
git clone link

```
2. Install Frontend Dependencies
``` cmd
cd client
npm install
npm run dev
```
3. Install Backend Dependencies
```cmd
cd .. && cd api
npm install
```
4. Set up environment variables by creating a .env file in the root directory of api and copy content of .env.example into it
```
APP_SECRET=<your_app_secret>
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=akm
```
5. Seed the database
```cmd
npx prisma db seed
```
6. Start backend server
```cmd
npm start
```

### Usage
Once the application is running, you can access the home page using the default base URL is http://localhost:5173.

### Features
- Authentication: Passport.js integration with a local strategy.
- Session Management: Using express-session with MySQL store.
- CSRF Protection: Implemented with csrf-sync.
- Rate Limiting: Configured using express-rate-limit.
- CORS: Enabled for specific origins.
- Logging: HTTP request logging with Morgan.
- Environment Configuration: Managed using dotenv.
- Authorization using middlewares

### Backend Dependencies
1. Main Dependencies
- express: Fast, unopinionated, minimalist web framework for Node.js.
cors: Node.js CORS middleware.
- cookie-parser: Parse Cookie header and populate req.cookies with an object.
- morgan: HTTP request logger middleware for Node.js.
- express-session: Simple session middleware for Express.
- express-mysql-session: MySQL session store for Express.
- passport: Simple, unobtrusive authentication for Node.js.
- csrf-sync: CSRF protection middleware for Express.
- dotenv: Loads environment variables from a .env file into process.env.
- @prisma/client: Prisma Client JS, an auto-generated and type-safe query builder for Node.js & TypeScript.
- bcrypt: Library to help you hash passwords.
- jsonwebtoken: JSON Web Token implementation.
- axios: Promise based HTTP client for the browser and node.js.
2. Dev Dependencies
- nodemon: Utility that monitors for any changes in your source and automatically restarts your server.
- @faker-js/faker: Generate massive amounts of fake data in the browser and node.js.
- prisma: Next-generation ORM for Node.js and TypeScript.

### Frontend Dependencies
- heroicons/react
- axios
- dayjs
- dotenv
- react
- react-data-table-component
- react-dom
- react-helmet
- react-helmet-async
- react-icons

### Frontend Pages
All pages are protected using middleware in the form of react Hooks to protect pages from unauthorized and unauthenticated access.
1. User Pages
- User Home Page - /
- Purchase Key - /purchase-key
- Profile - /profile
- Payments - /payments
2. Admin Pages
- Home Page - /admin
- Profile - /admin-profile
- Endpoint - /endpoint
- Payment - /admin-payments
3. Auth Pages
- Login - /login
- Register - /register
- Password Reset Form - /password-reset-form
- Password Reset Request - /password-reset
- Verify Email - /verify-email

### API Endpoints
### Database

