Develop a backend system for a virtual event management platform focusing on user registration, event scheduling, and participant management, all managed through in-memory data structures (if you are comfortable with databases, you can use any NoSQL or SQL database).

The system will feature secure user authentication, allowing users to register and log in using bcrypt for password hashing and JWT for session management.

Event management capabilities include creating, updating, and deleting event details, with each event storing information like date, time, description, and participant list in memory. These functionalities should be accessible only to authenticated and authorized users. Additionally, the system should allow users to register for events, and view, and manage their event registrations.

The backend should offer a set of RESTful API endpoints, catering to various functionalities such as user registration (POST /register), login (POST /login), event creation (POST /events), updating events (PUT /events/:id), and event registration (POST /events/:id/register). On successful registration, the user should receive an email.
# Virtual Event Management Backend

## 🚀 Features
- User Registration & Login (JWT + bcrypt)
- Role-based access (Organizer / Attendee)
- Event CRUD (Create, Update, Delete)
- Event Registration
- In-memory data storage

## 🛠 Tech Stack
- Node.js
- Express.js
- bcryptjs
- jsonwebtoken
- nodemailer
- dotenv

## 📦 Setup

```bash
npm install
npm run dev
https://github.com/akash2899/Backend-System-for-a-Virtual-Event-Management-Platform-Airtribe
# 🎉 Virtual Event Management Backend

A simple and beginner-friendly backend system built using **Node.js and Express.js** that allows users to register, log in, create events, and participate in events.

This project is designed to demonstrate core backend concepts like **authentication, authorization, REST APIs, and in-memory data handling**.

---

# 🚀 Features

## 👤 User Authentication

* Register new users with email and password
* Passwords are securely hashed using **bcrypt**
* Login system using **JWT (JSON Web Tokens)**
* Role-based users:

  * **Organizer** → can create, update, delete events
  * **Attendee** → can register for events

---

## 🎉 Event Management

* Create events (only organizers)
* Update event details
* Delete events
* View all available events

Each event includes:

* Title
* Date
* Time
* Description
* Participants list

---

## 🙋 Participant Management

* Users can register for events
* Prevents duplicate registrations
* Tracks participants for each event

---

## 🔐 Authorization & Security

* Protected routes using JWT middleware
* Only authorized users can perform certain actions
* Role-based access control implemented

---

## ⚡ In-Memory Data Storage

* No database used
* Data is stored in arrays (temporary storage)
* Note: Data resets when server restarts

---

# 🛠 Tech Stack

* **Node.js** – Backend runtime
* **Express.js** – Web framework
* **bcryptjs** – Password hashing
* **jsonwebtoken (JWT)** – Authentication
* **nodemailer** – Email support (optional)
* **dotenv** – Environment variables
* **cors** – Cross-origin requests

---

# 📁 Project Structure

```
project-root/
│
├── src/
│   ├── controllers/     # Business logic (optional)
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── data/            # In-memory storage
│   ├── utils/           # Helper functions
│   └── app.js           # Main server file
│
├── .env                 # Environment variables
├── package.json
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the repository

```
git clone <your-repo-link>
cd <your-project-folder>
```

## 2️⃣ Install dependencies

```
npm install
```

## 3️⃣ Create `.env` file

Create a file named `.env` in the root folder and add:

```
JWT_SECRET=your_secret_key
```

---

## 4️⃣ Start the server

```
npm run dev
```

---

## 🌐 Server will run on:

```
http://localhost:5000
```

---

# 📬 API Endpoints

## 🔐 Authentication

### ➤ Register User

```
POST /api/register
```

**Body:**

```json
{
  "email": "test@gmail.com",
  "password": "123456",
  "role": "organizer"
}
```

---

### ➤ Login User

```
POST /api/login
```

**Response:**

```json
{
  "token": "your_jwt_token"
}
```

---

## 🎉 Event APIs

### ➤ Get All Events

```
GET /api/events
```

---

### ➤ Create Event (Organizer only)

```
POST /api/events
```

---

### ➤ Update Event

```
PUT /api/events/:id
```

---

### ➤ Delete Event

```
DELETE /api/events/:id
```

---

## 🙋 Register for Event

### ➤ Join Event

```
POST /api/events/:id/register
```

---

# 🔑 Authorization Header

For protected routes, include token:

```
Authorization: YOUR_JWT_TOKEN
```

---

# 🧪 Testing

You can test APIs using:

* Postman
* Thunder Client (VS Code extension)

