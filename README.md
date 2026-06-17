# FLOWFORGE

A Full-Stack Role-Based Freelancer Collaboration Platform (Upwork + Jira Inspired)

🌐 Live Demo: https://flowforge-frontend-5fph.onrender.com  
🔗 Backend API: https://flowforge-backend-ud7x.onrender.com  

---

## Overview

FlowForge is a full-stack web application designed to simulate a real-world freelancer-client collaboration system. It bridges project management and freelance hiring by enabling structured workflows for clients and freelancers.

The platform focuses on role-based access, project lifecycle management, and application tracking, providing a simplified version of platforms like Upwork combined with Jira-style workflows.

---

## ⚙️ Tech Stack

### Frontend
- React (Vite)
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### Deployment
- Render (Frontend + Backend)
- MongoDB Atlas

---

## Key Features

### 👨‍💼 Client
- Create / Update / Delete projects
- View applicants for each project
- Accept / Reject freelancers
- Post project updates after acceptance

### 👨‍💻 Freelancer
- Browse available projects
- Apply to projects
- Track application status (Pending / Accepted / Rejected)
- View project updates after acceptance

---

## System Architecture

Frontend (React) → REST API (Express.js) → MongoDB

---

## 🔐 Authentication

- JWT-based authentication
- Role-based access (Client / Freelancer)
- Protected API routes using middleware

---

## 📊 Core Modules

### 1. Project Management
Clients can fully manage projects with CRUD operations.

### 2. Application System
Freelancers can apply and clients can manage applications.

### 3. Collaboration Workspace
Accepted freelancers can view project updates from clients.

---

## Problem Statement

Most freelance platforms are either too complex or too basic.

FlowForge solves this by providing:
> A clean, structured collaboration system between clients and freelancers.

---

## Live Demo

👉 https://flowforge-frontend-5fph.onrender.com

---

## 📁 Folder Structure
FlowForge/

├── client        → React Frontend
├── backend       → Node + Express API
└── README.md

---

## 🧩 Highlights

- Role-based authentication system
- Full-stack MERN architecture
- Real-world workflow simulation
- Deployed production-ready application
- Clean separation of client and freelancer logic

---

## 📸 Screenshots
<div style="display: flex; gap: 10px;">
<img src="https://github.com/user-attachments/assets/c4043bdc-69f6-4dcf-9719-aaf655f84ead" width="300" height="300"/>
<img src="https://github.com/user-attachments/assets/ef684525-8d7b-460f-a34a-2d78c73143e8" width="300" height="300"/>
<img src="https://github.com/user-attachments/assets/aaaa6375-8af9-4662-9302-20d6e2bab99e" width="300" height="300"/>
</div>

---

## 🔮 Future Improvements

- Real-time chat system (Socket.io)
- Notifications system
- File uploads for projects
- Advanced search & filtering
- Enhanced UI/UX improvements

---

## 👨‍💻 Author

Built by **Shrutika Dahale**

---

## ⭐ Support

If you like this project, consider giving it a star ⭐ on GitHub.
