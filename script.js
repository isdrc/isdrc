// Change Online Registration button text on hover
document.addEventListener('DOMContentLoaded', function() {
  var regBtn = document.getElementById('online-reg-btn');
  if (regBtn) {
    regBtn.addEventListener('mouseenter', function() {
      regBtn.innerHTML = 'Register <span style="font-size:1.2em; vertical-align:middle;">&#8594;</span>';
    });
    regBtn.addEventListener('mouseleave', function() {
      regBtn.textContent = 'Online Registration';
    });
  }
  // Initialize theme toggle state from localStorage (checkbox + text)
  const themeCheckbox = document.getElementById('theme-toggle');
  const themeText = document.querySelector('.theme-text');
  const saved = localStorage.getItem('isdrc-dark-mode');
  const savedDark = saved === 'true';
  if (savedDark) {
    document.body.classList.add('dark');
    if (themeCheckbox) themeCheckbox.checked = true;
    if (themeText) themeText.textContent = 'Dark';
  } else {
    if (themeCheckbox) themeCheckbox.checked = false;
    if (themeText) themeText.textContent = 'Light';
  }
  if (themeCheckbox) {
    themeCheckbox.addEventListener('change', () => {
      const isDark = themeCheckbox.checked;
      document.body.classList.toggle('dark', isDark);
      if (themeText) themeText.textContent = isDark ? 'Dark' : 'Light';
      localStorage.setItem('isdrc-dark-mode', isDark ? 'true' : 'false');
    });
  }
  // Move theme switch into nav menu on small screens so it doesn't take header space
  const themeSwitch = document.querySelector('.theme-switch');
  const navLinks = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');
  const mqMobile = window.matchMedia('(max-width: 768px)');
  function moveThemeSwitch() {
    if (!themeSwitch || !navLinks || !navbar) return;
    if (mqMobile.matches) {
      if (themeSwitch.parentNode !== navLinks) navLinks.appendChild(themeSwitch);
    } else {
      if (themeSwitch.parentNode !== navbar) navbar.appendChild(themeSwitch);
    }
  }
  // initialize and listen for changes
  moveThemeSwitch();
  if (mqMobile.addEventListener) mqMobile.addEventListener('change', moveThemeSwitch);
  else if (mqMobile.addListener) mqMobile.addListener(moveThemeSwitch);
  window.addEventListener('resize', moveThemeSwitch);
});


const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
  // prevent background scrolling when sidebar is open
  if (navLinks.classList.contains('active')) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
  // Toggle hamburger icon between menu and close (cross)
  if (hamburger.classList.contains('active')) {
    hamburger.innerHTML = '&times;'; // Cross icon
    // Add overlay for closing on outside click
    addSidebarOverlay();
  } else {
    hamburger.innerHTML = '&#9776;'; // Hamburger icon
    removeSidebarOverlay();
  }
});

// Overlay logic for closing sidebar on outside click
function addSidebarOverlay() {
  if (!document.getElementById('sidebar-overlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '999';
    overlay.style.background = 'rgba(0,0,0,0)'; // invisible but clickable
    overlay.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.innerHTML = '&#9776;';
      removeSidebarOverlay();
      document.body.classList.remove('no-scroll');
    });
    // Insert before navLinks so nav is above overlay
    navLinks.parentNode.insertBefore(overlay, navLinks);
  }
}

function removeSidebarOverlay() {
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) overlay.remove();
}

// Close sidebar when a nav link is clicked (for better UX)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.innerHTML = '&#9776;'; // Reset to hamburger icon
    removeSidebarOverlay();
    document.body.classList.remove('no-scroll');
  });
});

// Images for each category
const galleryData = {
  training: [
    "img/training1.jpg",
    "img/training2.jpg",
    "img/training3.jpg"
  ],
  seminar: [
  "seminar/Copy of DSC_0076.JPG",
  "seminar/Copy of DSC_0088.JPG",
  "seminar/Copy of DSC_0133.JPG",
  "seminar/Copy of DSC_0139.JPG",
  "seminar/Copy of DSC_0153.JPG",
  "seminar/Copy of DSC_0174.JPG",
  "seminar/Copy of DSC_0206.JPG",
  "seminar/Copy of DSC_0229.JPG",
  "seminar/Copy of DSC_0256.JPG",
  "seminar/Copy of DSC_0267.JPG",
  "seminar/Copy of DSC_0284.JPG",
  "seminar/Copy of DSC_0326.JPG",
  "seminar/Copy of DSC_0357.JPG",
  "seminar/Copy of DSC_0370.JPG",
  "seminar/Copy of DSC_0400.JPG",
  "seminar/Copy of DSC_0492.JPG",
  "seminar/Copy of DSC_0495.JPG",
  "seminar/Copy of DSC_0572.JPG"
  ],
  laboratory: [
    "img/laboratory1.jpg",
    "img/laboratory2.jpg",
    "img/laboratory3.jpg"
  ],
  members: [
    "img/members1.jpg",
    "img/members2.jpg",
    "img/members3.jpg",
    "img/members4.jpg"
  ]
};

