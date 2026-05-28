# ASTRA E-Commerce Website

ASTRA is a modern, premium full-stack E-Commerce application built using the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS.

## Features

- **Authentication & Authorization**: User registration, login, JWT-based auth, protected routes, and role-based access control (User and Admin roles).
- **User Experience**:
  - Browse and search products.
  - Filter products by category.
  - Interactive product details page.
  - Fully functional shopping cart (add/update/remove items).
  - Elegant multi-step checkout process.
  - Order history and order tracking with a visual stepper.
- **Admin Dashboard**:
  - Full product management (Add, Edit, Delete products).
  - Order management (View and update order status like Processing, Shipped, Delivered).
  - User management.
  - Dynamic summary stats (total revenue, sales count, order counts).

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS v4, React Router DOM, Axios, Context API (Auth, Cart, Toasts).
- **Backend**: Node.js, Express.js, MongoDB + Mongoose, JSON Web Tokens (JWT), bcryptjs for password hashing.

## Project Structure

```
├── backend/          # Express backend (API routes, controllers, models)
├── frontend/         # React frontend (Vite, Tailwind, Context, Pages)
├── package.json      # Root package.json
└── .gitignore        # Git ignore rules
```

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas URI

### Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/tuhin-ghorui/E-Commerce-Website.git
   cd E-Commerce-Website
   ```

2. Install dependencies:
   ```bash
   # In root directory
   npm install
   
   # In frontend directory
   cd frontend && npm install
   
   # In backend directory
   cd ../backend && npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` folder with the following:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/astra-ecommerce
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. Seed the database (Optional):
   ```bash
   cd backend
   npm run seed
   ```

5. Run the application (concurrently):
   ```bash
   cd ..
   npm run dev
   ```
   The backend will run on `http://localhost:5000` and frontend on `http://localhost:5173`.
