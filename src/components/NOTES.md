# HeroPrototype — NOTES (throwaway)

**Question:** which hero opening animation / treatment should ship?
**How:** `npm run dev`, open `/?variant=A…F`. ←/→ keys switch. Switcher hidden in prod builds. Header on `/` is fixed + blurred (`.header--overlay`); hero is `min-height: 100svh` and reserves `--header-height` itself.

Layout: no fades/masks any more. A = WIDE re-render (tower ≈62% of frame height, far right) full-bleed `cover`. B = same clip simply `contain`-fit. C–F = existing clips `contain`-fit, right-aligned, page colour flat-matched to each backdrop. Mobile: copy under the navbar, 9:16 clip fits the remaining row.

- A WIDE re-render · full-bleed cover
- B WIDE re-render · simply fit
- C Studio original · fit
- D Cocoa · fit
- E Plate rosette · fit
- F Floating cascade · fit

**Assets** `public/media/hero/prototype/<id>-<desktop|mobile>.mp4` + `-empty.webp` (poster = frame 0) + `-tower.webp` (end frame; used for reduced motion / autoplay failure / missing clip). Real photo is the locked END frame of every stacking clip (mobile: photo extended upward). Recolours via Nano Banana Pro edits of the photo; clips via FLUX 3 Video 1080p 7–8 s; playback 1.6×; copy reveals at 12%/22% of the clip.

Wide re-render (`w-*`) = MiniMax H3 2K, 5 s, 10 credits each; end frames composed locally from the real cutout on the matching empty backdrop (scratchpad `v4/`).

**Removed (rejected):** Sugar Snow, Oven Bloom, alpha/keyed cutout, full-bleed cover, cream/gold backdrop.

**Verdict:** _(fill in — which variant, why, what to steal from the others)_

**Cleanup:** delete `HeroPrototype.jsx`, `PrototypeSwitcher.jsx`, `hero-prototype.css`, this file and losing assets; restore `<Hero />` in `Home.jsx`; fold the winner into `Hero.jsx` properly (keep overlay header + 100svh hero if approved).
