import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
	  allowedHosts: [
		  '7e37-2403-a080-410-e260-9c5e-7ab3-def7-98af.ngrok-free.app',
		  '192.168.20.3'
	  ],
	  host: true,
  }
})
