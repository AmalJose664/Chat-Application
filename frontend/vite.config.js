import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
	  allowedHosts: [
		  '36f1-103-182-166-208.ngrok-free.app',
	  ],
	  host: true,
  }
})
