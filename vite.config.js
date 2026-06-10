import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages: Wenn die Seite unter einer Custom Domain läuft (z.B. tippspiel.regiontullnerfeldcup.at),
  // ist base: '/' korrekt. Falls unter username.github.io/repo-name/, hier '/repo-name/' setzen.
  base: '/',
})
