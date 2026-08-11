// The React app is deployed on Vercel, but uploaded images/videos are stored
// and served by the Express API on Render (see server/server.js -> "/uploads").
// The server only ever returns *relative* paths like "/uploads/xyz.jpg", so
// any <img>/<video> that uses that path as-is resolves against the Vercel
// domain and 404s. This helper turns a stored path into a full, working URL.

export const API_BASE = "https://warco-india.onrender.com";

export function resolveMediaUrl(url) {
  if (!url) return "";
  // Already absolute (http/https) — external links, YouTube, Vimeo, etc.
  if (/^https?:\/\//i.test(url)) return url;
  // Relative path returned by our own API, e.g. "/uploads/filename.jpg"
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}
