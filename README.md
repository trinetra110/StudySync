# StudySync

StudySync is a responsive assignment management dashboard built with React and Vite. It supports separate student and admin workspaces, assignment publishing, optional written responses, submission tracking, and assignment deletion.

The project is intentionally backend-free. Accounts, assignments, and submissions are persisted in the browser with `localStorage`, making the app easy to demo and deploy as a static site.

## Setup

### Requirements

- Node.js 18 or newer
- npm

### Install and run

```bash
npm i
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

### Available scripts

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Architecture Overview

### Application flow

1. `AuthContext` restores the current session from `localStorage`.
2. Public routes (`/` and `/login`) redirect authenticated users to their role workspace.
3. `ProtectedRoute` prevents students and admins from opening the wrong dashboard.
4. Dashboard pages read and mutate data through `src/services/api.js`.
5. Changes are persisted to `localStorage` and synchronized across open browser tabs with the `storage` event.

### Data storage

The mock service layer in `src/services/api.js` owns all persistence. It stores three collections under the `studysync-data` key:

- `users`: email, id, name, password, and role
- `assignments`: adminId, description, driveLink, id, and title
- `submissions`: assignmentId, isSubmitted, response, studentId

There is no network API or server database. This is suitable for a local or static deployment demo, but credentials should not be treated as secure production authentication.

## Folder Structure

```text
src/
  App.jsx                 # Application providers and route definitions
  App.css                 # Dashboard and authentication styles
  index.css               # Global styles and Tailwind import
  main.jsx                # React entry point
  assets/                 # Static application assets
  components/             # Shared UI and route guards
    ConfirmModal.jsx      # Reusable confirmation dialog
    EmptyState.jsx        # Empty collection state
    Icon.jsx              # Shared SVG icon set
    Navbar.jsx            # Workspace navigation and logout
    ProgressBar.jsx       # Submission progress indicator
    Routes.jsx            # Public and role-protected route guards
  context/
    AuthContext.jsx       # Session, login, signup, and logout state
  pages/
    Login.jsx             # Login and account creation screen
    StudentDashboard.jsx  # Assignment response and submission workflow
    AdminDashboard.jsx    # Assignment creation, monitoring, and deletion
  services/
    api.js                # localStorage-backed data service
```

## Component and Design Decisions

- **Pages own workflows.** `StudentDashboard`, `AdminDashboard`, and `Login` own page-specific state and user interactions.
- **Components own reusable UI.** Navigation, route protection, progress bars, empty states, icons, and confirmation dialogs are isolated so they can be reused without duplicating markup.
- **Context owns session state.** Authentication uses the native React Context API and hooks; Redux is not used.
- **The service layer owns persistence.** Pages do not manipulate `localStorage` directly. They call named service functions such as `createAssignment`, `markSubmission`, and `deleteAssignment`.
- **Destructive actions require confirmation.** Admin deletion explicitly warns that the assignment and all student submissions will be removed for everyone.
- **Student submission is deliberate.** Students can open the external Drive link, write an optional response, and confirm submission through a second verification step.
- **Responsive visual system.** The interface uses an editorial green, orange, and cream palette with Fraunces and DM Sans typography. Desktop layouts collapse into mobile-friendly stacked workflows at smaller widths.

## Demo Videos

### Admin Part 1

https://github.com/user-attachments/assets/78861ef9-0cef-478f-b015-e9924afc8fd1

### User 1

https://github.com/user-attachments/assets/0ae9d5e6-3fbf-43f2-b856-3f04bb9304d5

### Admin Part 2

https://github.com/user-attachments/assets/c6baf3b3-861b-4cd0-a896-d2c206274bbd

### User 2

https://github.com/user-attachments/assets/f00008e1-7440-4b6a-b2bf-0865147bae14

## Deployment

Deployed on Vercel.


> [!NOTE]
> Due to the short deadline, I used an AI coding assistant.

