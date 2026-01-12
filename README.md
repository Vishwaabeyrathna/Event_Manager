# 📅 Event Management Pro (Full-Stack)

A robust, full-stack event scheduling application built with **React (Vite)**, **Node.js**, and **MySQL**. It follows a strict **MVC Architecture** and uses **Raw SQL** (no ORMs) for maximum performance and control.

## ✨ Key Features

### 1. Core Event Operations (CRUD)
- **Create:** Add new events with Title, Description, Start Time, and End Time.
- **Read:** View a sorted list of all upcoming events.
- **Update:** Edit existing event details seamlessly.
- **Delete:** Remove events with a confirmation prompt.

### 2. 🛡️ Smart Overlap Protection
- **Conflict Detection:** The backend strictly prevents users from creating an event if the time slot clashes with an existing event.
- **Logic:** Uses SQL to check `(Start_A < End_B) AND (End_A > Start_B)` before insertion.
- **User Feedback:** Returns a `409 Conflict` error, displaying a clear alert to the user.

### 3. 🧠 Algorithmic Feature ("Busy Blocks")
- **Problem:** Calculate continuous busy periods from a list of scattered, overlapping events.
- **Solution:** Implemented an **O(N log N)** "Merge Intervals" algorithm.
- **Usage:** Clicking "Run Overlap Algorithm" shows the consolidated time ranges where the user is busy, regardless of how many individual events overlap.

### 4. Technical Highlights
- **MVC Architecture:** Strict separation of Model (SQL), View (React), and Controller (Logic).
- **Raw SQL:** Uses parameterized queries (`?`) to prevent SQL Injection.
- **Modern UI:** Dark-mode interface designed with **Tailwind CSS**, featuring glassmorphism, gradients, and responsive inputs.
- **Validation:** Server-side checks to ensure `Start Time < End Time`.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS (v3)
- **Backend:** Node.js, Express.js
- **Database:** MySQL (using `mysql2/promise`)
- **Testing:** Jest (Unit Tests), Supertest (Integration Tests)

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js installed (v16 or higher)
- MySQL Server running


    end_time DATETIME NOT NULL,
    description TEXT
);
