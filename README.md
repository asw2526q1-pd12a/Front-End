# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Environments & Commands

This project is configured with **Vite** to handle different environments (Development vs Production).

### 1. Environment Files

- **`.env.development`**: Contains variables for the **development** environment (e.g., local API).
- **`.env.production`**: Contains variables for the **production** environment (e.g., hosted live API).

Vite automatically loads the file corresponding to the mode you are running.

### 2. Commands

#### Development Mode

Runs the app locally with hot-reloading using settings from `.env.development`.

```bash
npm run dev
# Loads: .env.development
# API URL: http://localhost:3000
```

#### Production Build

Builds the app for deployment. This process uses the **production** configuration by default.

```bash
npm run build
# Loads: .env.production
# API URL: https://projecte-asw.onrender.com
# Output: dist/ folder
```

#### Local Production Preview

After building, you can verify the production build locally. This is useful to test if the production API is verifying correctly before deploying.

```bash
npm run preview
# Serves the "dist/" folder
# Uses the production API URL as built above
```
