# Cinema Guide (Marusya)

[![CI](https://github.com/maratryspekov/Cinema-Guide-Marusya-/actions/workflows/ci.yml/badge.svg)](https://github.com/maratryspekov/Cinema-Guide-Marusya-/actions/workflows/ci.yml)
[![Playwright Tests](https://img.shields.io/badge/tested%20with-Playwright-45ba4b?logo=playwright)](https://playwright.dev/)

> 🚀 **[Live Demo](https://cinema-guide-marusya.vercel.app)** (if deployed on Vercel)

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
- **Icons:** SVGR (`*.svg?react`), static assets from `src/assets`

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

Create a `.env.local` file in the project root (not committed to Git):

```env
# Vite environment variable for API URL
VITE_API_URL=https://cinemaguide.skillbox.cc

# E2E test credentials (optional, only needed for running Playwright tests locally)
E2E_EMAIL=your-email@example.com
E2E_PASSWORD=your-password
```

> **Note:** You can keep all environment variables in one `.env.local` file. The `E2E_*` variables are only used by Playwright tests. On CI, these are provided via GitHub Secrets.

---

## 📦 Installation

```sh
git clone https://github.com/maratryspekov/Cinema-Guide-Marusya-.git
cd Cinema-Guide-Marusya-
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
- `npm run test:e2e` — Run Playwright E2E tests (Chromium)
- `npm run test:e2e:ui` — Run tests in Playwright UI mode
- `npm run test:e2e:headed` — Run tests with browser visible
- `npm run test:e2e:report` — Open last Playwright HTML report

---

## 🧪 E2E Testing (Playwright)

Run E2E tests locally:

```sh
npm run test:e2e              # Run all tests headless
npm run test:e2e:ui           # Interactive UI mode
npm run test:e2e:headed       # See browser while testing
npm run test:e2e:report       # View last test results
```

**Requirements:**

- E2E credentials must be set in `.env.local` (see Environment Variables section above)
- Dev server should be running on `http://localhost:5173`

**On CI:**

- Tests run automatically on push/PR to main/master
- Credentials are provided via GitHub Secrets: `E2E_EMAIL`, `E2E_PASSWORD`
- Test artifacts (traces, videos) are uploaded on failure

---

## 🧭 State Management

- Global store with Redux Toolkit
- API layer via RTK Query (auto caching, revalidation)
- Typed hooks: `useAppDispatch`, `useAppSelector`

---

## 🏛️ Architecture (short)

- Auth via cookie session (`credentials: "include"`) + RTK Query
- API requests routed through Vite proxy
- User state stored in Redux (auth slice)

---

## ✅ Quality & Testing

- **Code Quality:** ESLint + TypeScript strict mode
- **E2E Testing:** Playwright (auth flows, favorites, search)
- **CI/CD:** GitHub Actions workflow
  - ✓ Lint check
  - ✓ Type checking
  - ✓ E2E tests on Chromium
  - ✓ Automated test reports
- **Responsive Design:** Mobile-first approach with adaptive breakpoints (768px, 1024px)

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

- [GitHub](https://github.com/maratryspekov)
- [LinkedIn](https://linkedin.com/in/marat-ryspekov)
- [Portfolio](https://ryspekoff.de)

---

⭐ **If you like this project, please give it a star on GitHub!**

**Project Link**:https://github.com/maratryspekov/Cinema-Guide-Marusya-
