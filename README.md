# BookNook — Full-Stack Online Library

A modern online library platform where readers can discover books, manage their own collections, borrow available copies, and track returns. BookNook combines a responsive Next.js application with a dedicated Express API, MongoDB persistence, and secure authentication.

## Project Links:
- **[Live Application](https://booknook-rowshan.vercel.app/)**  
- **[Client Repository](https://github.com/rowshannahar3/booknook-client)**  
- **[Server Repository](https://github.com/rowshannahar3/booknook-server)**

## Key Features

### Authentication & Authorization
- Email/password authentication and Google OAuth using Better Auth.
- MongoDB-backed session management with persistent authentication across page reloads.
- JWT-based authentication for securing Express API endpoints.
- Protected routes with post-login navigation to the originally requested destination.
- Ownership-based authorization to prevent unauthorized book modifications.

### Book Discovery & Management
- Dynamic homepage featuring a Swiper.js hero slider and the six latest book arrivals.
- Searchable, filterable, and sortable book catalogue.
- Detailed book pages with descriptions, categories, authors, and availability.
- Complete CRUD operations for managing personally added books.
- Book cover image uploads using ImgBB.

### Borrowing & Inventory Management
- Borrow and return books through interactive confirmation dialogs.
- Automatic seven-day return date calculation.
- Real-time available-copy tracking.
- Atomic inventory updates using MongoDB's `$inc` operator and conditional updates.
- Duplicate borrowing prevention for the same user and book.
- Availability validation to prevent borrowing when no copies remain.
- Borrowing history with due-date and Due Soon status indicators.

### User Experience
- Responsive layouts for desktop, tablet, and mobile devices.
- Light and dark theme support.
- Framer Motion animations and interactive UI elements.
- Toast notifications for success and error feedback.
- Loading states, custom confirmation modals, and a dedicated 404 page.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript |
| Styling & UI | Tailwind CSS, DaisyUI |
| Authentication | Better Auth, Google OAuth |
| Authorization | JWT, JWKS |
| Backend | Node.js, Express.js |
| Database | MongoDB, MongoDB Adapter |
| Data Fetching | TanStack Query |
| Image Upload | ImgBB |
| UI Interactions | Swiper.js, Framer Motion |

## System Architecture

BookNook separates authentication and application API responsibilities into two layers:

**1. Next.js Application**
- Handles the frontend, routing, and user interactions.
- Manages authentication through Better Auth.
- Stores user sessions in MongoDB through the Better Auth MongoDB adapter.
- Issues short-lived JWTs through the Better Auth JWT plugin.

**2. Express.js API**
- Provides RESTful endpoints for books and borrowing operations.
- Validates incoming JWTs using Better Auth's public JWKS keys.
- Enforces authentication and resource ownership before allowing protected operations.
- Communicates with MongoDB for application data persistence.

**Authentication Flow:**

1. A user authenticates through Better Auth using email/password or Google OAuth.
2. Better Auth establishes a persistent session.
3. The frontend obtains a short-lived JWT when making authenticated API requests.
4. The JWT is sent to the Express API as a Bearer token.
5. Express verifies the token using the corresponding public JWKS keys.
6. Authorized requests proceed to the relevant database operations.

## API Endpoints

The Express backend exposes the following REST API endpoints:

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/books` | Retrieve all books | Public |
| GET | `/books/:id` | Retrieve book details | Public |
| POST | `/books` | Add a new book | Protected |
| PATCH | `/books/:id` | Update a book | Owner only |
| DELETE | `/books/:id` | Delete a book | Owner only |
| POST | `/borrows` | Borrow a book | Protected |
| GET | `/borrows` | Retrieve user's borrowing history | Protected |
| DELETE | `/borrows/:id` | Return a borrowed book | Protected |

## Engineering Highlights

A key focus of BookNook is maintaining inventory consistency and enforcing borrowing rules at the backend level.

- **Atomic inventory updates:** Conditional MongoDB updates with `$inc` prevent available-copy counts from becoming negative when multiple borrowing requests occur.
- **Duplicate borrowing prevention:** A unique compound index on `{ userId, bookId }` prevents the same user from having duplicate active borrowing records for a book.
- **JWT verification:** Protected API requests are validated against Better Auth's JWKS public keys rather than trusting client-side authentication state.
- **Resource ownership:** Book modification and deletion are restricted to the user who created the book.
- **Persistent authentication:** Database-backed sessions allow authenticated users to retain their login state across page reloads.

## Getting Started

### Prerequisites

- Node.js (LTS)
- MongoDB database
- Google OAuth credentials
- ImgBB API key

### 1. Clone the repositories

**Client:**

```bash
git clone https://github.com/rowshannahar3/booknook-client.git
cd booknook-client
npm install
```

**Server:**

```bash
git clone https://github.com/rowshannahar3/booknook-server.git
cd booknook-server
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the client project:

```env
MONGODB_URI=
MONGODB_DB=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

IMGBB_API_KEY=
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Configure the server environment using its own environment file and provide the MongoDB connection, database, and JWT verification configuration required by the backend.

Keep all credentials and secrets out of version control.

### 3. Run the applications

Start the Express server:

```bash
npm run dev
```

Start the Next.js client in a separate terminal:

```bash
npm run dev
```

The client runs at `http://localhost:3000`, while the Express API runs on the configured backend port.

## Design & Development

The user interface was designed in Figma before implementation, with an emphasis on consistent visual hierarchy, reusable UI patterns, responsive layouts, and intuitive navigation.

The application was developed with a separation of frontend, authentication, API, and database responsibilities to keep the codebase maintainable and the application logic organized.

## Future Improvements

- Email verification and password recovery.
- Automated testing for authentication, API authorization, and borrowing workflows.
- Enhanced borrowing analytics and administrative reporting.
- More advanced catalogue discovery and recommendation features.

---

## Author

**Rowshan Nahar**

[GitHub](https://github.com/rowshannahar3) · [LinkedIn](https://www.linkedin.com/in/rowshannahar/)
