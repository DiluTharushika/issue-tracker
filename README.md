# 🚀 Issue Tracker — Full Stack MERN CRUD Application

A modern and scalable **Issue Tracker Application** built using the **MERN Stack** as an interview assignment project.
This application demonstrates real-world software engineering practices including **authentication, CRUD operations, REST APIs, analytics dashboards, protected routes, filtering, responsive UI, and scalable folder architecture**.

Designed with a clean and professional UI using **React, TypeScript, Tailwind CSS, and Framer Motion**.

---

# 🌟 Project Highlights

✅ Full Stack MERN Architecture
✅ JWT Authentication & Protected Routes
✅ Complete CRUD Functionality
✅ Analytics Dashboard
✅ Search, Filter & Pagination
✅ Responsive Modern UI
✅ Dark / Light Theme Support
✅ Reusable Component Architecture
✅ Production-Level Folder Structure

---

# 📌 Assignment Requirements Covered

This project was developed as part of a technical interview assignment.

### Core Functionalities

* Create Issues
* Read/View Issues
* Update Issues
* Delete Issues
* Authentication System
* REST API Integration
* MongoDB Database Integration
* Issue Status Tracking
* Search & Filtering

---

# ✨ Features

## 🔐 Authentication System

* User Registration & Login
* JWT-based Authentication
* Password Hashing using bcrypt
* Protected API Routes
* Persistent User Sessions

---

## 📝 Issue Management

Users can:

* Create new issues
* Edit issue details
* Delete issues with confirmation
* Update issue statuses
* Search issues by keywords
* Filter issues by:

  * Status
  * Priority
  * Severity
* Paginate issue lists

### Supported Issue Statuses

* Open
* In Progress
* Resolved
* Closed

---

## 📊 Dashboard & Analytics

The dashboard provides a visual overview of project issues.

### Analytics Includes

* Total Issues Count
* Open Issues Count
* Resolved Issues Count
* Priority Distribution
* Status Summary Cards
* Visual Analytics Components

---

## 👥 Application Modules

### 🏠 Dashboard

Overview of issue statistics and analytics.

### 📝 Issues Management

Manage and track all issues efficiently.

### 📊 Analytics Page

Visual representation of issue trends and distributions.

### ⚙️ Settings Page

Application preferences and configurations.

### 👤 User Profile Page

Displays authenticated user information.

---

# 🎨 UI/UX Features

* Fully Responsive Design
* Modern Dashboard Layout
* Smooth Page Animations using Framer Motion
* Clean Sidebar Navigation
* Reusable UI Components
* Dark / Light Theme Toggle
* User-Friendly Experience

---

# ⚠️ Known Limitation

> 🔔 The notification system UI has been implemented, but real-time backend integration is still pending.
> Planned implementation will use **Socket.io** for real-time notifications.

---

# 🛠️ Tech Stack

## Frontend

* React.js (Vite)
* TypeScript
* Tailwind CSS
* Axios
* React Router DOM
* Framer Motion

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt.js

## Database

* MongoDB
* Mongoose ODM

---

# 📸 Screenshots

## 🏠 Dashboard

```md
frontend/src/screenshots/dashboard.png
```

## 📊 Analytics Page

```md
frontend/src/screenshots/analytics.png
```

## 📝 Issues Page

```md
frontend/src/screenshots/issues.png
```

## ⚙️ Settings Page

```md
frontend/src/screenshots/settings.png
```

---

# 📂 Project Structure

```bash
issue-tracker/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.tsx
│
├── screenshots/
├── README.md
└── package.json
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/DiluTharushika/issue-tracker.git
cd issue-tracker
```

---

# 🔧 Backend Setup

## Install Dependencies

```bash
cd backend
npm install
```

## Create Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Run Backend Server

```bash
npm run dev
```

---

# 💻 Frontend Setup

## Install Dependencies

```bash
cd frontend
npm install
```

## Run Frontend

```bash
npm run dev
```

---

# 📤 Export Features

The application supports:

* Export Issues as CSV
* Export Issues as JSON

---

# 🔒 Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Protected API Routes
* Input Validation
* Secure Environment Variables

---

# 🔮 Future Improvements

* 🔔 Real-time Notifications (Socket.io)
* 💬 Comments & Discussion System
* 📎 File Upload Support
* 🧑‍💼 Role-Based Access Control (RBAC)
* 📊 Advanced Analytics Dashboard
* 📱 Mobile Application Version
* 📧 Email Notifications

---

# 🧪 API Features

RESTful APIs implemented for:

* Authentication
* User Management
* Issue Management
* Dashboard Analytics

---

# 🚀 Deployment

Frontend and backend can be deployed using:

* Vercel
* Netlify
* Render
* Railway
* MongoDB Atlas

---

# 👨‍💻 Author

## Dilu Tharushika

* GitHub: [DiluTharushika GitHub](https://github.com/DiluTharushika?utm_source=chatgpt.com)
* LinkedIn: [LinkedIn Profile](https://linkedin.com/in/your-profile?utm_source=chatgpt.com)

---

# 📄 License

This project was created for educational and interview assignment purposes.
