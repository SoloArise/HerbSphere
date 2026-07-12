# 🌿 HerbSphere

<div align="center">

### AI-Powered Business Management Platform for the Herbal & Aromatics Industry

Manage products, customers, and orders while leveraging AI to generate marketing content and business insights.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC?logo=tailwind-css)
![Status](https://img.shields.io/badge/Status-Week%204%20Completed-success)

</div>

---

# 📖 About

**HerbSphere** is a full-stack AI-powered web application developed as part of the **TBI-GEU Summer Internship Program (SIP 2026)**.

The platform helps businesses in the **Herbal & Aromatics sector** digitize their operations by providing tools to manage products, customers, orders, and business analytics. It also integrates AI to generate marketing content that helps businesses improve their online presence.

---

# ✨ Current Features

## 📦 Product Management

- Add products
- Update product details
- Delete products
- View product catalog
- Search products

---

## 👥 Customer Management

- Customer records
- Customer profile management
- Purchase history
- Customer listing

---

## 📦 Order Management

- Track orders
- View order details
- Update order status
- Order history

---

## 📊 Dashboard

- Business overview
- Product statistics
- Customer statistics
- Sales insights
- Interactive dashboard UI

---

## 🤖 AI Marketing Assistant

Generate AI-powered:

- Product Descriptions
- Social Media Captions
- Marketing Copy
- Promotional Content

*(Gemini API Integration - In Progress)*

---

# 🚀 Tech Stack

## Frontend

- React.js
- React Router
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express.js
- REST API

## Database

- MongoDB *(Coming in Week 5)*
- Currently using in-memory storage for API development

## Authentication

- JWT Authentication *(Upcoming)*

## AI

- Google Gemini API

## Tools

- Git & GitHub
- Postman
- Thunder Client
- VS Code
- Figma

---

# 📂 Project Structure

```
HerbSphere/
│
├── app/                  # Next.js App Router Pages
├── components/           # React Frontend Components
│   ├── ui/               # Reusable UI Controls (Loader, Toast)
│   └── ...
│
├── backend/
│   ├── config/
│   │   └── db.js         # MongoDB/Mongoose Connection Setup
│   ├── models/
│   │   ├── Product.js    # Product Schema & Model
│   │   ├── Customer.js   # Customer Schema & Model
│   │   └── Order.js      # Order Schema & Model
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── customerController.js
│   │   └── orderController.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── insightRoutes.js
│   ├── middleware/
│   │   └── errorMiddleware.js
│   ├── data/             # Static/Fallback Data Templates
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# 🖥️ Frontend Progress (Week 2 & Week 3)

✅ Responsive Navigation

✅ Hero Section

✅ Product Cards

✅ Footer

✅ Multiple Pages

- Home
- Dashboard
- Products
- Customers
- Orders
- AI Marketing
- About

✅ Reusable UI Components

- Button
- Input
- Modal
- Loader
- Toast

✅ Responsive Design

- Mobile
- Tablet
- Desktop

✅ Dark / Light Mode

---

# ⚙️ Backend Progress (Week 4)

Implemented REST APIs using Express.js.

### Product Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get product by ID |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/products/search | Search products |

Additional Features

- Error Handling Middleware
- HTTP Status Codes
- CORS Configuration
- API Testing with Postman
- Frontend connected to backend
- Loading States
- Toast Notifications

---

# ⚙️ How to Run Backend Locally

To run the backend server locally on your machine, follow these steps:

### 1. Navigate to the Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
Ensure you have Node.js installed, then run:
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the `backend/` directory. You can copy the template `.env.example` file:
```bash
cp .env.example .env
```
Ensure the `.env` file contains the following configurations:
```env
PORT=5000
FRONTEND_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```

### 4. Start the Backend Server
- **Development Mode** (runs with `nodemon` for automatic restarts on code changes):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

The backend API will start running at `http://localhost:5000`. You can verify it by opening `http://localhost:5000/` in your browser, which should return:
```json
{
  "success": true,
  "message": "HerbSphere API is running"
}
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/SoloArise/HerbSphere.git
```

---

## Install Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Install Backend

```bash
cd backend
npm install
npm run dev
```

---

# 📅 Internship Progress

| Week | Status |
|-------|--------|
| Week 1 | ✅ Project Planning & Repository Setup |
| Week 2 | ✅ Frontend Skeleton |
| Week 3 | ✅ UI Components & Responsive Design |
| Week 4 | ✅ Backend REST APIs |
| Week 5 | ✅ MongoDB & Mongoose Integration |
| Week 6 | ✅ Authentication |
| Week 7 | 🔄 AI Integration |
| Week 8 | 🔄 Deployment |
| Week 9 | 🔄 Final Presentation |

---

# MongoDB Atlas & Mongoose Database Setup

The backend has been upgraded from volatile in-memory arrays to a fully persistent, production-ready **MongoDB** database.

## 1. Database Choice & Justification

We chose **MongoDB** as our database for the following reasons:
- **Flexible Document Schema**: Herbal product management involves diverse products with different attribute structures (e.g., teas, powders, capsules, essential oils). A document database allows storing fields dynamically without rigid, complex migration operations.
- **Rich JSON Ecosystem Integration**: Since Next.js and Node.js use Javascript, JSON maps directly from MongoDB documents to the frontend without complex translation, optimizing data fetching speeds.
- **Object Modeling via Mongoose**: Mongoose provides strong schema-based validation rules, automatic conversion of IDs to string formats (virtual `id`), and built-in `populate` functions for relational querying (e.g., resolving `customer` and `products` references in an `Order` document).

## 2. Set Up the Database

To set up the persistent database for local development:

### 1. MongoDB Atlas Configuration
1. **Create an Account**: Register at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Build a Cluster**: Create a **Free Shared M0 Cluster**.
3. **Database User**: Add a database user with read/write permissions (use password authentication).
4. **Network Access**: Add your current IP address to the Access List (or `0.0.0.0/0` to allow access from any machine).
5. **Get Connection URI**: Click "Connect" -> "Drivers" -> Copy the connection string.

### 2. Environment Configuration
Create a `.env` file inside the `backend/` directory. Fill in your MongoDB connection details:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/herbsphere?retryWrites=true&w=majority
FRONTEND_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```
*Note: The `.env` file is gitignored. Ensure you do not commit active credentials.*

### 3. Data Seeding
Upon connecting to the database for the first time, the server will automatically run `seedDatabase()` to populate initial collections for `Product`, `Customer`, and `Order` if they are empty, giving you a functional database instantly.

## 3. Database Relationship Diagram

Below is the visual schema showing our database entities, their fields, and relationships:

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/852fe536-6c96-482c-be56-f654799f776d"
    alt="HerbSphere Database Schema Diagram"
    width="1000"
  />
</p>


### Relationship Rules:
- **Customer to Order**: A 1-to-many (`1 ----- *`) relationship. One customer can place multiple orders (tracked via the `customer` field in the Order model pointing to a Customer document).
- **Product to Order**: A many-to-many (`* ----- *`) relationship implemented via an embedded array of product subdocuments inside the Order schema.

## 4. Schema Definitions
- `name` (String, Required)
- `category` (String, Required)
- `description` (String, Required)
- `price` (Number, Required, >= 0)
- `stock` (Number, Required, >= 0, Integer)
- `image` (String, Optional)
- `createdAt` / `updatedAt` (Timestamps)

### Entity 2: Customer (`models/Customer.js`)
- `name` (String, Required)
- `email` (String, Required, Unique, Email format)
- `phone` (String, Required)
- `address` (String, Required)
- `createdAt` / `updatedAt` (Timestamps)

### Entity 3: Order (`models/Order.js`)
- `customer` (ObjectId Reference, Ref: Customer, Required)
- `products` (Array of subdocuments containing `{ product: ObjectId Ref: Product, quantity: Number }`)
- `totalAmount` (Number, Required, >= 0)
- `status` (String, Enum: `['Pending', 'Processing', 'Fulfilled']`, Default: `Pending`)
- `createdAt` / `updatedAt` (Timestamps)

---

# 🔐 Week 6: Authentication System (JWT & OAuth)

The application has been upgraded with a secure, production-grade end-to-end Authentication & Authorization system.

## 1. Features
- **Local Credentials Auth**: Email & Password registration (using `bcrypt` salt hashing) and Login (exchanging credentials for a stateless JWT).
- **JWT Protection**: Protected routes (`/api/dashboard`, `/api/customers`, `/api/orders`) intercept requests via `authMiddleware.js` and verify the JWT header payload. Bypassed requests receive a `401 Unauthorized` response.
- **Frontend Guards**: Any unauthenticated client trying to access dashboard, inventory, customers, or orders is redirected to `/login` via `ProtectedRoute.jsx`.
- **Google OAuth Integration**: Built-in OAuth flow utilizing `passport` and `passport-google-oauth20`.
  - *Local Mock Mode*: If client credentials are not configured, the server automatically routes to a local mock Google Account Chooser screen at `/api/auth/mock-google-consent` to simplify offline testing and deliverable validation.
- **Rate Limiting**: Integrated `express-rate-limit` restricting credentials endpoints (`/api/auth/login` and `/api/auth/register`) to 5 attempts per 15-minute window, returning a `429 Too Many Requests` status code.
- **Input Validation**: `express-validator` validates fields (RFC standard emails, minimum 8 characters password) before hitting controllers.

## 2. API Endpoints
- `POST /api/auth/register` (Public) - Register new user
- `POST /api/auth/login` (Public, Rate Limited) - Authenticate credentials and return JWT
- `GET /api/auth/me` (Private) - Fetch profile for authenticated JWT user
- `GET /api/auth/google` (Public) - Initiate Google OAuth login
- `GET /api/auth/google/callback` (Public) - Google OAuth redirection handler

---

# 🤖 Centralized Error Handling

The application features a centralized Express error handling middleware (`middleware/errorMiddleware.js`) which captures:
- **Validation Errors**: Translates Mongoose validation messages into user-friendly `400 Bad Request` messages.
- **Invalid MongoDB ObjectIds**: Intercepts `CastError` and returns `400 Bad Request` when queries are passed an invalid hex string.
- **Resource Not Found**: Automatically handles queries for items that do not exist (returns `404 Not Found`).
- **Duplicate Key Constraints**: Detects MongoDB `11000` codes (e.g. duplicate customer emails) and reports `400 Bad Request`.
- **Internal Server Errors**: Logs details for debugging and outputs a generic `500 Server Error` payload to clients.

---

# 📷 Screenshots

Coming Soon

- Home Page
- Dashboard
- Products
- Orders
- Customers
- AI Generator
- Dark Mode
- Mobile View

---

# 🎯 Target Users

- Herbal Product Manufacturers
- Aromatics Businesses
- Small & Medium Enterprises
- Startups
- Retailers
- Local Business Owners

---

# 🔮 Upcoming Features

- AI Product Recommendation
- Sales Analytics
- Report Generation
- Cloud Deployment
- Role-Based Access Control


---

<div align="center">

### 🌿 HerbSphere

**Empowering Herbal Businesses with AI**

Made with ❤️ using React, Express, MongoDB & Gemini AI

</div>
