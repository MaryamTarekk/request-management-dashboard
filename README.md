# Requests Dashboard

A React-based dashboard for managing requests, with a focus on reliable data handling, URL-persisted state, and a smooth user experience.

## Features

- **Request Management:** View requests with their title, status, priority, owner, and timestamps.
- **Search & Filtering:** Search and filter requests by their available fields.
- **Sorting & Pagination:** Organize requests and navigate through pages.
- **URL State Persistence:** Search, filters, sorting, and pagination are reflected in the URL, allowing users to refresh or share the current view.
- **Request Details:** View and edit request details, including status and owner.
- **Unsaved Changes Protection:** Warn users before leaving a request with unsaved changes.
- **Optimistic Updates:** Status changes appear immediately, with rollback if the update fails.
- **Mock API:** Simulates network latency and failures for testing different scenarios.
- **Background Refresh:** Periodically refreshes request data while preserving the current UI state.
- **User Feedback:** Loading, error, and empty states are handled without unnecessary full-page loading.
- **Automated Tests:** Tests cover important request management behaviors.

## Tech Stack

- React
- Vite
- JavaScript
- React Router
- Vitest
- React Testing Library

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
git clone https://github.com/MaryamTarekk/Requests-Dashboard.git
cd Requests-Dashboard
npm install
```

### Run the Development Server

```bash
npm run dev
```

### Run Tests

```bash
npx vitest run
```

## Project Decisions

- Keep search, filters, sorting, and pagination in the URL so the current list view can be restored.
- Use a mock API to simulate latency and failures.
- Handle optimistic status updates with rollback on failure.
- Protect users from losing unsaved changes.
- Refresh data in the background without unnecessarily resetting the current view or open forms.

## Notes

This project was developed as a frontend task focused on request management, state synchronization, error handling, and testing.
