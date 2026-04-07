Develop a backend system for a virtual event management platform focusing on user registration, event scheduling, and participant management, all managed through in-memory data structures (if you are comfortable with databases, you can use any NoSQL or SQL database).

The system will feature secure user authentication, allowing users to register and log in using bcrypt for password hashing and JWT for session management.

Event management capabilities include creating, updating, and deleting event details, with each event storing information like date, time, description, and participant list in memory. These functionalities should be accessible only to authenticated and authorized users. Additionally, the system should allow users to register for events, and view, and manage their event registrations.

The backend should offer a set of RESTful API endpoints, catering to various functionalities such as user registration (POST /register), login (POST /login), event creation (POST /events), updating events (PUT /events/:id), and event registration (POST /events/:id/register). On successful registration, the user should receive an email.
