import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
	  allowedHosts: [
		'fc84-2403-a080-410-a0e4-c80e-ee33-9d0c-7006.ngrok-free.app'
	  ],
	  host: true,
  }
})
