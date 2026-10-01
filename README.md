# VendorAPI

A production-style **Vendor Onboarding REST API** built with Node.js, Express, PostgreSQL, Prisma, JWT, and bcrypt.

The project demonstrates core backend engineering concepts including authentication, authorization, relational database design, CRUD APIs, centralized error handling, database indexes, transactions, and ACID properties.

---

## 🚀 Features

- User registration
- Secure password hashing with bcrypt
- User login with JWT
- JWT authentication middleware
- Vendor CRUD operations
- User-based vendor authorization
- Vendor onboarding management
- PostgreSQL relational database
- Prisma ORM
- Primary and foreign keys
- Unique constraints
- Database indexes
- Transactions
- ACID concepts
- Centralized error handling
- Consistent HTTP status codes
- Postman API testing

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| PostgreSQL | Relational database |
| Prisma | ORM |
| JWT | Authentication |
| bcrypt | Password hashing |
| dotenv | Environment variables |
| Postman | API testing |

The project uses **JavaScript with CommonJS**, with `index.js` as the application entry point.

---

# 📐 Architecture

```text
Client / Postman
       │
       ▼
Express Router
       │
       ▼
Middleware
       │
       ▼
Controller
       │
       ▼
Service
       │
       ▼
Prisma ORM
       │
       ▼
PostgreSQL
```

### Request lifecycle

```text
POST /vendors
      ↓
Express Router
      ↓
JWT Authentication Middleware
      ↓
Vendor Controller
      ↓
Vendor Service
      ↓
Prisma
      ↓
PostgreSQL
      ↓
Service
      ↓
Controller
      ↓
JSON Response
```

---

# 📁 Project Structure

```text
VendorAPI/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── vendor.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   └── vendor.service.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── vendor.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── utils/
│   │   └── AppError.js
│   ├── lib/
│   │   └── prisma.js
│   └── index.js
│
├── .env
├── package.json
└── README.md
```

---

# 🗄️ Database Design

The application contains three primary entities:

```text
User
 │
 │ 1
 │
 │ N
 ▼
Vendor
 │
 │ 1
 │
 │ 1
 ▼
Onboarding
```

## User

```text
User
----------------
id
name
email
password
createdAt
updatedAt
```

Stores authenticated application users.

## Vendor

```text
Vendor
----------------
id
name
email
status
userId
createdAt
updatedAt
```

`userId` is a foreign key referencing `User.id`.

## Onboarding

```text
Onboarding
----------------
id
vendorId
status
createdAt
updatedAt
```

`vendorId` is a unique foreign key referencing `Vendor.id`.

---

# 🔗 Relationships

### User → Vendor

One user can have multiple vendors:

```text
User 1 ───────── N Vendor
```

The foreign key is:

```text
Vendor.userId
```

### Vendor → Onboarding

Each vendor has one onboarding record:

```text
Vendor 1 ───────── 1 Onboarding
```

The foreign key is:

```text
Onboarding.vendorId
```

`vendorId` is unique, which enforces the one-to-one relationship at the database level.

---

# 🔐 Authentication

Authentication is implemented using JWT.

## Registration

```http
POST /auth/register
```

Example:

```json
{
  "name": "Avishek",
  "email": "avishek@example.com",
  "password": "password123"
}
```

The password is hashed using bcrypt before being stored. The raw password is never returned.

## Login

```http
POST /auth/login
```

Example:

```json
{
  "email": "avishek@example.com",
  "password": "password123"
}
```

Successful login returns a JWT:

```json
{
  "token": "JWT_TOKEN"
}
```

---

# 🛡️ Authorization

Authentication answers:

> "Who are you?"

Authorization answers:

> "Are you allowed to access this resource?"

For vendor operations, the authenticated user's ID is compared with the vendor's `userId`.

```text
JWT userId = 1
Vendor userId = 1
→ Access allowed
```

```text
JWT userId = 1
Vendor userId = 2
→ Access denied
```

This prevents users from accessing other users' vendors through normal API paths.

---

# 📡 API Endpoints

## Authentication

### Register

```http
POST /auth/register
```

Creates a new user.

### Login

```http
POST /auth/login
```

Authenticates the user and returns a JWT.

---

## Vendor APIs

All vendor endpoints require authentication.

