/**
 * Image resilience helpers. Demo datasets often link to photo CDNs that
 * rot over time; when an image fails we swap in a local gradient SVG so
 * the UI never shows a broken-image icon (works fully offline).
 * @module utils/imageFallback
 */

const GRADIENT_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%236366f1'/><stop offset='1' stop-color='%23f43f5e'/></linearGradient></defs><rect width='900' height='600' fill='url(%23g)'/><text x='50%25' y='50%25' font-family='sans-serif' font-size='56' font-weight='bold' fill='rgba(255,255,255,0.85)' text-anchor='middle' dominant-baseline='middle'>StayFinder</text></svg>`;

/**
 * onError handler for <img>: replaces a broken source with the
 * local placeholder exactly once (no loops).
 * @param {import("react").SyntheticEvent<HTMLImageElement>} event
 */
export function handleImageError(event) {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = "1";
  img.src = GRADIENT_PLACEHOLDER;
}
