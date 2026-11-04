// API base. Same-origin '/api' by default (Vite dev/preview proxy it; in production Spring serves both),
// so browsers never make a cross-origin request. Override with VITE_API_BASE only if the API lives elsewhere.
export const API = (import.meta.env.VITE_API_BASE || '/api').replace(/\/$/, '');
const PROXY = import.meta.env.VITE_PROXY_IMAGES !== 'false';

/** Route biratkings.com images through our own server: same-origin, cached, no hotlink/referrer problems. */
export const asset = u =>
  PROXY && typeof u === 'string' && u.startsWith('https://biratkings.com/') ? `${API}/img?u=${encodeURIComponent(u)}` : u;
