import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.VITE_API_URL;

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
     '/login': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/login/, '/login')
     },
     '/register': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/register/, '/register')
     },
     '/reset_request': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/reset_request/, '/reset_request')
     },
     '/reset_confirmation': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/reset_confirmation\/([a-zA-Z0-9]+)/, '/reset_confirmation/$1'),
     },
     '/secretkey': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/secretkey\/([a-zA-Z0-9]+)/, '/secretkey/$1'),
     },
     '/message': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/message\/([a-zA-Z0-9]+)/, '/message/$1'),
     },
     '/auth_success': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/auth_success/, '/auth_success')
     },
     '/userdataprofile': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/userdataprofile/, '/userdataprofile')
     },
     '/name_': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/name_/, '/name_')
     },
     '/username_': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/username_/, '/username_')
     },
     '/add_email_': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/add_email_/, '/add_email_')
     },
     '/email_': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/email_/, '/email_')
     },
     '/password_': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/password_/, '/password_')
     },
     '/deletion': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/deletion/, '/deletion')
     },
     '/logout': {
       target: API_URL,
       changeOrigin: true,
       rewrite: (path) => path.replace(/^\/logout/, '/logout')
     }
    }
  }
})


