# 📚 Book Review API

A RESTful API built with **Node.js**, **Express**, and **MongoDB** that allows users to sign up, log in, browse books, and post reviews. Authenticated users can also manage their own reviews.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- dotenv for environment configuration

---

## 🔧 Setup Instructions

1. Clone the repo and do npm i to install dependencies
2. Create a .env file
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
3. Run locally with npm run start

## API Endpoints

# 🔐 Authentication
POST   /auth/signup                      → Register a new user  
POST   /auth/login                       → Authenticate and get JWT token  

# 📚 Books
POST   /books                       → Add a new book (auth required)  
GET    /books                       → Get all books (with pagination & filters: author, genre)  
GET    /books/:id                   → Get book details by ID (with avg rating & reviews)

# 💬 Reviews
POST   /books/:id/reviews           → Submit a review (1 per user per book, auth required)  
PUT    /reviews/:id                 → Update your own review  
DELETE /reviews/:id                 → Delete your own review  

# 🔍 Search
GET    /search?query=your_keyword  → Search books by title or author (partial, case-insensitive)

## Database Schema

// User
{
  name: String,
  email: String,
  password: String,
  createdAt: Date
}

// Book
{
  title: String,
  author: String,
  genre: String,
  description: String,
  createdAt: Date
}

// Review
{
  user: ObjectId,
  book: ObjectId,
  rating: Number,
  comment: String,
  createdAt: Date
}

