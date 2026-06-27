import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/fiekhub/',
  plugins: [react()],
  server: {
    allowedHosts: [
      'shaggy-rabbits-rest.loca.lt',
      'tangy-papers-hang.loca.lt',
      'loud-otters-run.loca.lt',
      'whole-badgers-bow.loca.lt',
      'kind-owls-double.loca.lt',
    ],
  },
})
