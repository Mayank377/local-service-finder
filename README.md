# 🏠 Local Service Finder

A full-stack web application that connects customers with trusted local service providers such as electricians, plumbers, carpenters, painters, cleaners, mechanics, tutors, and many more.

## 🚀 Features

- 🔐 User Authentication (Register & Login)
- 👤 JWT-based Authentication
- ➕ Add New Service
- ✏️ Edit Existing Service
- 🗑️ Delete Service
- 📋 View All Services
- 👨‍🔧 My Services Dashboard
- ⭐ Provider Ratings
- ✔️ Verified Provider Badge
- ❤️ Favorite Providers
- 🌙 Dark Mode
- 📱 Responsive Design
- 📢 Toast Notifications
- 📂 MongoDB Database
- ⚡ REST API using Express.js

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- Font Awesome

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- dotenv

---

## 📁 Project Structure

```
local-service-finder/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── public/
│   ├── seed.js
│   ├── server.js
│   └── .env
│
├── FRONTEND/
│   ├── lsf.html
│   ├── lsf.css
│   ├── lsf.js
│   ├── login.html
│   ├── register.html
│   ├── login.js
│   ├── register.js
│   └── assets/
│
├── README.md
├── package.json
└── .gitignore
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/Mayank377/local-service-finder.git
```

Move into the project folder

```bash
cd local-service-finder
```

---

## Backend Setup

Navigate to backend

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend

```bash
npm run dev
```

or

```bash
node server.js
```

---

## Frontend

Open

```
FRONTEND/lsf.html
```

using Live Server or any local web server.

---

## Seed Sample Data

Generate sample providers

```bash
node seed.js
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/users/register | Register User |
| POST | /api/users/login | Login User |

### Services

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/services | Get All Services |
| GET | /api/services/:id | Get Service |
| POST | /api/services | Add Service |
| PUT | /api/services/:id | Update Service |
| DELETE | /api/services/:id | Delete Service |

---

## Screenshots

### Home Page

_Add screenshot here_

### Login

_Add screenshot here_

### Register

_Add screenshot here_

### Services

_Add screenshot here_

---

## Future Enhancements

- Google Maps Integration
- Online Booking
- Payment Gateway
- Admin Dashboard
- Service Reviews
- Image Upload
- WhatsApp Integration
- Email Notifications
- Live Chat
- Search & Filter Improvements

---

## Learning Outcomes

This project demonstrates practical implementation of:

- Full Stack Development
- REST APIs
- MongoDB CRUD Operations
- Authentication & Authorization
- Responsive UI Design
- Modern JavaScript
- Git & GitHub
- MVC Architecture

---

## Author

**Mayank Vaish**

- GitHub: https://github.com/Mayank377

---

## License

This project is developed for educational and portfolio purposes.

© 2026 Mayank Vaish