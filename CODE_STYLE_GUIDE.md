# Code Style Guide

Welcome to the Code Style Guide for **english-makase**! This document outlines our conventions for writing clean, readable, and maintainable code.

## 1. General Principles

*   **Readability counts:** Code is read much more often than it is written. Optimize for readability over cleverness.
*   **Consistency is key:** Even if you disagree with a specific rule, stick to the guide to maintain a uniform codebase.
*   **Leave it better than you found it:** When modifying existing code, take the opportunity to clean up minor style violations nearby.
*   **Don't Repeat Yourself (DRY):** Extract duplicated logic into functions or components.
*   Make sure all the code is styled with Prettier and linted with ESLint.
*   Make sure complex logic is properly commented.

## 2. Naming Conventions

*   **Variables, Functions, and Methods:** `camelCase`
    ```javascript
    let userCount = 0;
    function calculateTotal(price, tax) { ... }
    ```
*   **Classes and Components (React):** `PascalCase`
    ```javascript
    class UserProfile { ... }
    function SubmitButton(props) { ... }
    ```
*   **Constants:** `UPPER_SNAKE_CASE`
    ```javascript
    const MAX_RETRY_ATTEMPTS = 3;
    ```
*   **File Names:**
    *   General files: `kebab-case.js` or `kebab-case.ts`
    *   React Components: `PascalCase.jsx` or `PascalCase.tsx`
*   **Booleans:** Prefix with `is`, `has`, `should`, or `can`.
    ```javascript
    const isVisible = true;
    const hasError = false;
    ```

## 3. Formatting

*   **Indentation:** 2 spaces. No tabs.
*   **Line Length:** Maximum of 100 characters per line.
*   **Quotes:** Use single quotes `'` for strings. Use backticks `` ` `` for template literals.
*   **Semicolons:** Always use semicolons at the end of statements.
*   **Trailing Commas:** Always use trailing commas in multiline object literals and arrays. This makes diffs cleaner.

## 4. JavaScript / TypeScript Specifics

*   **Variables:** Use `const` by default. Only use `let` when you know the variable will be reassigned. Never use `var`.
*   **Equality:** Always use strict equality (`===` and `!==`).
*   **Functions:** Prefer arrow functions for anonymous functions and callbacks.
    ```javascript
    // Good
    items.map(item => item.id);

    // Avoid
    items.map(function(item) { return item.id; });
    ```
*   **Destructuring:** Use object and array destructuring where it makes the code clearer.
*   **Optional Chaining / Nullish Coalescing:** Utilize `?.` and `??` to avoid deeply nested null checks.

## 5. React Specifics (If applicable)

*   **Components:** Prefer Functional Components with Hooks over Class Components.
*   **Props:** Destructure props in the function signature.
    ```jsx
    // Good
    const Avatar = ({ user, size }) => { ... };
    ```
*   **State:** Keep component state as local as possible. Only elevate state when necessary.
*   **JSX:** Wrap multiline JSX in parentheses.

## 6. Comments and Documentation

*   **Why, not What:** Code should explain *what* happens. Comments should explain *why* it happens (business logic, edge cases, workarounds).
*   **JSDoc/DocStrings:** Document public utilities, complex functions, and shared components using JSDoc.
    ```javascript
    /**
     * Formats a raw date string into a highly readable human format.
     * @param {string} dateString - The raw ISO date string.
     * @returns {string} The formatted date.
     */
    ```
*   **TODOs:** Always format TODO comments consistently and ideally include a tracking ticket number or author name.
    *   `// TODO(username): Refactor this after API v2 is released.`

## 7. Version Control (Git)

*   **Commit Messages:**
    *   Start with a capitalized, imperative verb (e.g., `Add`, `Fix`, `Update`, `Refactor`).
    *   Keep the subject line under 50 characters.
    *   Provide context in the body of the commit if necessary.

## 8. Linting and Formatting Tools

*   We use **Prettier** for automated code formatting.
*   We use **ESLint** for catching logical errors and enforcing code quality rules.
*   *Please ensure your editor is configured to format on save, or run the formatting scripts before creating a pull request.*

---

*Note: This is a living document. If you find a rule that regularly causes friction or consider adding a new best practice, propose a change to the team.*
