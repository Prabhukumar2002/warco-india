import React, { useState } from "react";
import { resolveMediaUrl } from "../mediaUrl";

/**
 * A stacked/layered carousel: the active image sits centered and large,
 * with neighbouring images peeking out, scaled down, behind it on either
 * side — similar to the title-card rows on JioHotstar. Click an image or
 * use the arrows to bring it to the front.
 */
export default function StackedCarousel({ images }) {
  const [active, setActive] = useState(0);
  const count = images.length;

  if (count === 0) return null;

  const goTo = (i) => setActive(((i % count) + count) % count);
  const prev = () => goTo(active - 1);
  const next = () => goTo(active + 1);

  return (
    <div className="stacked-carousel">
      <button
        type="button"
        className="stacked-carousel-arrow left"
        onClick={prev}
        aria-label="Previous image"
      >
        ‹
      </button>

      <div className="stacked-carousel-track">
        {images.map((img, i) => {
          let offset = i - active;
          // wrap around so the stack never looks lopsided
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;

          const abs = Math.abs(offset);
          if (abs > 3) return null; // only render nearby cards

          const scale = Math.max(1 - abs * 0.16, 0.55);
          const translateX = offset * 62;
          const zIndex = 100 - abs;
          const opacity = abs > 3 ? 0 : 1 - abs * 0.18;

          return (
            <div
              key={img.id}
              className={"stacked-carousel-card" + (offset === 0 ? " active" : "")}
              style={{
                transform: `translateX(${translateX}%) scale(${scale})`,
                zIndex,
                opacity,
              }}
              onClick={() => goTo(i)}
            >
              <img src={resolveMediaUrl(img.url)} alt={img.caption || "Awareness"} loading="lazy" />
              {offset === 0 && img.caption && (
                <p className="stacked-carousel-caption">{img.caption}</p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="stacked-carousel-arrow right"
        onClick={next}
        aria-label="Next image"
      >
        ›
      </button>

      <div className="stacked-carousel-dots">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            className={"stacked-carousel-dot" + (i === active ? " active" : "")}
            onClick={() => goTo(i)}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
