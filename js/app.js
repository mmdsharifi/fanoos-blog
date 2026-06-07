/* ============================================
   بلاگ فانوس — App Logic
   ============================================ */

// --- Theme Management ---

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme() {
  return localStorage.getItem('fanoos-theme');
}

function getCurrentTheme() {
  return getStoredTheme() || getSystemTheme();
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
  updateHighlightTheme(theme);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  btn.setAttribute('aria-label', theme === 'dark' ? 'تغییر به تم روشن' : 'تغییر به تم تاریک');
}

function updateHighlightTheme(theme) {
  const hlLink = document.getElementById('hljs-theme');
  if (!hlLink) return;
  const base = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/';
  hlLink.href = theme === 'dark' ? base + 'github-dark.min.css' : base + 'github.min.css';
}

function initTheme() {
  const stored = getStoredTheme();
  if (stored) {
    applyTheme(stored);
  } else {
    // Follow system — don't set data-theme so CSS @media handles it
    updateThemeIcon(getSystemTheme());
    updateHighlightTheme(getSystemTheme());
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getStoredTheme()) {
      updateThemeIcon(e.matches ? 'dark' : 'light');
      updateHighlightTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Toggle button
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || getSystemTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('fanoos-theme', next);
      applyTheme(next);
    });
  }
}

// --- Relative Time (Persian) ---

function toPersianDigits(str) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/[0-9]/g, w => persianDigits[parseInt(w, 10)]);
}

function relativeTime(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'همین الان';
  if (diffMin < 60) return `${toPersianDigits(diffMin)} دقیقه پیش`;
  if (diffHour < 24) return `${toPersianDigits(diffHour)} ساعت پیش`;
  if (diffDay === 1) return 'دیروز';
  if (diffDay < 30) return `${toPersianDigits(diffDay)} روز پیش`;
  if (diffMonth === 1) return 'یک ماه پیش';
  if (diffMonth < 12) return `${toPersianDigits(diffMonth)} ماه پیش`;
  if (diffYear === 1) return 'یک سال پیش';
  return `${toPersianDigits(diffYear)} سال پیش`;
}

// --- Post List (Index Page) ---

let allPosts = [];

async function loadPostList() {
  const listEl = document.getElementById('post-list');
  if (!listEl) return;

  try {
    const res = await fetch('posts/index.json');
    if (!res.ok) throw new Error('خطا در بارگذاری لیست پست\u200cها');
    allPosts = await res.json();

    // Check for tag filter in URL
    const params = new URLSearchParams(window.location.search);
    const filterTag = params.get('tag');

    renderPostList(listEl, filterTag);

  } catch (err) {
    listEl.innerHTML = `<div class="error-message"><h2>خطا</h2><p>${escapeHtml(err.message)}</p></div>`;
  }
}

function renderPostList(listEl, filterTag) {
  let posts = allPosts;

  if (filterTag) {
    posts = allPosts.filter(p => p.tags && p.tags.includes(filterTag));
  }

  if (posts.length === 0) {
    listEl.innerHTML = `
      <div class="loading">
        ${filterTag ? `پستی با تگ «${escapeHtml(filterTag)}» پیدا نشد. <a href="./">نمایش همه</a>` : 'هنوز پستی نوشته نشده.'}
      </div>
    `;
    return;
  }

  // Show active filter
  const filterHtml = filterTag ? `
    <div class="active-filter">
      <span>فیلتر: <span class="tag">${escapeHtml(filterTag)}</span></span>
      <a href="./" class="clear-filter">✕ حذف فیلتر</a>
    </div>
  ` : '';

  listEl.innerHTML = filterHtml + posts.map(post => `
    <li class="post-item">
      <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="post-link">
        <h2 class="post-title">${escapeHtml(post.title)}</h2>
        ${post.excerpt ? `<p class="post-excerpt">${escapeHtml(post.excerpt)}</p>` : ''}
        <div class="post-meta">
          <span class="post-date">${toPersianDigits(escapeHtml(post.date))}</span>
        </div>
      </a>
    </li>
  `).join('');
}

// --- Post Rendering (Post Page) ---

async function loadPost() {
  const contentEl = document.getElementById('post-content');
  const headerEl = document.getElementById('post-header');
  if (!contentEl) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    showPostError(contentEl, headerEl);
    return;
  }

  try {
    // Load post metadata
    const indexRes = await fetch('posts/index.json');
    if (!indexRes.ok) throw new Error('خطا در بارگذاری');
    const posts = await indexRes.json();
    const postMeta = posts.find(p => p.slug === slug);

    // Load markdown file
    const mdRes = await fetch(`posts/${encodeURIComponent(slug)}.md`);
    if (!mdRes.ok) {
      showPostError(contentEl, headerEl);
      return;
    }
    const mdText = await mdRes.text();

    // Render header
    if (headerEl && postMeta) {
      document.title = `${postMeta.title} — فانوس`;
      const lastEditedHtml = postMeta.lastEdited
        ? `<span class="post-last-edited">آخرین ویرایش: ${relativeTime(postMeta.lastEdited)}</span>`
        : '';
      headerEl.innerHTML = `
        <h1 class="post-title">${escapeHtml(postMeta.title)}</h1>
        <div class="post-meta">
          <span class="post-date">${toPersianDigits(escapeHtml(postMeta.date))}</span>
          ${lastEditedHtml}
        </div>
        ${postMeta.tags && postMeta.tags.length ? `
          <div class="post-tags" style="margin-top: 0.75rem;">
            ${postMeta.tags.map(tag => `<a href="./?tag=${encodeURIComponent(tag)}" class="tag">${escapeHtml(tag)}</a>`).join('')}
          </div>
        ` : ''}
      `;
    }

    // Render markdown
    const md = window.markdownit({
      html: true,
      linkify: false,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value;
          } catch (_) { /* fallback */ }
        }
        return ''; // use external default escaping
      }
    });

    contentEl.innerHTML = md.render(mdText);

  } catch (err) {
    contentEl.innerHTML = `<div class="error-message"><h2>خطا</h2><p>${escapeHtml(err.message)}</p></div>`;
  }
}

function showPostError(contentEl, headerEl) {
  if (headerEl) headerEl.innerHTML = '';
  contentEl.innerHTML = `
    <div class="error-message">
      <h2>پست پیدا نشد</h2>
      <p>این پست وجود نداره یا حذف شده.</p>
    </div>
  `;
  document.title = 'پست پیدا نشد — فانوس';
}

// --- Helpers ---

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// --- Init ---

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadPostList();
  loadPost();
});
