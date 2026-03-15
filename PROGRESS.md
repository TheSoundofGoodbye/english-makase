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
- [x] Add confirmation dialog on Reset button to prevent accidental data loss.
- [x] Rename "배운 단어" to "배운 표현" across the Dashboard.

### Phase 6: GitHub & Cloudflare Deployment (✅ Complete)
- [x] Initialize local Git repository and push all code to `TheSoundofGoodbye/english-makase` on GitHub.
- [x] Write comprehensive Korean `README.md` with live demo badge and tech stack info.
- [x] Deploy app to Cloudflare Pages at `https://english-makase.pages.dev/`.

### Phase 7: Version 5 - Automated Content Pipeline (✅ Complete)
- [x] Create `scripts/updateIdioms.ts` — Node.js script that calls Gemini 2.5 Flash API to generate new idiom entries per category and appends them to `idioms.json`.
- [x] Set up `.github/workflows/daily-update.yml` — Github Actions cron job running at 00:00 UTC (09:00 KST) daily. Automatically commits and pushes the updated DB to trigger a Cloudflare Pages redeploy.
- [x] Store `GEMINI_API_KEY` in GitHub Secrets (never exposed in source code).
- [x] Verified pipeline end-to-end locally with `npx tsx scripts/updateIdioms.ts`.

### Phase 8: Korean Sentence Translations (✅ Complete)
- [x] Add `sentenceTranslations` field to all existing entries in `idioms.json`.
- [x] Update `contentService.ts` interface to include `sentenceTranslations`.
- [x] Update `Dashboard.tsx` to render a Korean translation beneath each English sentence in a subtle italic style.
- [x] Update `updateIdioms.ts` AI prompt to generate Korean translations for all future auto-generated entries.

*Notes: Full V5 pipeline is live. Every day at 9AM KST, new expressions are added automatically. Cloudflare Pages auto-rebuilds on each commit, so the website stays in sync with the latest data.*
