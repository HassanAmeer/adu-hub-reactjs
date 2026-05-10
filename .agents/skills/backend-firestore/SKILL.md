---
name: backend-firestore-only
description: Specifically for updating backend code and integrating with Firebase Firestore. Strictly no UI/design changes and no Firebase Auth.
---

# Backend Firestore Integration Skill

## Purpose
This skill is exclusively for developing and updating backend logic that connects to Firebase Firestore. It strictly prohibits any modifications to the user interface, styling, or design of the application. It also strictly forbids the use or implementation of Firebase Authentication.

## Constraints & Rules
1. **NO UI Changes:** Do NOT modify HTML, CSS, Tailwind classes, or React components' visual structure. Your changes should be invisible to the user's eye.
2. **NO Firebase Auth:** Do NOT use, import, or configure Firebase Authentication (`getAuth`, `signInWith...`, etc.).
3. **Firestore Only:** You may only interact with Firebase Firestore (`getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `onSnapshot`, `updateDoc`, `deleteDoc`, etc.).
4. **Centralized Collections Management:** ALL collection names MUST be imported and used from `src/services/collections-names.js` (e.g., `import { COLLECTIONS } from '../services/collections-names';`). NEVER use hardcoded strings for collection names.
5. **Every future use able configration variables:** ALL  useable configration variables must be imported and used from `src/config/config.js` (e.g., `import { CONFIG } from '../config/';`). NEVER use hardcoded strings if its configureable or changeable in future
6. **Backend Logic Only:** Focus solely on data fetching, data mutation, business logic, state management related to data, and connecting these pieces to the existing UI without changing its appearance.
7. **Seeding Dummy Data:** If the project requires dummy data for testing, create JSON files in `src/seeding/` with perfect reference IDs (e.g., `userId` matching an `id` in `users.json`). Use a dedicated route like `/seeding` to migrate this data using `writeBatch`.

## Instructions
When activated, follow these steps to integrate backend functionality:

1.  **Understand Data Requirements:** Analyze the existing UI to understand what data needs to be read from or written to Firestore.
2.  **Initialize Firestore:** Ensure Firestore is initialized in the project (usually in a `firebase.js` or `firebase.ts` file) using `initializeApp` and `getFirestore`.
3.  **Implement Data Services:** Create or update service functions to encapsulate Firestore interactions. Keep logic separated from the view where possible.
4.  **Connect to UI (Without Design Changes):** Update React components to use hooks (like `useEffect`, `useState`) to fetch data from your services and map that data into the *existing* UI structure.
5.  **Verify Data Flow:** Ensure data reads and writes work correctly by adding console logs or checking the Firebase console. Do not alter the UI layout to display errors unless a specific error container already exists.

## Example Usage
- "Wire up the contact form to save submissions to the 'contacts' collection in Firestore."
- "Fetch the list of products from Firestore and populate the existing product grid without changing its layout."
- "Implement real-time updates for the dashboard metrics using Firestore snapshots."

Remember: **Functionality ONLY. No Aesthetics.**
