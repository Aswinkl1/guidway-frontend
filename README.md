# GuidWay Frontend

Frontend application for **GuidWay**, a mentoring marketplace platform where users can discover mentors, book mentorship sessions, communicate in real-time, and manage their learning journey through a modern and responsive user interface.

Built with **React.js**, **TypeScript**, and modern frontend architecture practices focused on scalability, performance, and maintainability.

---

## Overview

GuidWay is a marketplace platform connecting mentors and learners through an interactive and seamless experience.

This frontend application provides:

* Modern responsive UI
* Mentor discovery experience
* Authentication workflows
* Session booking interfaces
* Real-time communication UI
* Video session integration
* Dashboard management
* Profile management
* Marketplace browsing experience

---

## Related Repositories

### Backend Repository

https://github.com/Aswinkl1/Guidway-backend

### Frontend Repository

https://github.com/Aswinkl1/guidway-frontend

---

## Tech Stack

### Core Technologies


* React.js
* TypeScript
* Tailwind CSS

### State & Data Management

* Redux Toolkit / Context API
* Axios
* React Query (if applicable)

### Authentication

* JWT Authentication
* Google OAuth
* Protected Routes

### UI & UX

* Responsive Design
* Modern Component Architecture
* Reusable UI Components
* Loading & Error States

### Utilities

* ESLint
* Prettier
* TypeScript Strict Mode

---

## Features

### Authentication System

* User registration & login
* Google OAuth login
* Protected routes
* Secure token handling

### Mentor Marketplace

* Browse mentors
* Search & filtering
* Mentor profile pages
* Session booking interface

### User Dashboard

* Profile management
* Booking management
* Session tracking

### Communication

* Real-time chat UI
* Video session support
* Notifications

### User Experience

* Fully responsive layout
* Optimized performance
* Clean UI/UX
* Reusable component system

---

## Project Structure

```bash
guidway-frontend/
│
├── public/                 # Static assets
├── src/
│   ├── app/                # App router pages
│   ├── components/         # Reusable components
│   ├── features/           # Feature modules
│   ├── services/           # API services
│   ├── hooks/              # Custom hooks
│   ├── store/              # State management
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles
│
├── package.json
├── tsconfig.json
└── vite.config.js
```

> The structure may evolve as the application grows.

---

## Architecture

The frontend follows a scalable and modular architecture approach.

### Core Principles

* Component reusability
* Separation of concerns
* Scalable folder structure
* Type-safe development
* API abstraction
* Maintainable UI patterns

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Aswinkl1/guidway-frontend.git
```

### 2. Move Into the Project

```bash
cd guidway-frontend
```

### 3. Install Dependencies

Using pnpm:

```bash
pnpm install
```

---

## Environment Variables

Create a `.env.local` file in the root directory.

Example:

```env
VITE_PUBLIC_API_URL=
VITE_PUBLIC_GOOGLE_CLIENT_ID=
```

> Add all required environment variables based on your local setup.

---

## Running the Project

### Development Mode

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

---

## Available Scripts

| Script            | Description             |
| ----------------- | ----------------------- |
| `pnpm dev`        | Run development server  |
| `pnpm build`      | Build application       |
| `pnpm start`      | Start production server |
| `pnpm lint`       | Run linting             |
| `pnpm type-check` | Run TypeScript checks   |

---

## API Integration

The frontend communicates with the backend REST API for:

* Authentication
* Mentor management
* Session booking
* Messaging
* Notifications
* User management

### Backend API

https://github.com/Aswinkl1/Guidway-backend

---

## UI/UX Focus

The application is designed with focus on:

* Responsive design
* Accessibility
* Clean layouts
* Smooth user flows
* Marketplace-style experience
* Performance optimization

---

## Scalability Considerations

This frontend architecture supports future scaling through:

* Modular component system
* Reusable hooks
* API abstraction layers
* Centralized state management
* Type-safe development
* Feature-based organization

---

## Future Improvements

Potential future enhancements:

* Dark mode
* Advanced mentor recommendation system
* Real-time notifications
* Progressive Web App (PWA)
* AI-powered mentor matching
* Calendar integrations
* Multi-language support
* Better analytics dashboards

---

## Full Stack Architecture

```text
Frontend (React.js)
        ↓
REST API (Express.js Backend)
        ↓
PostgreSQL + Redis
```

---

## Author

Developed by Aswinkl1

GitHub: https://github.com/Aswinkl1
