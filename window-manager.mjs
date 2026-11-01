export const MOBILE_BREAKPOINT = 700;

export function fitBounds(bounds, viewport) {
  const maxWidth = Math.max(1, viewport.width - 24);
  const maxHeight = Math.max(1, viewport.height - 112);
  const width = Math.min(Math.max(340, bounds.width), maxWidth);
  const height = Math.min(Math.max(300, bounds.height), maxHeight);
  return {
    width, height,
    x: Math.max(12, Math.min(bounds.x, viewport.width - width - 12)),
    y: Math.max(48, Math.min(bounds.y, viewport.height - height - 64)),
  };
}

export function createWindowManager() {
  const windows = new Map();
  let sequence = 0;
  return {
    windows,
    open(id, bounds) {
      if (!windows.has(id)) windows.set(id, { id, bounds, minimized: false, maximized: false, z: 0 });
      const win = windows.get(id);
      win.minimized = false;
      win.z = ++sequence;
      return win;
    },
    focus(id) {
      const win = windows.get(id);
      if (win) { win.minimized = false; win.z = ++sequence; }
    },
    minimize(id) { const win = windows.get(id); if (win) win.minimized = true; },
    close(id) { windows.delete(id); },
    top() { return [...windows.values()].filter(win => !win.minimized).sort((a, b) => b.z - a.z)[0]?.id; },
    toggleMaximize(id) { const win = windows.get(id); if (win) win.maximized = !win.maximized; },
  };
}
