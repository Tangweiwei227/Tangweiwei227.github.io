import { createWindowManager, fitBounds, MOBILE_BREAKPOINT } from './window-manager.mjs';

const apps = {
  welcome: { title: '欢迎来到 Tevin OS', short: '欢迎', icon: 'house-line', color: 'rust', category: '从这里开始', width: 904, height: 630 },
  about: { title: '关于 Tevin', short: '关于我', icon: 'identification-card', color: 'blue', category: '认识一下', width: 690, height: 555 },
  workshop: { title: '原型工坊', short: '原型工坊', icon: 'hammer', color: 'orange', category: 'AI · 原型 · 产品交付', status: '建设中', width: 730, height: 570, url: 'https://build.xiaotangtevin.top', domain: 'build.xiaotangtevin.top', description: '让需求有形，让原型走向上线。', detail: '我正在构建一个 Web 产品：让用户基于自己的需求制作原型，再由我们提供部署与交付服务。', steps: ['说清你的需求', '把想法做成原型', '部署与交付'], note: '目前产品仍在完善中。你可以先访问工坊，了解当前的探索。', link: '访问原型工坊' },
  notes: { title: '实践笔记', short: '实践笔记', icon: 'notebook', color: 'green', category: '开源项目 · 实践记录', status: '持续建设', width: 700, height: 555, url: 'https://blog.xiaotangtevin.top', domain: 'blog.xiaotangtevin.top', description: '把做过的事，变成可以分享的经验。', detail: '这里会陆续更新小型开源项目和实践笔记，记录探索 AI、营销、数据与产品过程中的思考与尝试。', steps: ['动手实践', '整理与复盘', '记录和开源'], note: '博客内容正在逐步完善。具体文章与项目以博客实际发布为准。', link: '去看看实践笔记' },
  shop: { title: 'Tevin 的小店', short: '我的小店', icon: 'storefront', color: 'pink', category: '一些值得分享的好东西', status: '已上线', width: 660, height: 515, url: 'https://shop.tevin.me', domain: 'shop.tevin.me', description: '小店开门了，欢迎来逛逛。', detail: '一些值得分享的好东西，都放在这里。', link: '逛逛我的小店' },
  ads: { title: 'AI 投放工作台', short: 'AI 投放台', icon: 'chart-line-up', color: 'yellow', category: 'Apple Ads · 原生 AI', status: '建设中', width: 720, height: 555, description: '让 AI 融入苹果商店广告投放的日常。', detail: '面向苹果商店广告投放行业的各类从业者，正在构建一个以 AI 为核心的提效工作台。', note: '产品还在完善中，具体功能与访问入口将随产品进展补充。这里先记录它的方向。' },
  settings: { title: '桌面个性化', short: '个性化', icon: 'sliders-horizontal', color: 'gray', category: '让桌面更像你', width: 610, height: 560 },
};
const desktopOrder = ['about', 'workshop', 'notes', 'shop', 'ads', 'settings'];
const manager = createWindowManager();
const windowsRoot = document.querySelector('#windows');
const launcher = document.querySelector('#launcher');
let launcherReturnFocus = null;
let savedDesktop = [];

const icon = (name, className = '') => `<i class="ph ph-${name} ${className}" aria-hidden="true"></i>`;
const tile = id => `<span class="app-tile ${apps[id].color}">${icon(apps[id].icon)}</span>`;
const externalLink = (url, label, className = 'primary-button') => `<a class="${className}" href="${url}" target="_blank" rel="noopener noreferrer">${label}${icon('arrow-up-right')}<span class="sr-only">（新标签页打开）</span></a>`;
const viewport = () => ({ width: window.innerWidth, height: window.innerHeight });
const announce = message => { document.querySelector('#announcer').textContent = message; };