Send the token using:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Create Vendor

```http
POST /vendors
```

Example:

```json
{
  "name": "ABC Technologies",
  "email": "abc@example.com"
}
```

The authenticated user's ID becomes the vendor owner. Vendor creation also creates the corresponding onboarding record.

### Get Vendors

```http
GET /vendors
```

Returns vendors belonging to the authenticated user.

### Get Vendor

```http
GET /vendors/:id
```

Returns a specific vendor after verifying ownership.

### Update Vendor

```http
PATCH /vendors/:id
```

Example:

```json
{
  "name": "ABC Technologies Pvt Ltd"
}
```

Only the vendor owner can update the vendor.

### Delete Vendor

```http
DELETE /vendors/:id
```

Deletes the vendor after verifying ownership.

---

# 🔄 Onboarding

Each vendor has an onboarding status.

Possible statuses:

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
```

The onboarding record is created together with the vendor using a database transaction.

---

# 💾 Transactions

Vendor creation performs two database operations:

```text
1. Create Vendor
2. Create Onboarding
```

These operations are wrapped inside a Prisma transaction.

```text
BEGIN
   ↓
Create Vendor
   ↓
Create Onboarding
   ↓
COMMIT
```

If onboarding creation fails:

```text
BEGIN
   ↓
Create Vendor
   ↓
Create Onboarding ❌
   ↓
ROLLBACK
```

The vendor creation is therefore also rolled back.

This prevents a partially-created vendor from remaining in the database without its required onboarding record.

---

# 🧠 ACID

### Atomicity

Both vendor and onboarding creation succeed together or fail together.

### Consistency

Database constraints such as foreign keys keep relationships valid.

### Isolation

Concurrent transactions are isolated according to PostgreSQL's transaction isolation behavior.

### Durability

Once a transaction is committed, PostgreSQL persists the changes.

---

# 📊 Database Indexes

The project uses indexes on frequently queried fields such as:

```text
userId
status
```

For example, `GET /vendors` requires finding vendors belonging to a particular user:

```sql
WHERE userId = ?
```

An index on `userId` can allow PostgreSQL to locate matching rows more efficiently than scanning the entire table.

Indexes have trade-offs:

- Faster relevant reads
- Additional storage
- Additional work during INSERT/UPDATE/DELETE

Indexes should therefore be added based on query patterns and performance requirements rather than indexing every column.

---

# ⚠️ Error Handling

The project uses centralized error handling.

Custom application errors are represented using `AppError`.

```js
throw new AppError(
    "Vendor not found!",
    404,
    "VENDOR_NOT_FOUND"
);
```

The centralized error middleware converts errors into consistent HTTP responses:

```json
{
  "error": "Vendor not found!",
  "code": "VENDOR_NOT_FOUND"
}
```

---

# 📋 HTTP Status Codes

| Status | Meaning |
|---|---|
| `200` | Successful request |
| `201` | Resource successfully created |
| `400` | Invalid request |
| `401` | Authentication required/invalid |
| `403` | Authenticated but not authorized |
| `404` | Resource not found |
| `409` | Resource conflict |
| `500` | Unexpected server error |

---

# 🔒 Password Security

Passwords are never stored as plaintext.

During registration:

```text
Plain Password
      ↓
bcrypt.hash()
      ↓
Password Hash
      ↓
PostgreSQL
```

During login:

```text
Submitted Password
      ↓
bcrypt.compare()
      ↓
Stored Hash
```

The API never returns the password hash to the client.

---

# 🔑 Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/vendor_onboarding"

JWT_SECRET="your-secret-key"

JWT_EXPIRES_IN="1d"
```

Never commit `.env` to Git.

Add it to `.gitignore`:

```gitignore
.env
node_modules/
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone <repository-url>
cd VendorAPI
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create `.env` and add your PostgreSQL and JWT configuration.

## 4. Generate Prisma Client

```bash
npx prisma generate
```

## 5. Apply database schema

```bash
npx prisma db push
```

or use Prisma migrations when following a migration-based workflow.

## 6. Start the application

```bash
node src/index.js
```

For development, if a development script is configured:

```bash
npm run dev
```

---

# 🧪 Testing with Postman

Typical testing flow:

```text
1. Register
      ↓
