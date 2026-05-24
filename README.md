# 🚀 Issue Tracker Application

A modern full-stack **Issue Tracker Application** built with **React + Vite**, **Express.js**, and **MongoDB/MySQL** that helps teams efficiently manage software issues, bugs, and development workflows.

This project includes secure authentication, advanced issue management, analytics dashboards, live team activity tracking, notifications, dark/light mode support, reusable UI components, and responsive design.

---

# 📌 Features

## ✅ Core Features

### 🔐 Authentication & Authorization

* User Registration & Login
* JWT-based Authentication
* Secure Password Hashing using bcrypt
* Protected Routes & Middleware
* Session Persistence
* Role-based Access Ready Architecture

### 📝 Issue Management (CRUD)

* Create New Issues
* Read/View All Issues
* Update Existing Issues
* Delete Issues
* Issue Detail View
* Mark Issues as:

  * Open
  * In Progress
  * Resolved
  * Closed

### 🎯 Advanced Issue Features

* Issue Priority Levels:

  * Low
  * Medium
  * High
  * Critical
* Severity Indicators
* Search Issues by Title/Keyword
* Filter Issues by:

  * Status
  * Priority
  * Severity
  * Assigned User
* Debounced Search Optimization for Better API Performance
* Pagination Support for Large Datasets
* Confirmation Modals for Critical Actions

---

# 📊 Analytics Dashboard

The application includes a professional analytics section with visual insights for project monitoring.

### Dashboard Includes:

* Total Issues Overview
* Open vs Resolved Issues
* Priority Distribution Charts
* Team Productivity Metrics
* Status-Based Statistics
* Real-Time Summary Cards
* Progress Tracking Components

### Charts & Visualizations

* Pie Charts
* Bar Charts
* Activity Graphs
* Issue Status Analytics
* Team Performance Insights

---

# 👥 Live Team Activity System

A dedicated activity section provides visibility into team collaboration.

### Team Activity Features

* Real-Time Team Activity Feed
* Recently Updated Issues
* User Action Tracking
* Assigned Issue Monitoring
* Collaborative Workflow Visualization
* Recent Login & Activity Monitoring

---

# 🔔 Notification System

The application includes a modern notification feature to improve workflow awareness.

### Notification Features

* Real-Time Notifications
* Issue Status Update Alerts
* Assignment Notifications
* Priority Change Notifications
* Interactive Notification UI
* Notification Badge Indicators

---

# 🎨 UI/UX Features

### Modern Interface

* Responsive Design
* Clean Dashboard Layout
* Reusable Components
* Smooth Animations using Framer Motion
* Professional Sidebar Navigation
* Interactive Cards & Tables

### Theme Support

* 🌙 Dark Mode
* ☀️ Light Mode
* Theme Persistence
* Custom Theme Context Management

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite.js
* TypeScript
* Tailwind CSS
* Framer Motion
* Axios
* React Router DOM
* React Icons
* Context API / Zustand (Optional State Management)

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt.js
* REST API Architecture

## Database

* MongoDB + Mongoose

> MySQL support can also be integrated depending on project requirements.

---

# 📂 Project Structure

```bash
issue-tracker/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/issue-tracker.git
cd issue-tracker
```

---

# 🔧 Backend Setup

## Install Backend Dependencies

```bash
cd backend
npm install
```

## Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Run Backend Server

```bash
npm run dev
```

Server will run on:

```bash
http://localhost:5000
```

---

# 💻 Frontend Setup

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Run Frontend

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# 🔑 API Features

## Authentication APIs

* Register User
* Login User
* Get Authenticated User

## Issue APIs

* Create Issue
* Get All Issues
* Get Single Issue
* Update Issue
* Delete Issue
* Search & Filter Issues

---

# 📈 Performance Optimizations

* Debounced Search Requests
* Optimized API Calls
* Reusable Components Architecture
* Lazy Loading Ready Structure
* Efficient State Management
* Pagination for Better Scalability

---

# 📤 Export Features

The application supports exporting issue data.

### Supported Formats

* CSV Export
* JSON Export

---

# 🔒 Security Features

* Password Hashing with bcrypt
* JWT Authentication
* Protected API Routes
* Input Validation
* Error Handling Middleware
* Environment Variable Protection

---

# 🌐 Deployment

This application can be deployed using:

## Frontend Deployment

* Vercel
* Netlify

## Backend Deployment

* Render
* Railway
* AWS
* DigitalOcean

---

# 📷 Application Modules

## Included Pages

* Authentication Pages
* Dashboard
* Issue Management
* Analytics Page
* Team Activity Section
* Notifications Center
* Settings Page
* User Profile

---

# 🧪 Future Improvements

* Real-Time Socket.IO Integration
* Email Notifications
* Role-Based Access Control
* Drag & Drop Kanban Board
* File Upload Support
* Comments & Discussions
* Multi-Project Support
* Mobile App Version

---

# 📚 Learning Highlights

This project demonstrates:

* Full-Stack Development Skills
* REST API Design
* Authentication & Security
* State Management
* Responsive UI/UX Design
* Data Visualization
* CRUD Operations
* Scalable Folder Architecture
* Team Collaboration Features

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

Developed by **Dilu Tharushika**

* GitHub: [https://github.com/your-username](https://github.com/your-username)
* LinkedIn: [https://linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)

---