---

# ⚠️ Important Notes

* This project uses **in-memory storage**, so:

  * Data will be lost when server restarts
* No database is connected (for simplicity)
* Designed for **learning and demonstration purposes**

---

# 📌 Future Improvements

* Connect MongoDB or SQL database
* Add email notifications on event registration
* Add pagination & filtering
* Build frontend using React
* Deploy on cloud (Render / AWS)

---

# 👨‍💻 Author

Developed by **Akash Jaiswal**

---

# ⭐ If you found this helpful

Give this project a ⭐ on GitHub!


Test API 
# 🧪 Complete API Testing Flow (Step-by-Step)

Follow this exact sequence to test the entire backend using **Postman / Thunder Client**.

---

# 🔁 Step 1: Register User

### 📬 Request

```
POST /api/register
```

### 📦 Body

```json
{
  "email": "organizer@gmail.com",
  "password": "123456",
  "role": "organizer"
}
```

### ✅ Expected Response

```json
{
  "message": "User registered successfully"
}
```

---

# 🔁 Step 2: Login User

### 📬 Request

```
POST /api/login
```

### 📦 Body

```json
{
  "email": "organizer@gmail.com",
  "password": "123456"
}
```

### ✅ Response

```json
{
  "token": "your_jwt_token"
}
```

👉 **Copy this token** — required for all next APIs

---

# 🔁 Step 3: Create Event (Organizer Only)

### 📬 Request

```
POST /api/events
```

### 🔑 Headers

```
Authorization: YOUR_JWT_TOKEN
```

### 📦 Body

```json
{
  "title": "Tech Conference",
  "date": "2026-04-10",
  "time": "10:00 AM",
  "description": "Backend event"
}
```

### ✅ Response

```json
{
  "message": "Event created",
  "event": {
    "id": 123456
  }
}
```

👉 **Copy event ID**

---

# 🔁 Step 4: Get All Events

### 📬 Request

```
GET /api/events
```

### 🔑 Headers

```
Authorization: YOUR_JWT_TOKEN
```

### ✅ Response

```json
[
  {
    "id": 123456,
    "title": "Tech Conference"
  }
]
```

---

# 🔁 Step 5: Update Event

### 📬 Request

```
PUT /api/events/:id
```

👉 Replace `:id` with actual event ID

### 🔑 Headers

```
Authorization: YOUR_JWT_TOKEN
```

### 📦 Body

```json
{
  "title": "Updated Event Title"
}
```

### ✅ Response

```json
{
  "message": "Event updated"
}
```

---

# 🔁 Step 6: Register Another User (Attendee)

### 📬 Request

```
POST /api/register
```

### 📦 Body

```json
{
  "email": "user@gmail.com",
  "password": "123456",
  "role": "attendee"
}
```

---

# 🔁 Step 7: Login as Attendee

### 📬 Request

```
POST /api/login
```

### 📦 Body

```json
{
  "email": "user@gmail.com",
  "password": "123456"
}
```

👉 Copy new token (attendee token)

---

# 🔁 Step 8: Register for Event

### 📬 Request

```
POST /api/events/:id/register
```

### 🔑 Headers

```
Authorization: ATTENDEE_TOKEN
```

### ✅ Response

```json
{
  "message": "Registered successfully"
}
```

---

# 🔁 Step 9: Prevent Duplicate Registration

👉 Hit same API again

### ❌ Expected:

```json
{
  "message": "Already registered"
}
```

---

# 🔁 Step 10: Delete Event (Organizer Only)

### 📬 Request

```
DELETE /api/events/:id
```

### 🔑 Headers

```
Authorization: ORGANIZER_TOKEN
```

### ✅ Response

```json
{
  "message": "Event deleted successfully"
}
```

---

# ⚠️ Important Rules

* 🔐 All `/events` routes require **JWT token**
* 👑 Only **organizer** can:

  * Create event
  * Update event
  * Delete event
* 🙋 Attendees can:

  * View events
  * Register for events
* ❌ Duplicate event registration is blocked

---

# 🧠 Testing Tips

* Always keep **2 users**:

  * Organizer
  * Attendee
* Save tokens in Postman variables
* Use correct event ID
* Restart server → data resets (in-memory)

---

# 🎯 Summary Flow

```id="flowchart"
Register → Login → Get Token → Create Event → Get Events → Update Event → 
Register Attendee → Login → Register for Event → Delete Event
```

---

This flow ensures **100% API coverage** of your backend 🚀
