# Developer Guide - Aura Shop

This guide provides essential information for developers working on the Aura Shop project.

## Project Overview

Aura Shop is a clothing platform with a multi-faceted architecture, including separate frontend applications for administrators, vendors, and customers, all powered by a central backend.

## Project Structure

The project is organized into the following main directories:

*   `metainflu/`: Contains the core application code.
    *   `adminpanel/`: Houses the frontend applications for administration.
        *   `frontend/admin`: The admin dashboard.
        *   `frontend/vendor`: The vendor dashboard.
    *   `backend/`: The Node.js backend application.
    *   `frontend/`: Contains the client-facing applications.
        *   `client/`: Main client web application.
        *   `client-app/`: Client application configured for mobile deployment with Capacitor.
        *   `client-web/`: An alternative client web application.
*   `Documentation/`: Contains project-related documentation.

## Getting Started

### Backend

1.  Navigate to the backend directory: `cd metainflu/backend`
2.  Install dependencies: `npm install`
3.  Start the server: `npm start` (or `nodemon server.js` for development)

### Frontend Applications

Each frontend application (`admin`, `vendor`, `client`, `client-app`, `client-web`) is a separate Vue.js project. To run any of them:

1.  Navigate to the specific application's directory (e.g., `cd metainflu/frontend/client`).
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

## Mobile Development (Capacitor)

The `client-app` is configured to be built as a native mobile application using Capacitor.

### Building for Android

1.  **Build the Vue.js app:**
    ```bash
    cd metainflu/frontend/client-app
    npm run build
    ```

2.  **Sync with Android project:**
    ```bash
    npx cap sync android
    ```

3.  **Open in Android Studio:**
    ```bash
    npx cap open android
    ```

4.  **Run the app:**
    Use Android Studio to run the app on an emulator or a physical device.

For more detailed instructions, refer to `metainflu/frontend/client-app/CAPACITOR_ANDROID_GUIDE.md`.

## Future Development Notes

*   **Component Reusability:** Consider creating a shared component library to be used across the different frontend applications to maintain a consistent UI and reduce code duplication.
*   **API Documentation:** Keep the `API_DOCUMENTATION.md` file updated with any changes to the backend API.
*   **Authentication:** The authentication system is documented in `AUTHENTICATION_SYSTEM_DOCS.md`. Review this document before making any changes to the authentication flow.
