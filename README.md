# Personalized Content Dashboard

An interactive and customizable dashboard built with **Next.js, React, Redux Toolkit, TailwindCSS, and Framer Motion**.  
Users can explore **personalized news, music, and social content**, mark favorites, and reorder their feed with drag-and-drop.  

---

## 🚀 Features

- 📰 **Personalized Feed** – News, Spotify tracks, and social posts in one place.  
- 🔥 **Trending Section** – Displays trending news & music.  
- ⭐ **Favorites Section** – Save content for later.  
- 🔍 **Search with Debounce** – Global search across APIs.  
- 🎛 **Preferences Panel** – Choose categories & toggle dark mode.  
- ↕ **Drag-and-Drop Reordering** – Reorder content cards smoothly.  
- 🎨 **Framer Motion Animations** – Smooth transitions and hover effects.  
- 💾 **Persistence** – Favorites and preferences saved in localStorage.  
- 🧪 **Testing** – Unit, integration, and E2E test coverage.  

---

## ⚙️ Tech Stack

- [Next.js](https://nextjs.org/)  
- [React](https://reactjs.org/)  
- [Redux Toolkit](https://redux-toolkit.js.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Framer Motion](https://www.framer.com/motion/)  
- [Jest + React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)  
- [Cypress](https://www.cypress.io/) (E2E testing)  

---

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/personalized-dashboard.git
   cd personalized-dashboard

2. Install the dependencies:
   ```bash
   npm install

3. Create a .env.local file in the root directory and add your API keys:
   ```bash
    NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
    NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

4. Run the development server:
   ```bash
   npm run dev

4. Open http://localhost:3000 to view it.


## Testing
Run unit + integration tests:
    ```bash
    npm test

## User Flow
1. Set Preferences → Choose categories & toggle dark mode.
2. Explore Feed → See news, Spotify, and mock social posts.
3. Search → Find content globally (debounced search).
4. Trending → Explore top trending news & music.
5. Favorites → Save & view marked content.
6. Drag-and-Drop → Reorder cards for a personalized view.

## Deployment
This app is deployed on Vercel.

🔗 Live Link: https://your-vercel-project-url.vercel.app