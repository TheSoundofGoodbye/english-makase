# Code Generation Guide

This guide outlines our conventions and workflow for generating and structuring new code features in our React + Vite application.

## 1. Feature Development Workflow

*   **Entry Point:** The `App.tsx` file is the entry point for the application routing and main layout.
*   **Distinct Files:** Do not generate complex components directly in `App.tsx`. Instead, generate distinct UI views in the `src/components/` directory (e.g., `src/components/Dashboard.tsx`).
*   **Separation of Concerns:** Keep API calls, storage logic, and utility functions out of UI components. Place them in `src/services/` or `src/utils/` (e.g., `src/services/gemini.ts` or `src/services/storage.ts`).
*   **Component Structure:**
    * Use functional components with Hooks.
    * Use TypeScript interfaces for props and state.
    * Prefer CSS Modules or Vanilla CSS for styling (e.g., `index.css`).
