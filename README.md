# FrameIt

React-based Chrome/Firefox extension that overlays a custom frame on Faceit
profile avatars.

## Dev
1. `npm install`
2. `npm run dev`
3. Load the unpacked extension from `dist/`

## Build
- `npm run build` then load `dist/` in Chrome or Firefox (Zen).

## Notes
- The content script targets `https://www.faceit.com/*`.
- The badge is injected on likely avatar images; tweak selectors in
  `src/contentScript.ts` if Faceit changes their DOM.
