# Full-Stack Bus Reservation System

This is a full-stack bus ticket reservation application built with a Spring Boot backend and a React frontend.

## Project Structure

This is a monorepo containing two separate projects:

-   `/backend`: The Spring Boot API that handles all data, business logic, and security.
-   `/frontend`: The React single-page application that provides the user interface.

## How to Run

### Backend (Spring Boot)
1.  Navigate to the `backend` directory: `cd backend`
2.  Ensure your MySQL database is running.
3.  Update the database credentials in `src/main/resources/application.properties`.
4.  Run the application using Maven: `mvn spring-boot:run`
5.  The API will be available at `http://localhost:8084`.

### Frontend (React + Vite)
1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`
4.  The application will be available at `http://localhost:5173`.