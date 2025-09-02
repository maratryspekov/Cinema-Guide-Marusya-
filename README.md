# Cinema Guide (Marusya)

A modern movie discovery web app built with React, TypeScript, and Vite. Search films, browse by genres, view details, and manage your favorites — all in a clean dark UI.

![Account Page](./src/assets/screenshots/image-account.png)
![Genres Page](./src/assets/screenshots/image-genres.png)
![Hero Section](./src/assets/screenshots/image-hero.png)
![Top Movies](./src/assets/screenshots/image-topmovies.png)

---

## ✨ Features

- 🎬 Random featured movie on the home page
- 🔍 Smart search with suggestions
- 🎭 Genre filtering
- ❤️ Favorites management
- 👤 Authentication (login/register)
- 🎥 Trailers (when available)
- 📊 Detailed movie pages
- 📱 Responsive layout (desktop/tablet/mobile)

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript
- **Build:** Vite
- **Styles:** SCSS Modules
- **Routing:** React Router
- **State:** Redux Toolkit & RTK Query
- **Icons:** SVGR (`*.svg?react`), static assets from `public/`

---

## ⚙️ API & Auth

- **Backend:** [cinemaguide.skillbox.cc](https://cinemaguide.skillbox.cc)
- RTK Query uses `credentials: "include"` for cookie-based sessions.

### Main Endpoints

- `POST /auth/login` — log in (sets session cookie)
- `GET /auth/logout` — log out
- `POST /user` — register
- `GET /profile` — current user
- `GET /favorites` — list favorites
- `POST /favorites` (id=<movieId>) — add favorite
- `DELETE /favorites/:movieId` — remove favorite

### Dev Proxy (Vite)

`vite.config.ts` includes a dev proxy for API calls:

```ts
server: {
  proxy: {
    "/api": {
      target: "https://cinemaguide.skillbox.cc",
      changeOrigin: true,
      secure: true,
      rewrite: (p) => p.replace(/^\/api/, ""),
    },
  },
}
```

### 🔧 Environment Variables

Create a `.env.local` (not committed to Git):

```
VITE_API_URL=https://cinemaguide.skillbox.cc
```

---

## 📦 Installation

```sh
git clone https://github.com/Marat-Vodochka/vite-vk-marusya.git
cd vite-vk-marusya
npm install
npm run dev
# Open http://localhost:5173
```

---

## 🏗️ Project Structure

```
src/
├─ app/                 # Redux store, typed hooks
├─ assets/              # Images, svg (imported in code)
├─ components/          # UI components
├─ features/            # Redux slices + RTK Query (e.g., auth)
├─ layouts/             # Layout components
├─ pages/               # Route pages
├─ services/            # Helpers/services
├─ types/               # Shared TS types
├─ declarations.d.ts    # Module declarations
├─ vite-env.d.ts        # Vite env typings
├─ main.tsx
└─ App.tsx
public/                 # Static files
```

---

## 🎯 Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint
- `npm run typecheck` — TypeScript type checking

---

## 🧭 State Management

- Global store with Redux Toolkit
- API layer via RTK Query (auto caching, revalidation)
- Typed hooks: `useAppDispatch`, `useAppSelector`

---

## 🎨 UI Highlights

- **Hero Section:** Random movie showcase, details, quick actions
- **Search:** Real-time suggestions, mobile-optimized modal
- **Authentication:** Login/register forms, protected routes, persistent sessions
- **Movie Management:** Add/remove favorites, genre browsing, responsive grids
- **Design:** Dark theme, adaptive layouts, smooth animations, skeleton loaders, error handling

---

## 🚀 Deployment

### Vercel

```sh
npm install -g vercel
vercel --prod
```

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`

### Manual

```sh
npm run build
# Upload dist/ folder to your hosting provider
```

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests.

---

## 📧 Contact

**Marat Ryspekov**

- [GitHub](https://github.com/Marat-Vodochka)
- [LinkedIn](https://linkedin.com/in/marat-ryspekov)
- [Portfolio](https://ryspekoff.de)

---

⭐ **If you like this project, please give it a star on GitHub!**

**Project Link**: [https://github.com/Marat-Vodochka/vite-vk-marusya]
