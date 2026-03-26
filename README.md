# 🎬 NetflixGPT — AI-Powered Streaming Platform

> A production-grade Netflix clone supercharged with Google Gemini AI, built with React.js and modern frontend best practices.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?logo=redux&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?logo=tailwindcss&logoColor=white&style=flat-square)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black&style=flat-square)
![TMDB](https://img.shields.io/badge/TMDB_API-01B4E4?logo=themoviedatabase&logoColor=white&style=flat-square)

---

## ✨ Features

### 🎥 Core Experience
- **Netflix-style Hero Section** — Auto-playing trailers with cinematic fade transitions
- **Multi-row Movie Browsing** — Now Playing, Popular, Top Rated, Upcoming
- **Top 10 Rated Row** — Dedicated horizontal shelf for the highest-rated movies
- **Movie Detail Modal** — Rich info overlay with cast, ratings, overview & trailer playback
- **My Watchlist** — Add/remove movies; pinned row at the top when active
- **Infinite Scroll** — Auto-fetches the next page as you reach the end of any row

### 🤖 AI Features
- **GPT Movie Search** — Describe what you want to watch; Gemini AI returns curated picks
- **AI Chat Bot** — Conversational assistant for movie recommendations (floating bubble)
- **Live Search** — Real-time TMDB search with debounce as you type

### 👤 User & Auth
- **Firebase Authentication** — Sign up / Sign in / Sign out
- **Profile Gate** — Netflix-style "Who's watching?" profile picker on every login
- **Switch Profile** — Switch between profiles from the header dropdown
- **Multi-language UI** — Localized labels (English, Hindi, Spanish, and more)

### 🎛️ Browsing & Navigation
- **Genre Filter Dropdown** — In-header genre picker to filter all rows instantly
- **Actor / Person Deep Dive** — Click any cast member to explore their filmography
- **Scroll Navigation Arrows** — Appear on row hover; hide when at edges
- **Language Selector** — Switch the entire UI language from the header

### ⚡ Performance Optimizations
- **Route-Level Code Splitting** — `React.lazy + Suspense` for `/browse`, `/profile`, `/person/:id`
- **Image CDN Optimization** — Dynamic resolution fetching (`w185/w342/w500`) per viewport
- **Memoization** — `React.memo` + `useCallback` on all heavy list components
- **Layout Stability (CLS Fix)** — Strict `aspect-[2/3]` constraints on all movie cards
- **Intersection Observer** — Bulletproof infinite scroll with pre-fetch threshold

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS |
| Authentication | Firebase Auth |
| AI / LLM | Google Gemini API |
| Movie Data | TMDB API v3 |
| Routing | React Router v6 |
| Icons | React Icons |

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/utsav280/netflixGPT.git
cd netflixGPT
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
REACT_APP_TMDB_KEY=your_tmdb_v4_bearer_token
REACT_APP_GEMINI_KEY=your_google_gemini_api_key
```

> ⚠️ The `.env` file is excluded from version control. Never commit API keys.

You'll also need a `src/utils/firebase.js` file with your Firebase project config.

### 4. Start the development server
```bash
npm start
```

The app runs at `http://localhost:3000`

---

## 🗂️ Project Structure

```
src/
├── components/       # All UI components
│   ├── Header.jsx         # Navbar with genre filter, language, profile dropdown
│   ├── MainContainer.jsx  # Hero video + VideoTitle overlay
│   ├── VideoTitle.jsx     # Title, overview, Play/More Info buttons
│   ├── SecondaryContainer.jsx  # All movie rows
│   ├── MovieList.jsx      # Horizontal scrollable row with infinite scroll
│   ├── MovieCard.jsx      # Individual poster card with hover trailer
│   ├── TopTenList.jsx     # Top 10 rated horizontal shelf
│   ├── MovieModal.jsx     # Detail pop-up with trailer + cast
│   ├── GptSearch.jsx      # AI search page
│   ├── GenreFilter.jsx    # Genre dropdown integrated in header
│   ├── ProfileGate.jsx    # "Who's watching?" profile selector
│   └── PersonPage.jsx     # Actor filmography deep-dive page
├── hooks/            # Custom React hooks
│   ├── useNowPlayingMovies.js
│   ├── usePopularMovies.js
│   ├── useTopRatedMovies.js
│   ├── useUpcomingMovies.js
│   ├── useMovieTrailer.js
│   ├── useMovieDetails.js
│   └── useTrailerOnHover.js
├── utils/            # Redux slices, constants, helpers
│   ├── movieSlice.js
│   ├── watchlistSlice.js
│   ├── genreSlice.js
│   ├── gptSlice.js
│   ├── profileSlice.js
│   ├── constants.js
│   └── langConstants.js
└── App.js            # Root with code-split routes
```

---

## 📌 Notes

- This project was built for learning and portfolio purposes
- API responses are handled gracefully with loading shimmer states
- Authentication state is persisted via Firebase and synced to Redux

---

## ⚠️ Disclaimer

This project is **not affiliated with Netflix** or any streaming platform.  
All data is sourced from publicly available APIs (TMDB) and used for educational purposes only.  
Trailers are embedded from YouTube via the TMDB API.

---

## 👨‍💻 Author

**Utsav Goyal**  
Frontend Developer | React.js | JavaScript  
[GitHub](https://github.com/utsav280)
