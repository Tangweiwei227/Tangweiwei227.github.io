import test from 'node:test';
import assert from 'node:assert/strict';
import { createWindowManager, fitBounds } from '../window-manager.mjs';

const bounds = { x: 100, y: 100, width: 700, height: 500 };

test('reopening an application restores its existing window without duplicating it', () => {
  const manager = createWindowManager();
  const original = manager.open('workshop', { ...bounds });
  manager.minimize('workshop');
  assert.equal(manager.top(), undefined);
  const restored = manager.open('workshop', { x: 0, y: 0, width: 500, height: 400 });
  assert.equal(restored, original);
  assert.equal(manager.windows.size, 1);
  assert.deepEqual(restored.bounds, bounds);
  assert.equal(restored.minimized, false);
});

test('focus, minimize, close and restore maintain the correct foreground window', () => {
  const manager = createWindowManager();
  manager.open('welcome', { ...bounds });
  manager.open('about', { ...bounds });
  assert.equal(manager.top(), 'about');
  manager.focus('welcome');
  assert.equal(manager.top(), 'welcome');
  manager.minimize('welcome');
  assert.equal(manager.top(), 'about');
  manager.close('about');
  assert.equal(manager.top(), undefined);
  manager.focus('welcome');
  assert.equal(manager.top(), 'welcome');
  manager.close('welcome');
  manager.focus('welcome');
  assert.equal(manager.windows.size, 0);
});

test('maximizing and restoring preserves the original window geometry', () => {
  const manager = createWindowManager();
  const win = manager.open('notes', { ...bounds });
  manager.toggleMaximize('notes');
  assert.equal(win.maximized, true);
  manager.toggleMaximize('notes');
  assert.equal(win.maximized, false);
  assert.deepEqual(win.bounds, bounds);
});

test('windows remain reachable after being dragged outside the viewport', () => {
  const viewport = { width: 1024, height: 768 };
  assert.deepEqual(fitBounds({ x: -1000, y: -400, width: 700, height: 500 }, viewport), { x: 12, y: 48, width: 700, height: 500 });
  const fitted = fitBounds({ x: 3000, y: 3000, width: 700, height: 500 }, viewport);
  assert.ok(fitted.x + fitted.width <= viewport.width - 12);
  assert.ok(fitted.y + fitted.height <= viewport.height - 64);
});

test('a viewport shrink fits large windows above the taskbar and below the menu', () => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 500 }, { width: 320, height: 568 }]) {
    const fitted = fitBounds({ x: 1000, y: 1000, width: 2000, height: 1200 }, viewport);
    assert.ok(fitted.width <= viewport.width - 24);
    assert.ok(fitted.height <= viewport.height - 112);
    assert.ok(fitted.y >= 48);
    assert.ok(fitted.x >= 12);
    assert.ok(fitted.x + fitted.width <= viewport.width - 12);
    assert.ok(fitted.y + fitted.height <= viewport.height - 64);
  }
});
