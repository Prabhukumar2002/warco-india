import React from "react";
import { resolveMediaUrl } from "../mediaUrl";

function toEmbedUrl(absoluteUrl) {
  try {
    const u = new URL(absoluteUrl);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return absoluteUrl;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace("/", "");
      return `https://player.vimeo.com/video/${id}`;
    }
    // Google Drive share links ("/file/d/<id>/view") need the /preview form
    // to be embeddable in an iframe — the normal share link refuses to load.
    if (u.hostname.includes("drive.google.com")) {
      const match = u.pathname.match(/\/file\/d\/([^/]+)/);
      const id = match ? match[1] : u.searchParams.get("id");
      if (id) return `https://drive.google.com/file/d/${id}/preview`;
    }
  } catch {
    return null;
  }
  return null;
}

export default function VideoEmbed({ url }) {
  if (!url) return null;
  // Support both external links (YouTube/Vimeo/Drive) and files uploaded
  // to our own server, which only come back as a relative "/uploads/..." path.
  const absoluteUrl = resolveMediaUrl(url);
  const embedUrl = toEmbedUrl(absoluteUrl);

  return (
    <div className="video-embed">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title="WARCO INDIA video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video controls preload="metadata" src={absoluteUrl}>
          Your browser does not support embedded video.
        </video>
      )}
    </div>
  );
}
