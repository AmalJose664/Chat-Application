import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
	  allowedHosts: [
		  '7cc4-2403-a080-410-3da0-10d7-f012-46d8-6051.ngrok-free.app',
		  '192.168.253.21'
	  ],
	  host: true,
  }
})
