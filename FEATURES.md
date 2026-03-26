# NetflixGPT - Official Feature Documentation 🎬🚀

Welcome to the comprehensive feature manifest for **NetflixGPT** — a premium, enterprise-grade streaming clone fundamentally supercharged by Artificial Intelligence and modern React architecture.

---

## 🔐 1. Authentication & Security
*   **Firebase Integration:** Robust email/password registration and Google-secured Sign-in.
*   **Protected Routing:** Core application routes (`/browse`, `/profile`, `/person`) are strictly sealed behind active user session checks.
*   **Profile Gate ("Who's watching?"):** An authentic Netflix-style interceptor screen that greets logged-in users. Sub-accounts (like "Kids" or "Guest") dynamically sync their selected avatars to the global Navigation Header.

---

## 🧠 2. Artificial Intelligence Engine
*   **Gemini 1.5 Flash `GptSearch`:** Users can bypass standard searching and ask for qualitative recommendations. E.g., *"Show me funny British spy movies from the 90s"* parses through Gemini into an array of strictly generated titles, mapping them natively back to localized TMDB posters.
*   **Conversational ChatBot Assistant:** A dedicated, draggable AI side-panel that retains chat history. It provides interactive, contextual assistance about movies, navigation, and streaming genres directly overlaid on the Browse page UI.

---

## 🌍 3. Global Multi-Language Localization
*   **Dynamic UI Translation:** 100% of the application's strings, including buttons, modals, and helper text, map to `Redux` dictionaries supporting **English**, **Hindi**, and **Spanish**.
*   **TMDB Genre Mapping:** Extends TMDB's numerical genre IDs (e.g., 28) into dynamically translated text pills (e.g., "Action" -> "एक्शन" -> "Acción") across all movie rows instantly on dropdown toggle.

---

## 🎞️ 4. Advanced Streaming UI/UX
*   **The Main Hero Layer:** Auto-playing, looping trailer backgrounds synced with dynamic Title and Description overlays, mimicking the immediate engagement of real Netflix.
*   **Infinite Scrolling Move Rows:** Hooked into an `IntersectionObserver`, movie rows (Now Playing, Popular, Upcoming) dynamically fetch and mount new TMDB pagination data as the user scrolls right, resulting in an "endless" browse experience.
*   **Live Search Autocomplete:** A snappy, debounced, glass-morphic search dropdown resting in the global header that fetches micro-posters on every keystroke, allowing instant access to films. 
*   **Genre Filtration Network:** Horizontal "pill" selectors allowing users to instantly slice complex fetched lists to display exclusively tailored contents (e.g., only "Sci-Fi").
*   **The "Top 10" Showcase:** A meticulously CSS-crafted row capping at 10 items.

---

## 🎬 5. Interactive Cinematic Meta-Data
*   **Intelligent Movie Modals:** Clicking any poster triggers a centralized interactive pop-up. It seamlessly fetches and cycles the official YouTube iframe trailers, aggregates rating data, handles Watchlist toggling logic, and displays a Cast slider.
*   **Nested Biographical Deep Dives (`/person/:id`):** Clicking any Cast headshot routes the user to a dedicated Wikipedia-inspired React route. It independently compiles the actor's life biography, birth history, and an infinite CSS grid showcasing every single movie they've ever been credited in.

---

## 💾 6. State Management Architecture
NetflixGPT leans entirely on `@reduxjs/toolkit` to construct a monolithic, non-blocking single-source-of-truth store, comprising:
1.  **`userSlice`**: Firebase user session tokens.
2.  **`profileSlice`**: Localized "Who's Watching" avatar choices.
3.  **`configSlice`**: Active Application locale mapping.
4.  **`movieSlice`**: Heavy, paginated array clusters of raw TMDB JSON data.
5.  **`watchlistSlice`**: Persistent user-favourited `MovieCard` arrays mapped back to the Profile Hub.

---

*Architected with React, TailwindCSS, Firebase, Gemini API, and TMDB services.*