function readPreferences() {
  try { return JSON.parse(localStorage.getItem('tevin-os-preferences') || '{}') || {}; } catch { return {}; }
}
const savedPreferences = readPreferences();
const preferences = {
  wallpaper: ['meadow', 'apricot', 'blueprint'].includes(savedPreferences.wallpaper) ? savedPreferences.wallpaper : 'meadow',
  theme: ['light', 'dusk'].includes(savedPreferences.theme) ? savedPreferences.theme : 'light',
};
function applyPreferences(save = false) {
  document.body.dataset.wallpaper = preferences.wallpaper;
  document.body.dataset.theme = preferences.theme;
  if (save) {
    try { localStorage.setItem('tevin-os-preferences', JSON.stringify(preferences)); }
    catch { announce('已应用设置；当前浏览器无法保存偏好。'); }
  }
  document.querySelectorAll('[data-wallpaper]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.wallpaper === preferences.wallpaper)));
  document.querySelectorAll('[data-theme]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.theme === preferences.theme)));
}

function sidebar() {
  return `<aside class="window-sidebar"><div class="sidebar-profile"><span class="profile-avatar">t.</span><span><strong>Tevin</strong><small>好奇心常驻</small></span></div><div class="sidebar-caption">我的空间</div><button class="sidebar-link selected" data-open="welcome">${icon('house-line')}欢迎页</button>${['about', 'workshop', 'notes', 'shop', 'ads'].map(id => `<button class="sidebar-link" data-open="${id}">${icon(apps[id].icon)}${apps[id].short}</button>`).join('')}<div class="sidebar-bottom">${externalLink('https://github.com/Tangweiwei227', `${icon('github-logo')} GitHub`, 'sidebar-github')}<span>始终保持探索。</span></div></aside>`;
}

function welcomeContent() {
  return `${sidebar()}<div class="welcome-main"><div class="content-path">个人空间 <span>/</span> 欢迎页 <span class="hello-label">HELLO, WORLD!</span></div><div class="welcome-hero"><div class="hero-copy"><div class="small-kicker"><span class="live-dot"></span>欢迎光临我的数字桌面</div><h1>想法，在这里<br>开始<span class="highlight">运行</span>。</h1><p>我是 <strong>Tevin</strong>，探索 AI、营销、数据与产品，<br class="desktop-break">把想法变成可上线的产品。</p><button class="text-link" data-open="about">认识一下 ${icon('arrow-right')}</button></div><div class="pixel-garden" aria-hidden="true"><div class="garden-frame"><span class="garden-spark spark-one">✦</span><span class="garden-spark spark-two">+</span><div class="pixel-flower"><div class="flower-head"></div><div class="flower-stem"></div><div class="flower-leaf left"></div><div class="flower-leaf right"></div><div class="flower-pot"></div></div><span class="garden-ground"></span></div><span class="garden-caption">GROW SOMETHING GOOD.</span></div></div><div class="section-heading"><h2>正在耕耘的地方</h2><span>从一个想法开始</span></div><div class="project-list">${['workshop', 'notes', 'ads', 'shop'].map(id => `<button class="project-row" data-open="${id}">${tile(id)}<span class="project-row-copy"><strong>${apps[id].title}</strong><small>${apps[id].category}</small></span><span class="status">${apps[id].status}</span>${icon('arrow-up-right', 'row-arrow')}</button>`).join('')}</div><div class="welcome-foot">${icon('cursor-click')}<span class="desktop-only">点击桌面图标探索，也可以拖动窗口，随意逛逛。</span><span class="mobile-only">点击应用探索，通过底部任务栏切换窗口。</span></div></div>`;
}

function aboutContent() {
  return `<div class="document-content about-content"><div class="document-topline">README.md <span>关于这个桌面的主人</span></div><div class="about-intro"><div class="about-avatar">t.<span>${icon('sparkle')}</span></div><div><span class="small-kicker">你好，很高兴认识你</span><h1>我是 Tevin<span class="rust-text">.</span></h1></div></div><p class="about-statement">探索 AI、营销、数据与产品，<br>把想法变成可上线的产品。</p><p class="body-copy">这个桌面，是我在互联网上的一小块空间。这里放着我正在构建的产品，也会慢慢积累实践记录与开源项目。</p><div class="interest-tags"><span>AI</span><span>营销</span><span>数据</span><span>产品</span></div><div class="about-note">${icon('plant')}<p>很多事情还在生长中。<br><strong>欢迎你从这里，认识我的想法与实践。</strong></p></div><div class="document-actions">${externalLink('https://github.com/Tangweiwei227', `${icon('github-logo')} 在 GitHub 找到我`)}<button class="secondary-button" data-open="workshop">看看原型工坊 ${icon('arrow-right')}</button></div></div>`;
}

function productContent(id) {
  const app = apps[id];
  const motif = id === 'shop' ? 'storefront' : id === 'ads' ? 'chart-line-up' : id === 'notes' ? 'pencil-line' : 'cube';
  return `<div class="document-content product-content ${app.color}"><div class="document-topline">${app.category}<span class="status">${app.status}</span></div><div class="product-banner">${tile(id)}<span class="product-banner-name">${id === 'workshop' ? 'BUILD IDEAS.' : id === 'notes' ? 'LEARN BY DOING.' : id === 'shop' ? 'GOOD THINGS INSIDE.' : 'WORK SMARTER.'}</span>${icon(motif, 'product-watermark')}</div><h1>${app.title}</h1><h2 class="product-tagline">${app.description}</h2><p class="body-copy">${app.detail}</p>${app.steps ? `<ol class="product-steps">${app.steps.map((step, index) => `<li><span>0${index + 1}</span>${step}</li>`).join('')}</ol>` : ''}${app.note ? `<div class="construction-note">${icon('info')}<p>${app.note}</p></div>` : ''}<div class="document-actions">${app.url ? externalLink(app.url, app.link) : `<span class="coming-soon">${icon('hourglass-medium')} 访问入口，稍后见</span>`}${app.domain ? `<span class="domain-label">${app.domain}</span>` : ''}</div></div>`;
}

function settingsContent() {
  return `<div class="document-content settings-content"><div class="document-topline">桌面偏好 <span>只保存在你的浏览器</span></div><h1>给桌面换个心情。</h1><h2>选择一张壁纸</h2><div class="wallpaper-options">${[['meadow', '鼠尾草原野'], ['apricot', '杏色午后'], ['blueprint', '蓝色手稿']].map(([id, name]) => `<button class="wallpaper-option" data-wallpaper="${id}" aria-pressed="${preferences.wallpaper === id}"><span class="wallpaper-preview ${id}"><span></span></span><strong>${name}</strong>${icon('check-circle')}</button>`).join('')}</div><h2>窗口主题</h2><div class="theme-options"><button data-theme="light" aria-pressed="${preferences.theme === 'light'}">${icon('sun')}纸张浅色</button><button data-theme="dusk" aria-pressed="${preferences.theme === 'dusk'}">${icon('moon')}暮色深色</button></div><div class="settings-help">${icon('keyboard')}<div><strong>一点桌面小技巧</strong><p class="desktop-only">单击图标打开应用；拖动标题栏移动窗口。<br>双击标题栏最大化，右下角可以调整大小。<br><kbd>⌘ / Ctrl</kbd> + <kbd>K</kbd> 搜索应用；<kbd>Esc</kbd> 关闭菜单。</p><p class="desktop-only">键盘聚焦标题栏或缩放手柄后，可用方向键调整。</p><p class="mobile-only">点击图标打开应用，通过底部任务栏切换。<br>点窗口右上角的关闭或最小化按钮，返回桌面。</p></div></div><button class="text-link" data-action="reset">${icon('arrow-counter-clockwise')}恢复默认桌面设置</button></div>`;
}

function contentFor(id) {
  if (id === 'welcome') return welcomeContent();
  if (id === 'about') return aboutContent();
  if (id === 'settings') return settingsContent();
  return productContent(id);
}

function defaultBounds(id) {
  const app = apps[id];
  const offset = (manager.windows.size % 5) * 24;
  return fitBounds({ x: (innerWidth - app.width) / 2 + offset, y: Math.max(78, (innerHeight - app.height) / 2 - 12) + offset, width: app.width, height: app.height }, viewport());
}

function openApp(id, { focus = true } = {}) {
  if (!apps[id]) return;
  closeLauncher(false);
  const isNew = !manager.windows.has(id);
  const win = manager.open(id, defaultBounds(id));
  if (isNew) {
    const element = document.createElement('section');
    element.className = `app-window ${id === 'welcome' ? 'welcome-window' : ''}`;
    element.id = `window-${id}`;
    element.dataset.app = id;
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-labelledby', `title-${id}`);
    element.innerHTML = `<header class="window-titlebar" tabindex="0" aria-label="移动${apps[id].title}窗口，使用方向键"><span class="window-title">${icon(apps[id].icon)}<strong id="title-${id}">${apps[id].title}</strong></span><div class="window-controls"><button data-action="minimize" aria-label="最小化${apps[id].title}" title="最小化">${icon('minus')}</button><button data-action="maximize" aria-label="最大化${apps[id].title}" title="最大化">${icon('square')}</button><button data-action="close" class="close-control" aria-label="关闭${apps[id].title}" title="关闭">${icon('x')}</button></div></header><div class="window-body">${contentFor(id)}</div><button class="resize-handle" aria-label="调整${apps[id].title}窗口大小，使用方向键" title="拖动调整大小">${icon('dots-six')}</button>`;
    windowsRoot.append(element);
    attachWindowEvents(element, win);
  }
  renderState();
  if (focus) document.querySelector(`#window-${id} .window-titlebar`).focus({ preventScroll: true });
  announce(`已打开${apps[id].title}`);
}

function positionWindow(win) {
  const element = document.getElementById(`window-${win.id}`);
  const bounds = win.maximized ? { x: 12, y: 48, width: innerWidth - 24, height: innerHeight - 112 } : win.bounds;
  Object.entries(bounds).forEach(([key, value]) => element.style.setProperty(`--${key}`, `${value}px`));
  element.classList.toggle('maximized', win.maximized);
  element.style.zIndex = win.z;
  element.hidden = win.minimized;
}

function renderState() {
  const top = manager.top();
  for (const win of manager.windows.values()) {
    positionWindow(win);
    const element = document.getElementById(`window-${win.id}`);
    element.classList.toggle('active', top === win.id);
    const maxButton = element.querySelector('[data-action="maximize"]');
    maxButton.setAttribute('aria-label', `${win.maximized ? '还原' : '最大化'}${apps[win.id].title}`);
    maxButton.title = win.maximized ? '还原' : '最大化';
    maxButton.innerHTML = icon(win.maximized ? 'copy' : 'square');
  }
  document.querySelector('#tasks').innerHTML = [...manager.windows.values()].map(win => `<button class="task-button ${top === win.id ? 'active' : ''} ${win.minimized ? 'minimized' : ''}" data-task="${win.id}" aria-label="${win.minimized ? '还原' : '切换到'}${apps[win.id].title}" aria-pressed="${top === win.id}">${icon(apps[win.id].icon)}<span>${apps[win.id].short}</span><span class="task-indicator"></span></button>`).join('');
}

function attachWindowEvents(element, win) {
  element.addEventListener('pointerdown', () => {
    if (manager.top() !== win.id) { manager.focus(win.id); renderState(); }
  });
  element.addEventListener('focusin', () => {
    if (manager.top() !== win.id) { manager.focus(win.id); renderState(); }
  });
  const titlebar = element.querySelector('.window-titlebar');
  const handle = element.querySelector('.resize-handle');
  titlebar.addEventListener('dblclick', event => {
    if (!event.target.closest('button') && innerWidth > MOBILE_BREAKPOINT) { manager.toggleMaximize(win.id); renderState(); }
  });
  function manipulate(event, resize) {
    if (event.button !== 0 || innerWidth <= MOBILE_BREAKPOINT || win.maximized || (!resize && event.target.closest('button'))) return;
    event.preventDefault();
    const control = event.currentTarget;
    control.focus({ preventScroll: true });
    const initial = { ...win.bounds };
    const startX = event.clientX, startY = event.clientY;
    control.setPointerCapture(event.pointerId);
    element.classList.add('manipulating');
    const move = next => {
      const dx = next.clientX - startX, dy = next.clientY - startY;
      let nextBounds = resize ? { ...initial, width: initial.width + dx, height: initial.height + dy } : { ...initial, x: initial.x + dx, y: initial.y + dy };
      if (resize) { nextBounds.width = Math.min(nextBounds.width, innerWidth - initial.x - 12); nextBounds.height = Math.min(nextBounds.height, innerHeight - initial.y - 64); }
      win.bounds = fitBounds(nextBounds, viewport());
      positionWindow(win);
    };
    const finish = () => {
      element.classList.remove('manipulating');
      control.removeEventListener('pointermove', move);
      control.removeEventListener('pointerup', finish);
      control.removeEventListener('pointercancel', finish);
      control.removeEventListener('lostpointercapture', finish);
    };
    control.addEventListener('pointermove', move);
    control.addEventListener('pointerup', finish);
    control.addEventListener('pointercancel', finish);
    control.addEventListener('lostpointercapture', finish);
  }
  titlebar.addEventListener('pointerdown', event => manipulate(event, false));
  handle.addEventListener('pointerdown', event => manipulate(event, true));
  for (const [control, resize] of [[titlebar, false], [handle, true]]) {
    control.addEventListener('keydown', event => {
      if (event.target !== control || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) || innerWidth <= MOBILE_BREAKPOINT || win.maximized) return;
      event.preventDefault();
      const amount = event.shiftKey ? 40 : 10;
      const dx = event.key === 'ArrowRight' ? amount : event.key === 'ArrowLeft' ? -amount : 0;
      const dy = event.key === 'ArrowDown' ? amount : event.key === 'ArrowUp' ? -amount : 0;
      win.bounds = fitBounds(resize ? { ...win.bounds, width: win.bounds.width + dx, height: win.bounds.height + dy } : { ...win.bounds, x: win.bounds.x + dx, y: win.bounds.y + dy }, viewport());
      positionWindow(win);
    });
  }
}

function renderLauncher(query = '') {
  const results = Object.keys(apps).filter(id => `${apps[id].title} ${apps[id].category}`.toLowerCase().includes(query.toLowerCase().trim()));
  document.querySelector('#launcher-apps').innerHTML = results.length ? results.map(id => `<button class="launcher-app" data-open="${id}">${tile(id)}<span><strong>${apps[id].title}</strong><small>${apps[id].category}</small></span>${icon('arrow-right')}</button>`).join('') : '<div class="search-empty">没有找到应用，换个关键词试试。</div>';
}

function openLauncher() {
  launcherReturnFocus = document.activeElement;
  launcher.hidden = false;
  document.querySelectorAll('[data-action="launcher"]').forEach(button => button.setAttribute('aria-expanded', 'true'));
  document.querySelector('#app-search').value = '';
  renderLauncher();
  document.querySelector('#app-search').focus();
}
function closeLauncher(restoreFocus = true) {
  if (launcher.hidden) return;
  launcher.hidden = true;
  document.querySelectorAll('[data-action="launcher"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  if (restoreFocus && launcherReturnFocus?.isConnected) launcherReturnFocus.focus({ preventScroll: true });
}

document.querySelector('#desktop-apps').innerHTML = desktopOrder.map(id => `<button class="desktop-icon" data-open="${id}">${tile(id)}<span>${apps[id].short}</span></button>`).join('');

document.addEventListener('click', event => {
  const target = event.target.closest('button, a');
  if (!target) return;
  if (target.dataset.open) return openApp(target.dataset.open);
  if (target.dataset.task) {
    const id = target.dataset.task;
    if (manager.top() === id) manager.minimize(id); else manager.focus(id);
    renderState();
    const top = manager.top();
    (top ? document.querySelector(`#window-${top} .window-titlebar`) : document.querySelector('.start-button'))?.focus({ preventScroll: true });
    announce(top ? `已切换到${apps[top].title}` : '已显示桌面。');
    return;
  }
  if (target.dataset.wallpaper) { preferences.wallpaper = target.dataset.wallpaper; applyPreferences(true); return; }
  if (target.dataset.theme) { preferences.theme = target.dataset.theme; applyPreferences(true); return; }
  const action = target.dataset.action;
  if (action === 'launcher') return launcher.hidden ? openLauncher() : closeLauncher();
  if (action === 'close-launcher') return closeLauncher();
  if (action === 'desktop') {
    closeLauncher(false);
    const visible = [...manager.windows.values()].filter(win => !win.minimized).sort((a, b) => a.z - b.z).map(win => win.id);
    if (visible.length) { savedDesktop = visible; visible.forEach(id => manager.minimize(id)); }
    else { savedDesktop.forEach(id => manager.focus(id)); savedDesktop = []; }
    renderState();
    announce(visible.length ? '已显示桌面，再次点击可恢复窗口。' : '已恢复窗口。');
    return;
  }
  if (action === 'reset') {
    preferences.wallpaper = 'meadow'; preferences.theme = 'light'; applyPreferences(true);
    for (const win of manager.windows.values()) { win.bounds = defaultBounds(win.id); win.maximized = false; }
    renderState(); announce('已恢复默认壁纸、主题和窗口位置。'); return;
  }
  const id = target.closest('.app-window')?.dataset.app;
  if (!id) return;
  if (action === 'minimize') manager.minimize(id);
  if (action === 'maximize') manager.toggleMaximize(id);
  if (action === 'close') { manager.close(id); document.getElementById(`window-${id}`).remove(); }
  if (['minimize', 'maximize', 'close'].includes(action)) {
    renderState();
    const top = manager.top();
    if (action !== 'maximize') {
      const destination = top ? document.querySelector(`#window-${top} .window-titlebar`) : document.querySelector(`[data-open="${id}"]`) || document.querySelector('.start-button');
      destination?.focus({ preventScroll: true });
    }
    announce(`${apps[id].title}已${action === 'close' ? '关闭' : action === 'minimize' ? '最小化' : '调整'}`);
  }
});

document.addEventListener('pointerdown', event => {
  if (!launcher.hidden && !event.target.closest('#launcher, [data-action="launcher"]')) closeLauncher(false);
});
document.querySelector('#app-search').addEventListener('input', event => renderLauncher(event.target.value));
document.querySelector('#app-search').addEventListener('keydown', event => {
  if (event.key === 'Enter') document.querySelector('#launcher-apps [data-open]')?.click();
  if (event.key === 'ArrowDown') { event.preventDefault(); document.querySelector('#launcher-apps [data-open]')?.focus(); }
});
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); launcher.hidden ? openLauncher() : closeLauncher(); }
  if (event.key === 'Escape' && !launcher.hidden) { event.preventDefault(); closeLauncher(); }
  if (event.key === 'Tab' && !launcher.hidden) {
    const controls = [...launcher.querySelectorAll('button, input')];
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
window.addEventListener('resize', () => {
  if (innerWidth > MOBILE_BREAKPOINT) {
    for (const win of manager.windows.values()) win.bounds = fitBounds(win.bounds, viewport());
  }
  renderState();
});
function updateClock() {
  const now = new Date();
  const clock = document.querySelector('#clock');
  clock.textContent = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
  clock.dateTime = now.toISOString();
  clock.title = '北京时间';
}
applyPreferences();
updateClock();
setInterval(updateClock, 30000);
openApp('welcome', { focus: false });
