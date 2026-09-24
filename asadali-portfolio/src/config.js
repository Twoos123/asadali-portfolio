// Backend (contact form, site editor): the Render service in production, local otherwise.
export const API_BASE =
  process.env.NODE_ENV === 'production' ? 'https://asadali-portfolio.onrender.com' : 'http://localhost:5000';
