import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Content-Security-Policy for the built site (GitHub Pages can't send headers, so it goes in
// a <meta> tag). Scripts may only come from the site itself, which stops injected scripts
// from running, e.g. to steal the editor session. Not applied to the dev server, whose hot
// reload needs inline scripts. connect-src must include API_BASE from src/config.js.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://asadali-portfolio.onrender.com https://drive.google.com https://docs.google.com",
  "frame-src https://drive.google.com https://docs.google.com https://*.google.com https://*.googleusercontent.com",
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const contentSecurityPolicy = {
  name: 'content-security-policy',
  apply: 'build',
  transformIndexHtml: () => [
    { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY }, injectTo: 'head-prepend' },
    { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
  ],
};

export default defineConfig({
  plugins: [
    react({
      include: '**/*.{js,jsx,ts,tsx}',
    }),
    contentSecurityPolicy,
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
  define: {
    'process.env.PUBLIC_URL': JSON.stringify(''),
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
});
