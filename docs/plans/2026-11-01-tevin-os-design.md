# Tevin OS design and implementation plan

## Confirmed direction
Personal brand and project discovery through a complete warm retro desktop, inspired by the window interaction of PostHog. Default to an open welcome window; visitors can close it and explore desktop applications. Use original styling and artwork, not PostHog branding.

Headline: 我是 Tevin，探索 AI、营销、数据与产品，把想法变成可上线的产品。

Applications: welcome, about, prototype workshop (build.xiaotangtevin.top; under construction), practice notes (blog.xiaotangtevin.top; under construction), shop (shop.xiaotangtevin.top; preparing, no purchase action), Apple Ads AI workspace (under construction, no supplied URL), settings. GitHub is the only confirmed contact channel. Do not invent experience, metrics, customers, availability, or launch dates.

## Architecture
Buildless HTML, CSS, ES modules hosted from repository root; preserve CNAME and GitHub Pages branch deployment. All content in one structured application registry. A small window-state module owns focus, minimizing, closing, and viewport bounds. Render accessible nonmodal windows with independent content; drag/resize writes geometry directly during pointer movement. Mobile windows become full-screen above the taskbar. No backend or API keys.

## Tasks
1. Create `index.html`, `styles.css`, `app.js`, and `window-manager.mjs`; add self-hosted Phosphor icon fonts, local original pixel-art CSS, metadata and favicon.
2. Implement launcher, taskbar, show desktop, window focus/drag/resize/maximize/minimize/restore, keyboard operation, and responsive layouts.
3. Add truthful content for the confirmed applications and browser-local wallpaper/theme preferences with graceful storage failure.
4. Add `tests/window-manager.test.mjs` for state transitions and viewport constraints. Run `npm run check` and `npm test`.
5. Serve locally on port 4173; inspect real desktop and mobile browser UI, exercise window controls, launcher and preferences. Capture preview screenshot; document launch instructions in README. Keep work local for review.

## Acceptance
Welcome is visible initially; all desktop icons open real windows. Taskbar restores minimized windows and switches focus. Dragged/resized windows stay reachable after viewport changes. External links are explicitly visitor-initiated. Settings persist when storage is available. Narrow screens allow readable app navigation without horizontal overflow. Reduced-motion preferences are respected. No fabricated social proof or working product claims.
