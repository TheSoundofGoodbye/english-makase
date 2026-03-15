# English Makase - Project Progress

This document serves as the persistent memory of the project's current state, ensuring development can be paused and resumed cleanly at any time.

## Project Goal
Develop an English learning web application (React + Vite + TypeScript) for Korean speakers that provides daily English sentences curated to the user's personal hobbies, focusing on introducing new native-like expressions based on recent hot topics via AI.

## Current Architecture Decisions
1. **Frontend:** React + Vite + TypeScript (Vanilla CSS for aesthetic styling).
2. **AI Engine:** Google Gemini API (Client-side requests).
3. **Data Storage:** Browser `localStorage` (Tracks user hobbies, past sentences, and seen vocabulary).
4. **Vocabulary Strategy:** Client-side diffing (AI generates advanced words natively; React app filters against the user's local "seen words" dictionary to highlight new vocabulary without sending the entire dictionary to the AI).

## Progress Checklist

### Phase 1: Planning & Architecture (✅ Complete)
- [x] Document core product rules (`PRODUCT_REQUIREMENTS.md`).
- [x] Adapt structural guidelines for React (`CODE_GENERATION_GUIDE.md`, `CODE_STYLE_GUIDE.md`, `WORKFLOW.md`).
- [x] Architect AI Prompting & Local Storage diffing strategy.
- [x] Update runtime environments (Node/npm versions ready for Vite 9.x).

### Phase 2: Project Initialization (✅ Complete)
- [x] Bootstrap Vite React+TS template in the workspace root.
- [x] Configure `index.css` for a premium glassmorphic/dynamic UI aesthetic.
- [x] Setup base static component structure (`App.tsx`, `Dashboard.tsx`, `Onboarding.tsx`).

### Phase 3: Core Features - V1 AI Version (✅ Complete)
- [x] Implement `storage.ts` to manage the hobby boundary and seen vocabulary.
- [x] Implement Onboarding screen to collect user hobby.
- [x] Integrate Gemini API to generate daily sentences.
- [x] Implement client-side diffing logic to isolate "new words of the day".
- [x] Build History parsing and UI.
- [x] Build Typescript and resolve errors.

### Phase 4: Version 3 Static Redesign (✅ Complete)
- [x] Uninstall Gemini API and replace with local `idioms.json` database.
- [x] Translate all UI text (Onboarding, Dashboard, History) to Korean.
- [x] Remove API Key input requirements.

### Phase 5: Version 4 UX Enhancements (✅ Complete)
- [x] Change Onboarding input to Multiple Choice categories matching the local DB.
- [x] Refactor diffing algorithm (`TextProcessor.ts`) to highlight exact phrases instead of individual words.

*Notes: The project is fully functional in V4. "bite the bullet" now highlights as a single cohesive idiom, and Onboarding uses predefined category buttons.*
