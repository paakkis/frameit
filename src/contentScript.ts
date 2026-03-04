const BADGE_CLASS = "faceit-pix-badge";
const OVERLAY_CLASS = "faceit-pix-overlay";
const STYLE_ID = "faceit-pix-style";
const STORAGE_KEY = "badgeImageUrl";

const badgeSvg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#ff6b00"/>
        <stop offset="100%" stop-color="#ffb347"/>
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="22" fill="url(#g)" />
    <path d="M25 10l-9 16h7l-2 12 9-16h-7z" fill="#1c1c1c"/>
  </svg>`
);

const defaultBadgeUrl = `data:image/svg+xml,${badgeSvg}`;
let currentBadgeUrl = defaultBadgeUrl;

const candidateSelectors = [
    "img[alt*='avatar' i]",
    "img[alt*='profile' i]",
    "[class*='avatar' i] img",
    "[class*='profile' i] img",
];

const ensureStyle = () => {
    const existing = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (existing) {
        if (existing.dataset.badgeUrl === currentBadgeUrl) return;
        existing.remove();
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.dataset.badgeUrl = currentBadgeUrl;
    style.textContent = `
    .${OVERLAY_CLASS} {
      display: inline-flex;
      position: absolute;
      width: 100%;
      height: 100%;
      inset-block-start: 0px;
      inset-inline-start: 0px;
      pointer-events: none;
    }
    .${BADGE_CLASS} {
      position: absolute;
      inset-block-start: calc(-1 * var(--faceit-pix-offset, 16px));
      inset-inline-start: calc(-1 * var(--faceit-pix-offset, 16px));
      block-size: calc(100% + var(--faceit-pix-extra, 32px));
      inline-size: calc(100% + var(--faceit-pix-extra, 32px));
      contain: paint;
      max-width: initial;
      max-height: initial;
      pointer-events: none;
    }
  `;
    document.head.appendChild(style);
};

const isLargeEnough = (img: HTMLImageElement) =>
    img.naturalWidth >= 64 && img.naturalHeight >= 64;

const attachBadge = (img: HTMLImageElement) => {
    const holder =
        img.closest<HTMLElement>("[class*='Avatar__AvatarHolder' i]") ??
        img.parentElement;
    if (!holder || holder.querySelector(`.${BADGE_CLASS}`)) return;

    const container =
        holder.querySelector<HTMLElement>("[class*='styles__Container' i]") ?? holder;

    const overlay = document.createElement("div");
    overlay.className = OVERLAY_CLASS;
    const holderSize = Math.max(holder.clientWidth, holder.clientHeight);
    const extra = Math.round(Math.max(12, Math.min(32, holderSize * 0.3)));
    const offset = Math.round(extra / 2);
    overlay.style.setProperty("--faceit-pix-extra", `${extra}px`);
    overlay.style.setProperty("--faceit-pix-offset", `${offset}px`);

    const frame = document.createElement("img");
    frame.className = BADGE_CLASS;
  frame.alt = "FrameIt frame";
    frame.decoding = "async";
    frame.src = currentBadgeUrl;
    overlay.appendChild(frame);

    container.insertBefore(overlay, container.firstChild);
};

const processImage = (img: HTMLImageElement) => {
    if (img.dataset.faceitPixChecked) return;
    img.dataset.faceitPixChecked = "1";

    const apply = () => {
        if (isLargeEnough(img)) {
            attachBadge(img);
        }
    };

    if (img.complete) {
        apply();
    } else {
        img.addEventListener("load", apply, { once: true });
    }
};

const scan = () => {
    ensureStyle();
    const images = candidateSelectors.flatMap((selector) =>
        Array.from(document.querySelectorAll<HTMLImageElement>(selector))
    );
    images.forEach(processImage);
};

const setBadgeUrl = (value?: string) => {
    const next = value?.trim() || defaultBadgeUrl;
    if (next === currentBadgeUrl) return;
    currentBadgeUrl = next;
    ensureStyle();
    document
        .querySelectorAll<HTMLImageElement>(`.${BADGE_CLASS}`)
        .forEach((badge) => {
            badge.src = currentBadgeUrl;
        });
};

chrome.storage.sync.get([STORAGE_KEY], (result) => {
    setBadgeUrl(result[STORAGE_KEY]);
    scan();
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync" || !changes[STORAGE_KEY]) return;
    setBadgeUrl(changes[STORAGE_KEY].newValue);
});

const observer = new MutationObserver(() => scan());
observer.observe(document.documentElement, { childList: true, subtree: true });
