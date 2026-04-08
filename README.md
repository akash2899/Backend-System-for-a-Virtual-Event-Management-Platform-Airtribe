# Backend System for a Virtual Event Management Platform

A Node.js and Express backend for managing authentication and event workflows in a virtual event platform. The application is intentionally lightweight and uses in-memory storage, which makes it useful for learning, local demos, interview assignments, and API experimentation.

## Executive Summary

This project implements a modular Express API with:

- User registration using hashed passwords
- User login with JWT token generation
- Role-based access control for organizer-only event management
- Event listing and attendee registration for authenticated users
- In-memory storage for users and events

From an engineering perspective, the project is a solid foundation for a backend service, but it is not yet production-ready. The main gaps are persistence, validation, standardized error handling, and automated tests.

## What the Project Does

The platform currently supports two main domains:

### 1. Authentication
Users can:
- Register with `email`, `password`, and optional `role`
- Log in using their credentials
- Receive a JWT token after successful login

### 2. Event Management
Authenticated users can:
- View all events
- Register for an event

Authenticated users with the `organizer` role can:
- Create events
- Update events
- Delete events

## Current Implementation Status

### Implemented Features
- `POST /api/register`
- `POST /api/login`
- `GET /api/events`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `POST /api/events/:id/register`
- JWT auth middleware
- Password hashing with `bcryptjs`
- Role checks for event management
- Duplicate event registration prevention

### Partially Implemented or Missing
- Database persistence
- Input validation and schema enforcement
- Email notifications after registration or event sign-up
- Support for `Bearer <token>` auth headers
- Event ownership checks
- Logout flow
- Forgot-password/reset-password flows
- Automated route and middleware tests
- Centralized error handling middleware
- Rate limiting and abuse protection

## Tech Stack

- Node.js
- Express
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- nodemon
- jest and supertest are installed but not yet used for app-level tests

## Project Structure

```text
src/
  app.js
  data/
    store.js
  middleware/
    auth.js
  routes/
    auth.js
    events.js
```

## File-by-File Analysis

### [`src/app.js`](./src/app.js)
Purpose:
- creates the Express application
- enables CORS
- enables JSON body parsing
- mounts auth and event routes under `/api`
- starts the HTTP server on port `5001`

Observations:
- route mounting is simple and clean
- there is no centralized 404 handler
- there is no global error middleware
- the port is hardcoded to `5001`

Impact:
- simple for development
- less flexible for deployment and environment-based configuration

### [`src/data/store.js`](./src/data/store.js)
Purpose:
- exports in-memory arrays for `users` and `events`

Observations:
- this acts as a temporary in-process datastore
- restarting the server clears all data
- there is no indexing, persistence, or concurrency control

Impact:
- good for demos and assignments
- not suitable for real-world multi-user systems

### [`src/routes/auth.js`](./src/routes/auth.js)
Purpose:
- handles user registration and login

Registration behavior:
- checks whether a user with the same email already exists
- hashes the password with bcrypt
- defaults role to `attendee` when omitted
- stores the new user in memory

Login behavior:
- looks up the user by email
- compares password hashes
- returns a signed JWT containing `id` and `role`

Observations:
- authentication flow is easy to follow
- passwords are safely hashed before storage
- request validation is missing
- duplicate email detection is case-sensitive
- `dotenv.config()` is called inside the route file instead of a central bootstrap location

Impact:
- works for basic usage
- can fail in unexpected ways for malformed requests

### [`src/middleware/auth.js`](./src/middleware/auth.js)
Purpose:
- protects private routes by verifying JWT tokens

Behavior:
- reads `req.headers.authorization`
- verifies the token using `JWT_SECRET`
- attaches decoded payload to `req.user`

Observations:
- middleware expects the raw token string
- standard `Bearer <token>` format is not parsed
- invalid or missing token returns `401`

Impact:
- functional for local testing
- may confuse users expecting the normal Bearer-token convention

### [`src/routes/events.js`](./src/routes/events.js)
Purpose:
- handles event creation, retrieval, update, deletion, and event registration

Behavior:
- only organizers can create, update, or delete events
- authenticated users can list all events
- authenticated users can register for an event
- duplicate event registration is prevented using `participants.includes(req.user.id)`

