# Development Workflow

This document outlines the standard workflow for adding and testing new features in the React + Vite stack.

## Testing Guidelines

*   **Unit Tests:** We use Vitest and React Testing Library for component unit testing.
*   **Location:** Keep tests alongside the component or utility they are testing, using a `.test.tsx` or `.test.ts` extension (e.g., `Dashboard.test.tsx` next to `Dashboard.tsx`).
*   **Coverage:** Ensure complex logic like AI differential parsing and storage managers are fully unit tested.
