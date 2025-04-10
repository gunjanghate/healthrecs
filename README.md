# 🩺 HealthRecs

A full-stack web application for managing health records using OCR. The system automatically extracts text from uploaded images (e.g., prescriptions, reports) and fills out patient forms with relevant data. Built with a modern stack: **React + Vite** frontend, **Node.js + Express** backend, **MongoDB** database, and a **Python FastAPI** OCR microservice.

---

## ✨ Features

- Upload medical documents (images/PDFs)
- OCR using Python (Tesseract or EasyOCR)
- Auto-fill patient health record forms
- Store and retrieve records from MongoDB
- RESTful API with Express
- Clean and modern UI with React + Vite

---

## 🛠️ Tech Stack

**Frontend**:
- React
- Vite
- TailwindCSS (optional)
- Axios

**Backend**:
- Node.js
- Express.js
- MongoDB (with Mongoose)

**OCR Microservice**:
- Python 3.x
- FastAPI
- Tesseract OCR / EasyOCR

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js and npm
- Python 3.x
- MongoDB (local or Atlas)
- Tesseract OCR installed (if using `pytesseract`)

---

## 🧩 Install Dependencies

#### 1. Frontend

```bash
cd healthrecs
npm install