const popupGallery = document.getElementById('popup-gallery');
const popupImagesContainer = document.getElementById('popup-images');
const popupClose = document.getElementById('popup-close');

// Inline SVG placeholder (data URL) used when member photo is absent or fails to load
const PLACEHOLDER_DATAURL = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="100%" height="100%" fill="#f2f2f2" />
  <g transform="translate(200,150)">
    <circle r="60" fill="#d9d9d9" />
    <rect x="-90" y="80" width="180" height="90" rx="10" fill="#e6e6e6" />
    <text x="0" y="150" font-size="20" text-anchor="middle" fill="#888" font-family="Arial,Helvetica,sans-serif">No Photo</text>
  </g>
</svg>`);

function createImageWithFallback(candidates, alt) {
  const img = document.createElement('img');
  img.alt = alt || '';
  img.className = 'popup-thumb';

  let index = 0;
  function tryLoad() {
    if (!candidates || index >= candidates.length) {
      img.src = PLACEHOLDER_DATAURL;
      img.onerror = null;
      return;
    }
    img.onerror = tryLoad;
    img.src = candidates[index++];
  }
  tryLoad();
  return img;
}

function buildCandidatesFor(path) {
  if (!path) return [];
  const p = path.trim();
  // If path looks absolute or remote, use as-is
  if (/^(https?:|\/)/i.test(p)) return [p];
  // Try as-provided, then relative to members_photos, then percent-encoded version
  const encoded = p.split('/').map(encodeURIComponent).join('/');
  const candidates = [p, `members_photos/${p}`, encoded, `members_photos/${encoded}`];
  // remove duplicates
  return Array.from(new Set(candidates));
}

// Open popup with images for a category. Always safe to call multiple times.
async function openGalleryPopupForCategory(categoryName) {
  if (!popupGallery || !popupImagesContainer) return;
  let images = galleryData[categoryName] ? galleryData[categoryName].slice() : [];

  if (categoryName === 'members') {
    try {
      const res = await fetch('members.json', { cache: 'no-store' });
      if (res.ok) {
        const members = await res.json();
        images = members
          .map(m => (m.img && m.img.trim()) ? m.img.trim() : null)
          .filter(Boolean);
        images = Array.from(new Set(images));
      }
    } catch (e) {
      console.warn('Failed to load members.json for gallery:', e);
    }
  }

  // render
  popupImagesContainer.innerHTML = '';
  if (!images || images.length === 0) {
    // show single placeholder
    popupImagesContainer.appendChild(createImageWithFallback([], 'No images'));
  } else {
    images.forEach(src => {
      const candidates = buildCandidatesFor(src);
      const img = createImageWithFallback(candidates, categoryName + ' image');
      popupImagesContainer.appendChild(img);
    });
  }

  // show popup and prevent background scroll
  popupGallery.classList.remove('hidden');
  document.body.classList.add('no-scroll');
}

function closeGalleryPopup() {
  if (!popupGallery || !popupImagesContainer) return;
  popupGallery.classList.add('hidden');
  document.body.classList.remove('no-scroll');
  // keep content so reopening is fast; if you prefer clearing, uncomment next line
  // popupImagesContainer.innerHTML = '';
}

// Attach handlers safely (id-based elements may be present on multiple pages)
if (document.querySelectorAll('.gallery-category').length) {
  document.querySelectorAll('.gallery-category').forEach(category => {
    category.addEventListener('click', () => openGalleryPopupForCategory(category.getAttribute('data-category')));
  });
}

if (popupClose) popupClose.addEventListener('click', closeGalleryPopup);
if (popupGallery) popupGallery.addEventListener('click', (e) => { if (e.target === popupGallery) closeGalleryPopup(); });

// ===== Member Loading System =====
async function loadMembers() {
  console.log('loadMembers() called');
  try {
    console.log('Fetching members.json...');
    const res = await fetch('members.json', { cache: 'no-store' });
    console.log('Response status:', res.status, 'ok:', res.ok);
    if (!res.ok) throw new Error('Failed to fetch members.json: ' + res.status);
    const members = await res.json();
    console.log('Members loaded:', members.length, 'members');

    // Group members by category
    const grouped = {
      faculties: [],
      researchers: [],
      students: [],
      advisory: []
    };

    members.forEach(member => {
      const cat = member.category || 'advisory';
      if (grouped[cat]) {
        grouped[cat].push(member);
      }
    });

    console.log('Grouped members:', grouped);

    // Render each category
    Object.keys(grouped).forEach(category => {
      const container = document.getElementById(`members-${category}`);
      console.log(`Container #members-${category}:`, container);
      if (container) {
        const cards = grouped[category].map(member => renderMember(member)).join('\n');
        console.log(`Rendering ${grouped[category].length} cards for ${category}`);
        container.innerHTML = cards;
      }
    });
    console.log('Members rendered successfully!');
  } catch (err) {
    console.error('Error loading members:', err);
  }
}

