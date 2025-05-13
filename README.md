# ✈️ Flight Search Application

A full-stack application that allows users to search for flights. Built with:

- **Backend**: Node.js + Express with SOAP integration and Redis caching
- **Frontend**: Next.js (React) with Tailwind CSS

## 📚 Table of Contents
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Run Backend Tests](#run-backend-tests)
- [UI (Frontend) Setup](#ui-frontend-setup)
- [Build Frontend for Production](#build-frontend-for-production)
- [Demo](#demo)
- [Folder Highlights](#folder-highlights)
- [Technologies Used](#technologies-used)
- [Contact](#contact)

---

## 📁 Project Structure

    flight-search-application/
    ├── backend/       → Express backend (REST + Redis)
    ├── ui/            → Next.js frontend (React + Tailwind)
    ├── README.md      → Project documentation

---

## ✅ Prerequisites

Ensure you have the following installed::

- [Node.js](https://nodejs.org/en/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (for Redis or containerized backend)
- [Git](https://git-scm.com/)

---

## 🚀 Getting Started

### 1. Clone the Repository

git clone https://github.com/your-username/flight-search-application.git
cd flight-search-application


---

### 2. 🔧 Backend Setup

Navigate to backend folder

    cd backend

Install Dependencies

    npm install

Environment Variables

Create a .env file in the backend/ directory with:

    PORT=5050
    REDIS_URL=host.docker.internal
    MONGO_URI=mongodb://host.docker.internal:27017/flightDB

Modify as needed for your environment.

Start Backend Server

    docker-compose up --build backend

This will use the docker-compose.yml file inside the backend directory.
If Redis is not running locally, make sure Docker is running and accessible via host.docker.internal.


The backend server will run at:

    http://localhost:${PORT}

By default, if your .env file contains:

    PORT=5050

Then it will run at:
👉 http://localhost:5050

You can change the port by modifying the `PORT` value in the .env file.

---

### 3. 🧼 Run Backend Tests

Create a .env.test file in the backend/ directory with:

    PORT=5050
    MONGO_URI=mongodb://host.docker.internal:27017/flightDB

Modify as needed for your environment.

Run Test:

    docker-compose up --build test

---

### 4. 💻 UI (Frontend) Setup

Navigate to UI Folder

    cd ../ui

Install Dependencies

    npm install

Run Development Server

    npm run dev

The frontend will run at::

    http://localhost:3000

---

### 5. 📦 Build Frontend for Production

    npm run build
    npm start

### 6. 🎥 Demo
✅ Click below to watch a demo of the Flight Search Application in action:

[![Demo Video](https://img.shields.io/badge/Watch%20Demo-Click%20Here-brightgreen)](asset/Demo_Video.mp4)

---

### 7. 🧪 Folder Highlights

- **controllers**
    - `flightController.js`: Contains the logic for handling flight-related API requests.

- **middleware**
    - `validate.js`: Middleware for validating incoming requests before they are processed by the controller.

- **models**
    - `Flight.js`: Mongoose model for the flight data, used for interacting with the database.

- **redis**
    - `redisClient.js`: Handles the connection to Redis, used for caching flight data.

- **redis_data**
    - Stores Redis persistence files like `appendonly.aof` and `dump.rdb`.

- **routes**
    - `flightRoutes.js`: Defines the routes for handling flight search and related API endpoints.

- **tests/controller**
    - `flightController.test.js`: Unit tests for the flight controller, ensuring the API logic works as expected.

- **validators**
    - `flightValidator.js`: Contains validation logic for flight-related data input to ensure data integrity.
  
- **app**
    - `globals.css`: Global styles for the application.
    - `layout.tsx`: The main layout file for the application, defining the structure and shared components.
    - `page.tsx`: The entry page for the application, containing the main UI rendering logic.

- **src/components/ui**
    - `button.tsx`: Reusable button component used across the application.
    - `card.tsx`: Reusable card component for displaying content in a structured layout.
    - `input.tsx`: Reusable input field component for user interaction.
    - `table.tsx`: Reusable table component for displaying flight data or other tabular information.

- **src/lib**
    - `utils.ts`: Utility functions used across the application for various helper tasks.

- **tailwind.config.js**: Configuration for Tailwind CSS to customize the design system.
- **tsconfig.json**: TypeScript configuration for the project.

---

### 8. 🛠 Technologies Used

    Backend
        •	Node.js
        •	Express
        •	Redis
        •	Jest (for testing)

    Frontend
        •	React + Next.js (App Router)
        •	TypeScript
        •	Tailwind CSS
        •	PostCSS
        •	ESLint

---

### 9. Contact

Created by Arushee Tomar