Observations:
- route logic is straightforward and readable
- no validation for missing title/date/time/description
- event ids are generated with `Date.now()`
- event ownership is not tracked
- any organizer can update or delete any event

Impact:
- suitable for demonstrating role-based access
- insufficient for multi-organizer real-world scenarios

## Runtime Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

What each variable does:
- `JWT_SECRET`: required to sign and verify JWT tokens
- `EMAIL_USER`: currently unused by active routes
- `EMAIL_PASS`: currently unused by active routes

Important note:
- if `JWT_SECRET` is missing, login and authenticated routes will fail unpredictably or throw token verification/signing errors

## Installation

```bash
npm install
```

## Run the Project

```bash
npm run dev
```

Current local base URL:

```text
http://localhost:5001/api
```

## API Reference

### 1. Register User
Endpoint:

```http
POST /api/register
```

Sample request:

```json
{
  "email": "organizer@example.com",
  "password": "123456",
  "role": "organizer"
}
```

Success response:

```json
{
  "message": "User registered successfully"
}
```

Possible failure cases:
- email already exists -> `400`
- malformed JSON body -> Express-level parse error
- missing required fields -> currently not validated explicitly
- unexpected runtime error -> `500`

Behavior notes:
- if `role` is omitted, the user becomes `attendee`
- email normalization is not applied, so `User@example.com` and `user@example.com` are treated as different users
- empty strings are not rejected by explicit validation logic

### 2. Login User
Endpoint:

```http
POST /api/login
```

Sample request:

```json
{
  "email": "organizer@example.com",
  "password": "123456"
}
```

Success response:

```json
{
  "token": "<jwt-token>"
}
```

Possible failure cases:
- user not found -> `404`
- invalid password -> `400`
- missing `JWT_SECRET` -> token signing failure
- malformed or empty body -> not explicitly validated
- unexpected runtime error -> `500`

Behavior notes:
- the JWT payload contains `id` and `role`
- token expiry is currently set to `1h`

### 3. Get All Events
Endpoint:

```http
GET /api/events
```

Headers:

```http
Authorization: <jwt-token>
```

Success response:
- returns the in-memory `events` array

Possible failure cases:
- missing token -> `401`
- invalid token -> `401`

Behavior notes:
- there is no pagination
- all authenticated users see the same global event list

### 4. Create Event
Endpoint:

```http
POST /api/events
```

Headers:

```http
Authorization: <jwt-token>
```

Sample request:

```json
{
  "title": "AI Product Summit",
  "date": "2026-04-15",
  "time": "18:00",
  "description": "A virtual event focused on AI products and developer tooling."
}
```

Success response:
- returns a success message and the created event object

Possible failure cases:
- missing token -> `401`
- invalid token -> `401`
- non-organizer role -> `403`
- invalid or incomplete request body -> currently not explicitly validated
- unexpected runtime error -> `500`

Behavior notes:
- event id uses `Date.now()`
- if two events are created at the same millisecond, id collision is theoretically possible
- no field-level validation is performed

### 5. Update Event
Endpoint:

```http
PUT /api/events/:id
```

Headers:

```http
Authorization: <jwt-token>
```

Success behavior:
- updates only the provided fields among `title`, `date`, `time`, `description`

Possible failure cases:
- missing token -> `401`
- invalid token -> `401`
- non-organizer role -> `403`
- event not found -> `404`
- invalid route id -> effectively results in event not found
- unexpected runtime error -> `500`

Behavior notes:
- partial updates are supported
- any organizer can update any event
- there is no ownership or audit history

### 6. Delete Event
Endpoint:

```http
DELETE /api/events/:id
```

Headers:

```http
Authorization: <jwt-token>
```

Possible failure cases:
- missing token -> `401`
- invalid token -> `401`
- non-organizer role -> `403`
- event not found -> `404`
- unexpected runtime error -> `500`

Behavior notes:
- deletion permanently removes the event from in-memory storage
- data is not recoverable within the running session after deletion unless recreated manually

### 7. Register for an Event
Endpoint:

```http
POST /api/events/:id/register
```

Headers:

```http
Authorization: <jwt-token>
```

Success behavior:
- adds the current user's id to the event's `participants` array

Possible failure cases:
- missing token -> `401`
- invalid token -> `401`
- event not found -> `404`
- duplicate registration -> `400`
- unexpected runtime error -> `500`

