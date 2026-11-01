# Tevin OS validation — 2026-11-01

## Automated checks

- `npm run check`: passed.
- `npm test`: 5 tests passed (window reuse, foreground ordering, minimize/close/restore, maximize geometry, viewport bounds).
- `git diff --check`: passed.

## Real Chrome browser checks

- Desktop viewport: 1299 × 902. Initial welcome, six desktop entries, taskbar, wallpaper, note and self-hosted icons render.
- Pointer drag moved the welcome window from its original position to x=277.5, y=190. Maximize filled the desktop area below the menu and above the taskbar; restore retained prior bounds.
- Keyboard resize increased width from 884 to 894 in the initial build. Pointer resize in the final build reduced welcome to 357px; sidebar disappeared and content became one column, with no horizontal overflow (clientWidth=scrollWidth=354).
- Minimize removed the welcome dialog from visible UI; its taskbar entry restored it.
- All product/about views render their confirmed positioning. Workshop and notes expose the supplied URLs. Shop has no purchase/link action. AI workspace has no invented URL.
- Switching to apricot wallpaper and dusk theme persisted across reload; reset returned to meadow/light.
- App menu search for 投放 returned AI workspace; Enter opened it. Unknown query rendered an empty state; Escape dismissed the menu.
- Mobile 390 × 844: welcome, AI workspace, about, shop and notes inspected. Window clientWidth and scrollWidth both 371; page width 390.
- Mobile 320 × 568: page width 320; window body clientWidth and scrollWidth both 301. Body scroll keeps remaining projects reachable.
- Temporary viewport override reset after QA.
- Final browser warning/error log: empty.

## Delivery state

Local implementation and preview only; no push or deployment performed. Existing CNAME remains unchanged. Public website is still the previous version until main is updated.
