# Equipment Rental System

A full-stack application for managing equipment rentals, featuring a secure NestJS backend and a modern React/Next.js frontend.

---

## 📂 Project Structure
* **`equipment-rental-backend`**: NestJS API handling Authentication, Database (PostgreSQL), and Email services.
* **`equipment-rental-frontend`**: React/Next.js interface for Customers and Admins.

---

## 🛠 Tech Stack
- **Backend:** NestJS, PostgreSQL, TypeORM.
- **Security:** Bcrypt (Password Hashing).
- **Frontend:** React / Next.js.
- **Testing:** Mailtrap (SMTP Sandbox).

---

## 🚀 Installation & Setup

### 1. Backend Setup
```bash
# Navigate to backend folder
cd equipment-rental-backend

# Install dependencies
npm install

# Configure your .env file with your credentials:
# DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
# MAIL_USER, MAIL_PASS

# Run in development mode
npm run start:dev


# Navigate to frontend folder
cd equipment-rental-frontend

# Install dependencies
npm install

# Run the development server
npm run dev

### 2. frontend Setup
# Navigate to frontend folder
cd equipment-rental-frontend

# Install dependencies
npm install

# Run the development server
npm run dev

