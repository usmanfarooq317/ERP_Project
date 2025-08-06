# ASH Tech ERP Fullstack Application

This repository contains both the frontend (React) and backend (NestJS) for the ASH Tech ERP application.

## Project Structure

- `frontend/`: Contains the React-based ERP dashboard frontend.
- `backend/`: Contains the NestJS-based ERP backend API.

## Getting Started

Follow these steps to set up and run the fullstack application.

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL

### 1. Backend Setup

Navigate to the `backend` directory and follow its setup instructions.

```bash
cd backend
```

Refer to `backend/README.md` for detailed instructions on:
- Installing dependencies
- Setting up environment variables
- Configuring PostgreSQL
- Running database migrations and seeding
- Starting the backend server

**Important:** Ensure your PostgreSQL database is running and configured as specified in `backend/README.md`.

### 2. Frontend Setup

Navigate to the `frontend` directory and follow its setup instructions.

```bash
cd ../frontend
```

**Note:** The frontend is expected to communicate with the backend running on `http://localhost:3000/api`. Ensure this matches your backend configuration.

Refer to `frontend/README.md` (if available, or standard React app setup) for detailed instructions on:
- Installing dependencies
- Starting the frontend development server

## Running the Application

1. **Start the Backend:**
   Open a terminal, navigate to the `backend` directory, and run:
   ```bash
   npm run start:dev
   ```
   The backend API will be available at `http://localhost:3000/api`.

2. **Start the Frontend:**
   Open a **new** terminal, navigate to the `frontend` directory, and run:
   ```bash
   npm run dev # or yarn dev, depending on your package manager
   ```
   The frontend application will typically be available at `http://localhost:5173` (or another port as indicated by the frontend server).

## Default Accounts (for Backend)

After running the backend seed script, you can use these accounts:

- **Admin**: `admin@ashtech.com` / `admin123`
- **Finance**: `finance@ashtech.com` / `finance123`

## API Endpoints

Refer to `backend/README.md` for a comprehensive list of API endpoints.

## Contributing

Refer to the individual `frontend/README.md` and `backend/README.md` files for contribution guidelines specific to each part of the application.

## License

This project is licensed under the MIT License.

