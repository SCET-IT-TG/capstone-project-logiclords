[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/oprogocc)

---

# 🏠 HostelHub - Smart Hostel Management System  
<p align="center">
  <img src="https://img.shields.io/badge/Framework-MERN-orange.svg" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black" />
</p>

A full-stack web application to **digitally manage hostel operations** including fee tracking, complaints, and secure QR-based entry.

## 📌 Overview  

**HostelHub** replaces outdated manual registers and Excel sheets with an **automated, centralized, and scalable system**.  
It improves efficiency, transparency, and security in hostel management.

## ✨ Core Features  
 
- 💰 **Fee Management** – Track payments, dues, and receipts  
- 🛠 **Complaint System** – Raise and resolve student complaints  
- 👤 **Visitor Entry** – Maintain digital visitor logs  
- 📱 **QR-Based Entry** – Secure hostel access system  
- 📊 **Admin Dashboard** – Insights and analytics  

## 🧱 System Architecture  
<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/19f0dadd-c52e-485b-99d2-2049f461e39a" />

## 🛠 Tech Stack  

| Layer | Technology |
|------|-----------|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Tools | QR Code Generator |

## 📂 Project Structure  
📦 HostelHub<br>
 ┣ 📂 client<br>
 ┃ ┣ 📂 src<br>
 ┃ ┗ 📂 public<br>
 ┣ 📂 server<br>
 ┃ ┣ 📂 controllers<br>
 ┃ ┣ 📂 models<br>
 ┃ ┣ 📂 routes<br>
 ┃ ┣ 📂 middleware<br>
 ┃ ┗ 📂 config<br>
 ┣ 📂 uploads<br>
 ┣ 📄 .env<br>
 ┣ 📄 package.json<br>
 ┗ 📄 README.md

## ⚙️ Setup Instructions  

### 🔁 1. Clone Repository  

```bash
git clone https://github.com/SCET-IT-TG/capstone-project-logiclords.git
cd HostelHub
```
## 📦 2. Install Dependencies

To get the project running, you need to install the dependencies for both the backend and the frontend.

### Install Backend
Open your terminal and navigate to the `server` directory:
```bash
cd server
npm install
```
## 🔐 3. Environment Variables

The backend requires certain environment variables to connect to the database and handle security. 

1. Create a `.env` file inside the `server/` directory.
2. Copy and paste the following variables into the file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
## ▶️ 4. Run the Application

To get the full-stack application running, you will need to start both the backend and the frontend servers.

### Start Backend
Open a terminal and run:
```bash
cd server
npm run dev
```
### Start Frontend
Open a terminal and run:
```bash
cd client
npm start
```

## 🔑 Key Modules

HostelHub is built with a modular architecture to handle every aspect of hostel administration:

* **👤 Student Management** A comprehensive database for maintaining student profiles, emergency contacts, and academic records.
    
* **💰 Fee Collection & Tracking** Digital ledger to track payment history, generate invoices, and send reminders for outstanding dues.
    
* **🎫 Complaint Management** An internal ticketing system where students can report maintenance issues and track the status of their requests.
    
* **📖 Visitor Entry Logs** A secure digital register to log guest details, purpose of visit, and entry/exit timestamps.
    
* **🛡️ QR Code Authentication** Advanced security module providing students with unique QR codes for contactless check-ins and identity verification.

## 👥 Team Members & Roles

Our team is composed of dedicated developers and engineers ensuring the stability and growth of **HostelHub**.

| Name | Role |
| :--- | :--- |
| **RANA KISHAN PRAVINBHAI** | Team Lead & QA Engineer |
| **SAVANI KIRTAN CHETANBHAI** | Frontend Developer |
| **KHADELA YUG KAPILBHAI** | MERN Developer |
| **NAGADWALA VEER HARISHKUMAR** | MERN Developer + Testing |
| **KEVADIYA KRISH NITESHBHAI** | Backend & Database Engineer |


## 📸 Screenshots
<img width="1915" height="871" alt="Screenshot 2026-04-13 185828" src="https://github.com/user-attachments/assets/26671ac2-f7d9-4bae-8705-1a71f10ed0d9" />

## 📸 Link of Video(Interaction of Web)
Click the link and Dowload 
https://drive.google.com/file/d/1SF7QSg8n6GOk1bz2EmA9jr8mxjnhS7Cc/view?usp=sharing

## 📈 Future Enhancements

We are constantly looking to improve **HostelHub**. Here are the features currently in our roadmap:

-  **🔔 Email & SMS Notifications:** Automated alerts for fee deadlines, emergency notices, and complaint status updates.
-  **📱 Mobile App Version:** A dedicated React Native or Flutter application for students to manage their stay on the go.
-  **📊 Advanced Analytics Dashboard:** Visual insights for admins to track occupancy rates, revenue growth, and maintenance trends.
-  **🤖 AI-Based Room Allocation:** An intelligent algorithm to suggest room pairings based on student preferences, habits, and personality profiles.

## 👨‍💻 Developed By

HostelHub Team