2. Login
      ↓
3. Copy JWT
      ↓
4. Add Authorization header
      ↓
5. Create Vendor
      ↓
6. Get Vendors
      ↓
7. Get Vendor by ID
      ↓
8. Update Vendor
      ↓
9. Delete Vendor
```

Authorization header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 🧪 Important Test Cases

## Registration

```text
POST /auth/register → 201
POST /auth/register with duplicate email → 409
POST /auth/register with invalid input → 400
```

## Login

```text
POST /auth/login with correct credentials → 200
POST /auth/login with wrong password → 401
POST /auth/login with unknown email → 401
```

## Authentication

```text
GET /vendors without token → 401
GET /vendors with invalid token → 401
GET /vendors with valid token → 200
```

## Authorization

Create User A and User B. Create a vendor using User A, then attempt to access it using User B's JWT.

Expected:

```text
User A → allowed
User B → denied
```

This verifies resource-level authorization.

---

# 🧮 SQL Concepts Practiced

### SELECT

```sql
SELECT * FROM "Vendor";
```

### WHERE

```sql
SELECT *
FROM "Vendor"
WHERE "userId" = 1;
```

### ORDER BY

```sql
SELECT *
FROM "Vendor"
ORDER BY "createdAt" DESC;
```

### LIMIT

```sql
SELECT *
FROM "Vendor"
LIMIT 10;
```

### JOIN

```sql
SELECT
    u.name,
    v.name AS vendor_name
FROM "User" u
JOIN "Vendor" v
    ON u.id = v."userId";
```

### GROUP BY

Count vendors per user:

```sql
SELECT
    "userId",
    COUNT(*) AS vendor_count
FROM "Vendor"
GROUP BY "userId";
```

### HAVING

Find users with more than five vendors:

```sql
SELECT
    "userId",
    COUNT(*) AS vendor_count
FROM "Vendor"
GROUP BY "userId"
HAVING COUNT(*) > 5;
```

---

# 🔍 Example Interview Architecture Explanation

> "I built a Vendor Onboarding REST API using Node.js, Express, PostgreSQL and Prisma. Users can register and authenticate using JWT, and authenticated users can create and manage vendors. Each vendor belongs to a user and has an onboarding record. I separated controllers from services so controllers handle the HTTP layer while services contain business logic and database operations. Vendor and onboarding creation uses a Prisma transaction so both records are created atomically. I also implemented ownership checks so users cannot access another user's vendors and centralized error handling using a custom AppError."

---

# 📚 Backend Concepts Demonstrated

### Node.js

- Asynchronous programming
- Promises
- `async/await`
- Modules
- Environment variables

### Express

- Routing
- Middleware
- Controllers
- Error middleware
- Request/response lifecycle

### HTTP

- GET
- POST
- PATCH
- DELETE
- HTTP status codes
- Authorization headers

### Authentication

- bcrypt
- Password hashing
- Password comparison
- JWT
- Bearer authentication

### Authorization

- Resource ownership
- User-specific queries
- Access control

### PostgreSQL

- Tables
- Rows
- Primary keys
- Foreign keys
- Unique constraints
- Relationships
- Indexes
- JOIN
- GROUP BY
- HAVING
- Transactions

### Prisma

- Models
- Relations
- Queries
- `findUnique`
- `findFirst`
- `findMany`
- `create`
- `update`
- `delete`
- `$transaction`

---

# 🚧 Future Improvements

Possible production improvements:

- Request validation library
- Automated unit tests
- Integration tests
- Swagger/OpenAPI documentation
- Refresh tokens
- Rate limiting
- Structured logging
- Redis caching
- Background job processing
- Docker
- CI/CD
- Production deployment
- Monitoring and observability

These are outside the core scope of the current project.

---

# 🎯 Learning Outcome

The goal is to understand the complete backend flow:

```text
HTTP
 ↓
Express
 ↓
Middleware
 ↓
Controller
 ↓
Service
 ↓
Prisma
 ↓
PostgreSQL
```

and understand why each layer exists, how data moves through the system, how authentication and authorization work, how relational data is modeled, and how transactions protect database consistency.

---

## 👨‍💻 Author

**Avishek Mukherjee**

Backend Engineering Project — VendorAPI