// HTML escape helper to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Attribute escape helper
function escapeAttr(text) {
  const map = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;'
  };
  return String(text).replace(/["'&]/g, m => map[m]);
}

// Render a single member card with inline SVGs
function renderMember(member) {
  const name = escapeHtml(member.name || '');
  const role = escapeHtml(member.role || '');
  const interests = escapeHtml(member.interests || '');
  const email = escapeHtml(member.email || '');
  const imgAlt = escapeHtml(member.imgAlt || member.name || 'Member');
  const imgSrc = member.img && member.img.trim() ? member.img : 'placeholder.png';

  // LinkedIn SVG
  const linkedInSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764c.966 0 1.75.79 1.75 1.764s-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.337-.026-3.056-1.863-3.056-1.864 0-2.151 1.456-2.151 2.963v5.697h-3v-10h2.881v1.367h.041c.401-.758 1.379-1.558 2.839-1.558 3.037 0 3.6 2.000 3.6 4.6v5.591z"/></svg>`;

  // Google Scholar SVG
  const scholarSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 9l11 7 9-5.727V17h2V9L12 2zm0 3.236L18.197 9 12 12.764 5.803 9 12 5.236zM5 22v-5l7 4 7-4v5H5z"/></svg>`;

  // Build social icons
  let socialIcons = '';
  if (member.linkedin && member.linkedin.trim()) {
    socialIcons += `<a href="${escapeAttr(member.linkedin)}" target="_blank" aria-label="LinkedIn - ${escapeAttr(name)}" class="social-link">${linkedInSvg}</a>`;
  }
  if (member.scholar && member.scholar.trim()) {
    socialIcons += `<a href="${escapeAttr(member.scholar)}" target="_blank" aria-label="Google Scholar - ${escapeAttr(name)}" class="social-link">${scholarSvg}</a>`;
  }

  // Build the card HTML (exact structure as original)
  return `<div class="member-card">
    <img src="${imgSrc}" alt="${imgAlt}" class="member-avatar" />
    <div class="member-meta">
      <div class="member-name">${name}</div>
      <div class="member-role">${role}</div>
      <div class="member-interests">Interests: ${interests}</div>
      <div class="member-email"> Email: ${email} </div>
      <div class="social-icons">
        ${socialIcons}
      </div>
    </div>
  </div>`;
}

// Load members when DOM is ready
document.addEventListener('DOMContentLoaded', loadMembers);

// ===== Notices System =====
// Fetch notices.json and render into #notice-board-list
async function loadNotices() {
  const container = document.getElementById('notice-board-list');
  if (!container) return; // nothing to do on pages without notice board

  try {
    const res = await fetch('notices.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch notices.json: ' + res.status);
    const notices = await res.json();

    // Only visible notices
    const visible = Array.isArray(notices) ? notices.filter(n => n.visible !== false) : [];

    // Pinned first (preserve original order), then remaining sorted by date desc
    const pinned = visible.filter(n => n.pinned).slice();
    const rest = visible.filter(n => !n.pinned).slice();
    rest.sort((a, b) => {
      // parse ISO dates; missing or invalid dates should be treated as older
      const da = a.date ? Date.parse(a.date) : 0;
      const db = b.date ? Date.parse(b.date) : 0;
      return (db || 0) - (da || 0);
    });
    const ordered = pinned.concat(rest);

    // Clear container
    container.innerHTML = '';

    if (ordered.length === 0) {
      container.innerHTML = '<li class="notice-empty">No notices at this time.</li>';
      return;
    }

    ordered.forEach(notice => {
      const li = document.createElement('li');
      li.className = 'notice-item';
      if (notice.pinned) li.classList.add('notice-pinned');
      li.setAttribute('role', 'article');
      li.setAttribute('data-notice-id', notice.id || '');

      // Date display
      let displayDate = 'Date TBA';
      if (notice.date) {
        try {
          const d = new Date(notice.date);
          if (!isNaN(d)) {
            const opts = { day: 'numeric', month: 'long', year: 'numeric' };
            displayDate = d.toLocaleDateString(undefined, opts);
          }
        } catch (e) { /* ignore */ }
      }

      // Combine date and category on the same line (e.g. "7 March 2025 - announcement")
      const headerLine = document.createElement('div');
      headerLine.className = 'notice-header-line';
      headerLine.textContent = displayDate + (notice.category ? ' - ' + notice.category : '');

      // Title
      const title = document.createElement('div');
      title.className = 'notice-title';
      const strong = document.createElement('strong');
      strong.textContent = notice.title || '';
      title.appendChild(strong);

      // Summary or derive from content
      let summaryText = (notice.summary || '').trim();
      const fullContent = (notice.content || '').trim();
      if (!summaryText) {
        if (fullContent) {
          // first line
          const firstLine = fullContent.split('\n')[0] || '';
          summaryText = firstLine.slice(0, 120) + (firstLine.length > 120 ? '…' : '');
        } else {
          summaryText = '';
        }
      }

      const summary = document.createElement('div');
      summary.className = 'notice-summary';
      summary.textContent = summaryText;

      // Actions (download / external link)
      const actions = document.createElement('div');
      actions.className = 'notice-actions';

      // Only render Download action (user can add other links inside content)
      // Support multiple forms: {download: {url, label}}, or download: true with downloadUrl/downloadLabel fields
      let downloadInfo = null;
      if (notice.download && typeof notice.download === 'object' && notice.download.url) {
        downloadInfo = { url: notice.download.url, label: notice.download.label || 'Download' };
      } else if (notice.download === true) {
        // try alternate fields
        if (notice.downloadUrl) downloadInfo = { url: notice.downloadUrl, label: notice.downloadLabel || 'Download' };
        else if (notice.link) downloadInfo = { url: notice.link, label: notice.downloadLabel || 'Download' };
      }

      if (downloadInfo) {
        const a = document.createElement('a');
        a.href = downloadInfo.url;
        if (downloadInfo.label) a.setAttribute('download', downloadInfo.label);
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'notice-download';
        // Insert inline SVG for download icon + accessible label span
        const svg = '<svg class="notice-download-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'
                  + '<path d="M12 16.5l4-4h-2.5V6h-3v6.5H8l4 4zM5 20h14v-2H5v2z" fill="currentColor"/>'
                  + '</svg>';
        const label = '<span class="notice-download-label">' + escapeHtml(downloadInfo.label || 'Download') + '</span>';
        a.innerHTML = svg + label;
        actions.appendChild(a);
      }

      // Read more toggle and full content
      // Read more button: include a themed chevron icon + text
      const readMoreBtn = document.createElement('button');
      readMoreBtn.type = 'button';
      readMoreBtn.className = 'notice-readmore';
      readMoreBtn.setAttribute('aria-expanded', 'false');
      readMoreBtn.style.marginLeft = '0.5rem';
      // initial (collapsed) icon: chevron down
      const chevronDown = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      const chevronUp = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 15l-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      const readMoreInner = document.createElement('span');
      readMoreInner.className = 'readmore-inner';
      readMoreInner.innerHTML = chevronDown + '<span class="readmore-text" style="margin-left:6px;">Read more</span>';
      readMoreBtn.appendChild(readMoreInner);

      const fullDiv = document.createElement('div');
      fullDiv.className = 'notice-full';
      fullDiv.style.display = 'none';
      // Escape content and convert newlines to <br>
      const safeContent = escapeHtml(fullContent).replace(/\n/g, '<br>');
      fullDiv.innerHTML = safeContent;

      // Toggle behavior (switch icon and text)
      readMoreBtn.addEventListener('click', () => {
        const expanded = readMoreBtn.getAttribute('aria-expanded') === 'true';
        readMoreBtn.setAttribute('aria-expanded', String(!expanded));
        const span = readMoreBtn.querySelector('.readmore-inner');
        if (span) {
          span.innerHTML = (!expanded ? chevronUp : chevronDown) + '<span class="readmore-text" style="margin-left:6px;">' + (!expanded ? 'Show less' : 'Read more') + '</span>';
        }
        fullDiv.style.display = expanded ? 'none' : 'block';
      });

      // Build li content (use elements so we stay safe)
      const headerRow = document.createElement('div');
      headerRow.className = 'notice-header';
      // headerLine already contains date and category combined
      headerRow.appendChild(headerLine);

      const titleRow = document.createElement('div');
      titleRow.className = 'notice-title-row';
      titleRow.appendChild(title);

      const footRow = document.createElement('div');
      footRow.className = 'notice-foot';
      footRow.appendChild(summary);
      if (actions.childNodes.length) footRow.appendChild(actions);
      // Add read more only if there is more content beyond summary
      if (fullContent && fullContent !== summaryText) {
        footRow.appendChild(readMoreBtn);
        footRow.appendChild(fullDiv);
      }

      li.appendChild(headerRow);
      li.appendChild(titleRow);
      li.appendChild(footRow);

      container.appendChild(li);
    });

  } catch (err) {
    console.error('Error loading notices:', err);
    if (container) container.innerHTML = '<li class="notice-error">Could not load notices — check console</li>';
  }
}

// Hook notices loader
document.addEventListener('DOMContentLoaded', loadNotices);

