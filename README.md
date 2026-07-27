# 🏥 MediBridge - Doctor Appointment Booking System

MediBridge is a full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) web application that simplifies the process of booking doctor appointments online. It provides dedicated dashboards for **Patients**, **Doctors**, and **Administrators**, enabling efficient appointment management and healthcare services.

---

## 🚀 Features

### 👤 Patient
- Register and Login securely
- Browse available doctors
- Book appointments
- View appointment history
- Cancel appointments
- Manage profile

### 👨‍⚕️ Doctor
- Secure authentication
- Doctor dashboard
- View scheduled appointments
- Manage availability
- Update profile information

### 👨‍💼 Admin
- Admin dashboard
- Add new doctors
- Manage doctor profiles
- View all appointments
- Monitor users

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- React Toastify

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Token (JWT)

### Cloud Services
- Cloudinary (Image Uploads)
- Multer

---

## 📂 Project Structure

```
MediBridge/
│
├── frontend/        # Patient Web Application
├── admin/           # Admin Dashboard
├── backend/         # REST API & Database
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/MediBridge.git
cd MediBridge
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 4. Admin Panel

```bash
cd admin
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

ADMIN_EMAIL=your_admin_email

ADMIN_PASSWORD=your_admin_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_name

CLOUDINARY_API_KEY=your_cloudinary_key

CLOUDINARY_SECRET_KEY=your_cloudinary_secret
```

---

## 📸 Screenshots

> *(Add screenshots after deploying the project.)*

| Home | Patient Dashboard |
|------|-------------------|
| Add Screenshot | Add Screenshot |

| Doctor Dashboard | Admin Dashboard |
|-----------------|-----------------|
| Add Screenshot | Add Screenshot |

---

## 🔮 Future Improvements

- 💳 Online Payment Gateway
- 📧 Email Notifications
- 📱 SMS Appointment Reminders
- ⭐ Doctor Ratings & Reviews
- 🎥 Video Consultation
- 📅 Google Calendar Integration

---

## 👩‍💻 Author

**Yashaswini Karanam**

B.Tech Computer Science Engineering

GitHub: https://github.com/yashaswinikaranam

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!
