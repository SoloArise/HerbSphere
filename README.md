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
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── components/ui/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   │
│   └── public/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
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
| Week 5 | 🔄 MongoDB Integration |
| Week 6 | 🔄 Authentication |
| Week 7 | 🔄 AI Integration |
| Week 8 | 🔄 Deployment |
| Week 9 | 🔄 Final Presentation |

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

- MongoDB Database
- User Authentication
- Admin Dashboard
- AI Product Recommendation
- Inventory Management
- Sales Analytics
- Report Generation
- Cloud Deployment
- Role-Based Access Control

---

# 🤝 Contributing

This project is currently being developed as part of the **TBI-GEU SIP 2026 Internship**.

Suggestions and feedback are always welcome.

---

# 📄 License

This project is developed for educational and internship purposes.

---

<div align="center">

### 🌿 HerbSphere

**Empowering Herbal Businesses with AI**

Made with ❤️ using React, Express, MongoDB & Gemini AI

</div>
