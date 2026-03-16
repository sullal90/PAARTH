# PAARTH Frontend

This is the frontend of the PAARTH AI Recitation Companion. It provides the user interface for selecting verses, reciting them, and receiving real-time feedback.

## Prerequisites

- Node.js (ideally the latest LTS version)
- npm or yarn (whichever you prefer)

## Setup Instructions

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   Or, if you're using yarn:
   ```
   yarn install
   ```

## Running the Frontend Locally

To start the development server (with hot reloading):
```
npm run dev
```
Or with yarn:
```
yarn dev
```

This will typically launch the app at `http://localhost:5173` (or another available port).

## Configuration

Make sure that the backend API endpoint is correctly set in the frontend. Check the API service file:
```
src/services/api.ts
```
Ensure the base URL points to your deployed backend or local backend.

## Building for Production

To create an optimized production build:
```
npm run build
```
Or:
```
yarn build
```

This outputs a production-ready version into the `dist` folder.

## Additional Notes

- Make sure the backend is running (either locally or deployed) before testing full recitation functionality.
- You can customize UI elements by editing the CSS files under `src`.