Behavior notes:
- duplicate registration is prevented
- there is no event capacity limit
- there is no waitlist flow
- organizers are not blocked from registering as participants

## Important Edge Cases and Behaviors

### Authentication Edge Cases
- The middleware expects `Authorization: <token>` and not `Authorization: Bearer <token>`
- If someone sends `Bearer <token>`, verification will fail unless middleware is updated
- If `JWT_SECRET` changes while the app is running between login sessions, previously issued tokens become invalid
- The token only carries `id` and `role`, so no user profile refresh or revocation logic exists

### Input Validation Edge Cases
- Missing `email`, `password`, `title`, `date`, `time`, or `description` fields are not explicitly validated
- Empty strings can be stored if passed in the body
- Invalid email format is accepted
- Invalid date and time formats are accepted as plain strings
- Extra request properties are ignored rather than rejected

### Data Integrity Edge Cases
- Data disappears on server restart because arrays live only in memory
- `Date.now()`-based ids are simple but not ideal for long-term uniqueness guarantees
- Event participants store only user ids, not registration metadata
- There is no cascade logic if user deletion is added later

### Authorization Edge Cases
- Any authenticated organizer can update or delete any event
- There is no distinction between event creator and other organizers
- Attendees cannot create events, which is correct by role design
- The system trusts the JWT role claim after token verification

### Operational Edge Cases
- No rate limiting means repeated login attempts are not throttled
- No standardized logger is present for request tracing or incident debugging
- No graceful shutdown logic exists
- No health-check endpoint beyond the root route
- The app does not currently support environment-specific port configuration

## Example End-to-End Flow

### Step 1. Register an organizer

```http
POST /api/register
Content-Type: application/json

{
  "email": "organizer@example.com",
  "password": "123456",
  "role": "organizer"
}
```

### Step 2. Login as organizer

```http
POST /api/login
Content-Type: application/json

{
  "email": "organizer@example.com",
  "password": "123456"
}
```

### Step 3. Copy the returned token
Use the token directly in the `Authorization` header.

### Step 4. Create an event

```http
POST /api/events
Content-Type: application/json
Authorization: <jwt-token>

{
  "title": "Launch Meetup",
  "date": "2026-04-20",
  "time": "19:30",
  "description": "Product launch discussion and networking session."
}
```

### Step 5. Register an attendee
- register a second user with the default `attendee` role
- log in as that user
- call `POST /api/events/:id/register`

## Security and Design Assessment

### Strengths
- modular Express structure
- password hashing implemented correctly at a basic level
- JWT-protected routes exist
- role-based checks are present
- code is easy to read and extend

### Risks and Weaknesses
- no payload validation
- no persistence layer
- no test suite for the app code
- token parsing is non-standard
- organizer permissions are broad and not resource-scoped
- error handling is local and repetitive across routes

## Recommendations for Production Readiness

### High Priority
- add request validation for every route
- support `Bearer <token>` in the auth middleware
- move `dotenv.config()` to the application bootstrap layer
- add automated tests with Jest and Supertest
- use `process.env.PORT` with a fallback default
- introduce centralized error handling middleware

### Medium Priority
- migrate to MongoDB or PostgreSQL
- implement event ownership rules
- normalize email addresses before storage and lookup
- add request logging and structured error logging
- add status and health-check endpoints

### Nice to Have
- email notifications via `nodemailer`
- password reset flow
- refresh tokens
- pagination and filtering for event lists
- event capacity management and waitlist support

## Testing Status

The repository includes `jest` and `supertest` in `devDependencies`, but there are no project-level route or middleware tests yet. Existing test files found in `node_modules` belong to dependencies, not to this application.

## Who This README Helps

This document is written to help:
- recruiters reviewing the code quickly
- teammates onboarding onto the project
- interviewers evaluating implementation decisions
- future contributors who need a realistic view of current behavior and limitations

## Final Assessment

This project demonstrates a strong beginner-to-intermediate backend foundation. It shows good understanding of routing, JWT authentication, password hashing, and role-based access control. The next major step is to harden the system with validation, tests, persistence, and more production-like auth conventions.

## License

The project is currently marked with the `ISC` license in `package.json`.
