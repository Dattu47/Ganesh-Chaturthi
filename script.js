// ==========================================================================
// శ్రీ లక్ష్మీ గణపతి స్వామి – వినాయక చవితి ఉత్సవాలు
// Sri Lakshmi Ganapathi Utsava Committee – Gandhibomma Center, Velivennu
// Client Script: Primary Supabase + Static Project Backup (script.js)
// ==========================================================================

// --------------------------------------------------------------------------
// 1. SUPABASE CLIENT CONFIGURATION
// --------------------------------------------------------------------------
const SUPABASE_CONFIG = {
  url: "https://mcaizlxahzlncqnygwuh.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYWl6bHhhaHpsbmNxbnlnd3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMzM5NjksImV4cCI6MjEwNDYwOTk2OX0.XnUSmMCIMNMGKWoOBzB7ZpzbhmN1lxTuGpiNLyID0Jw"
};

let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    } catch (err) {
      // Suppress technical errors from public visitors
    }
  }
  return supabaseClient;
}

// --------------------------------------------------------------------------
// 2. REUSABLE STATIC BACKUP PATH GENERATOR
// --------------------------------------------------------------------------
/**
 * Generates the predictable static fallback path for a gallery photo.
 * Pattern: assets/gallery/<year>/<filename>
 */
function getGalleryFallbackPath(year, filename) {
  if (!year || !filename) return "";
  const cleanYear = String(year).trim();
  const cleanFilename = String(filename).trim().replace(/^\/+/, "");
  return `assets/gallery/${cleanYear}/${cleanFilename}`;
}

// Clean fallback Telugu message when neither Supabase nor static backup loads
const FALLBACK_MESSAGE_TELUGU = "ఈ చిత్రం ప్రస్తుతం అందుబాటులో లేదు.";

// --------------------------------------------------------------------------
// 3. DATA ACCESS LAYER (Supabase SDK First, Direct REST Second, Local Third)
// --------------------------------------------------------------------------
async function fetchSupabaseRest(endpoint) {
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) return null;
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${endpoint}`, {
      headers: {
        apikey: SUPABASE_CONFIG.anonKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`
      }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Network or offline catch
  }
  return null;
}

async function fetchSiteSettings() {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from("site_settings").select("*").eq("id", 1).single();
      if (!error && data) return data;
    } catch (e) { }
  }

  // Direct REST fallback
  const restData = await fetchSupabaseRest("site_settings?id=eq.1");
  if (restData && restData[0]) return restData[0];

  const local = localStorage.getItem("local_site_settings");
  if (local) {
    try { return JSON.parse(local); } catch (e) { }
  }
  return {
    website_name: "శ్రీ లక్ష్మీ గణపతి స్వామి – వినాయక చవితి ఉత్సవాలు",
    committee_name: "Sri Lakshmi Ganapathi Utsava Committee – Gandhibomma Center, Velivennu",
    countdown_date: "2026-09-14T06:00:00+05:30",
    music_url: "assets/music/devotional.mp3"
  };
}

async function fetchDailyPooja() {
  let list = [];
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("daily_pooja")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .order("date", { ascending: true });
      if (!error && data && data.length > 0) list = data;
    } catch (e) { }
  }

  // Direct REST fallback
  if (list.length === 0) {
    const restData = await fetchSupabaseRest("daily_pooja?published=eq.true&order=display_order.asc,date.asc");
    if (restData && restData.length > 0) list = restData;
  }

  if (list.length > 0) return list;

  const local = localStorage.getItem("local_daily_pooja");
  if (local) {
    try { return JSON.parse(local); } catch (e) { }
  }
  return [];
}

async function fetchGalleryItems() {
  let items = [];
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("gallery")
        .select("*")
        .eq("published", true)
        .order("year", { ascending: false })
        .order("id", { ascending: false });
      if (!error && Array.isArray(data)) {
        items = data;
      }
    } catch (e) {
      // Suppress technical Supabase errors from visitors
    }
  }

  // Direct REST fallback (Guaranteed to work without external CDN script)
  if (items.length === 0) {
    const restData = await fetchSupabaseRest("gallery?published=eq.true&order=year.desc,id.desc");
    if (restData && Array.isArray(restData)) {
      items = restData;
    }
  }

  // Merge with local items (for newly uploaded or offline photos)
  const local = localStorage.getItem("local_gallery");
  if (local) {
    try {
      const localItems = JSON.parse(local);
      if (Array.isArray(localItems)) {
        const knownUrls = new Set(items.map((i) => i.file_url).filter(Boolean));
        const knownIds = new Set(items.map((i) => i.id).filter(Boolean));
        localItems.forEach((li) => {
          if (!knownUrls.has(li.file_url) && !knownIds.has(li.id)) {
            items.push(li);
          }
        });
      }
    } catch (e) { }
  }
  return items;
}

async function fetchDharmaArticles() {
  let articles = [];
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("dharma_samskruthi")
        .select("*")
        .eq("published", true)
        .order("id", { ascending: false });
      if (!error && data && data.length > 0) articles = data;
    } catch (e) { }
  }

  // Direct REST fallback
  if (articles.length === 0) {
    const restData = await fetchSupabaseRest("dharma_samskruthi?published=eq.true&order=id.desc");
    if (restData && restData.length > 0) articles = restData;
  }

  if (articles.length > 0) return articles;

  const local = localStorage.getItem("local_dharma");
  if (local) {
    try { return JSON.parse(local); } catch (e) { }
  }
  return [];
}

// --------------------------------------------------------------------------
// 4. GLOBAL STATE & INITIALIZATION
// --------------------------------------------------------------------------
let allPhotosList = [];
let currentPhotoIndex = 0;

document.addEventListener("DOMContentLoaded", function () {
  initGlobalSiteData();
  initMusicPlayer();
  initMobileMenu();
  initSmoothScrollAndActiveLinks();
  initDailyPooja();
  initGallery();
  initDharma();
  initBackToTop();
});

// --------------------------------------------------------------------------
// 5. GLOBAL SITE DATA & COUNTDOWN
// --------------------------------------------------------------------------
async function initGlobalSiteData() {
  try {
    const settings = await fetchSiteSettings();
    if (!settings) return;
    if (settings.countdown_date) {
      initCountdown(settings.countdown_date);
    }
  } catch (e) {
    // Silent catch
  }
}

function initCountdown(targetDateStr) {
  const countdownEl = document.getElementById("countdownCard");
  if (!countdownEl) return;

  const target = targetDateStr || countdownEl.getAttribute("data-target") || "2026-09-14T06:00:00+05:30";
  const targetTime = new Date(target).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = Math.max(0, targetTime - now);

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const dEl = document.getElementById("timer-days");
    const hEl = document.getElementById("timer-hours");
    const mEl = document.getElementById("timer-minutes");
    const sEl = document.getElementById("timer-seconds");

    if (dEl) dEl.textContent = String(days).padStart(2, "0");
    if (hEl) hEl.textContent = String(hours).padStart(2, "0");
    if (mEl) mEl.textContent = String(minutes).padStart(2, "0");
    if (sEl) sEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// --------------------------------------------------------------------------
// 6. DEVOTIONAL MUSIC PLAYER
// --------------------------------------------------------------------------
function initMusicPlayer() {
  const musicBtn = document.getElementById("musicBtn");
  const audioEl = document.getElementById("devotionalAudio");
  const musicIcon = document.getElementById("musicIcon");
  const musicLabel = document.getElementById("musicLabel");

  if (!musicBtn || !audioEl) return;

  audioEl.volume = 0.08;
  let isPlaying = false;

  function updateUI(playing) {
    isPlaying = playing;
    if (playing) {
      musicBtn.classList.add("playing");
      if (musicIcon) musicIcon.textContent = "⏸";
      if (musicLabel) musicLabel.textContent = "సంగీతం ఆపండి";
      sessionStorage.setItem("devotional_music_active", "true");
    } else {
      musicBtn.classList.remove("playing");
      if (musicIcon) musicIcon.textContent = "▶";
      if (musicLabel) musicLabel.textContent = "భక్తి సంగీతం";
      sessionStorage.setItem("devotional_music_active", "false");
    }
  }

  musicBtn.addEventListener("click", function () {
    if (isPlaying) {
      audioEl.pause();
      updateUI(false);
    } else {
      audioEl.play().then(() => updateUI(true)).catch(() => updateUI(false));
    }
  });

  const shouldAutoplay = sessionStorage.getItem("devotional_music_active");
  if (shouldAutoplay === "true") {
    audioEl.play().then(() => updateUI(true)).catch(() => updateUI(false));
  }
}

// --------------------------------------------------------------------------
// 7. NAVIGATION & ACTIVE LINKS
// --------------------------------------------------------------------------
function initMobileMenu() {
  const toggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");
  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", function () {
    const active = navLinks.classList.toggle("active");
    toggle.classList.toggle("active");
    toggle.setAttribute("aria-expanded", active);
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", false);
    });
  });
}

function initSmoothScrollAndActiveLinks() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");

  window.addEventListener("scroll", function () {
    const scrollPos = window.scrollY + 120;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  });
}

// --------------------------------------------------------------------------
// 8. GALLERY FALLBACK HANDLER (SUPABASE -> STATIC BACKUP -> TELUGU NOTICE)
// --------------------------------------------------------------------------
/**
 * Called when a gallery image fails to load.
 * 1. If trying Supabase primary, switch src to assets/gallery/<year>/<filename>.
 * 2. If static backup also fails, replace card with clean Telugu message.
 */
window.handleGalleryImageError = function (imgEl) {
  if (!imgEl) return;
  const fallbackSrc = imgEl.getAttribute("data-fallback-src");
  const alreadyTriedFallback = imgEl.getAttribute("data-fallback-tried") === "true";

  if (!alreadyTriedFallback && fallbackSrc) {
    // Attempt the secondary / static GitHub-hosted backup
    imgEl.setAttribute("data-fallback-tried", "true");
    imgEl.src = fallbackSrc;
  } else {
    // Both failed: gracefully display the Telugu notice without technical errors
    const wrap = imgEl.closest(".gallery-img-wrap") || imgEl.parentElement;
    if (wrap) {
      wrap.classList.add("image-unavailable");
      wrap.innerHTML = `
        <div class="media-fallback-box">
          <span class="fallback-icon">🕉️</span>
          <p class="fallback-text">${FALLBACK_MESSAGE_TELUGU}</p>
        </div>
      `;
    }
  }
};

// --------------------------------------------------------------------------
// 9. PUBLIC GALLERY ENGINE (DYNAMIC YEARS, DESCENDING, FALLBACK-ENABLED)
// --------------------------------------------------------------------------
async function initGallery() {
  const tabsContainer = document.getElementById("yearTabsNav");
  const gallerySectionsContainer = document.getElementById("gallerySectionsContainer");
  if (!gallerySectionsContainer) return;

  try {
    const items = await fetchGalleryItems();

    if (!items || items.length === 0) {
      gallerySectionsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <p style="font-size: 1.1rem; color: var(--text-muted);">ఉత్సవ గ్యాలరీ చిత్రాలు త్వరలోనే ప్రచురించబడును.</p>
        </div>
      `;
      if (tabsContainer) tabsContainer.innerHTML = "";
      return;
    }

    // Group media by year
    const yearsMap = {};
    items.forEach((item) => {
      const yr = String(item.year || "").trim();
      if (!yr) return;
      if (!yearsMap[yr]) {
        yearsMap[yr] = { photos: [], videos: [] };
      }
      if (item.media_type === "video") {
        yearsMap[yr].videos.push(item);
      } else {
        yearsMap[yr].photos.push(item);
      }
    });

    // Sort years descending (e.g. 2026 -> 2005 -> 1998 -> 1990)
    // Only years containing actual content appear in the public gallery!
    const sortedYears = Object.keys(yearsMap).sort((a, b) => b.localeCompare(a));

    if (sortedYears.length === 0) {
      gallerySectionsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <p style="font-size: 1.1rem; color: var(--text-muted);">ఈ చిత్రం ప్రస్తుతం అందుబాటులో లేదు.</p>
        </div>
      `;
      return;
    }

    // Render Dynamic Year Tabs
    if (tabsContainer) {
      tabsContainer.innerHTML = `
        <button class="year-tab-btn active" data-year="all">అన్ని సంవత్సరాలు</button>
        ${sortedYears
          .map((yr) => `<button class="year-tab-btn" data-year="${yr}">${yr} ఉత్సవాలు</button>`)
          .join("")}
      `;

      tabsContainer.querySelectorAll(".year-tab-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          tabsContainer.querySelectorAll(".year-tab-btn").forEach((b) => b.classList.remove("active"));
          this.classList.add("active");
          const selYear = this.getAttribute("data-year");

          const searchInput = document.getElementById("galleryYearSearch");
          if (searchInput) searchInput.value = "";
          const clearBtn = document.getElementById("clearSearchBtn");
          if (clearBtn) clearBtn.style.display = "none";

          document.querySelectorAll(".year-gallery-section").forEach((sec) => {
            if (selYear === "all" || sec.getAttribute("data-year-group") === selYear) {
              sec.style.display = "block";
            } else {
              sec.style.display = "none";
            }
          });
        });
      });
    }

    // Search bar listener
    const searchInput = document.getElementById("galleryYearSearch");
    const clearBtn = document.getElementById("clearSearchBtn");

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const query = this.value.trim().toLowerCase();
        if (clearBtn) clearBtn.style.display = query ? "block" : "none";

        if (query && tabsContainer) {
          tabsContainer.querySelectorAll(".year-tab-btn").forEach((b) => b.classList.remove("active"));
        }

        document.querySelectorAll(".year-gallery-section").forEach((sec) => {
          const secYear = sec.getAttribute("data-year-group").toLowerCase();
          const cards = sec.querySelectorAll(".gallery-card, .video-card");
          let hasMatch = secYear.includes(query);

          if (!hasMatch) {
            cards.forEach((c) => {
              if (c.textContent.toLowerCase().includes(query)) hasMatch = true;
            });
          }

          sec.style.display = !query || hasMatch ? "block" : "none";
        });
      });

      if (clearBtn) {
        clearBtn.addEventListener("click", function () {
          searchInput.value = "";
          clearBtn.style.display = "none";
          if (tabsContainer) {
            const allBtn = tabsContainer.querySelector('[data-year="all"]');
            if (allBtn) allBtn.click();
          }
        });
      }
    }

    // Master list for Lightbox
    allPhotosList = [];
    let photoCounter = 0;

    // Render HTML per year
    let html = "";
    sortedYears.forEach((yr) => {
      const group = yearsMap[yr];

      html += `
        <div class="year-gallery-section" data-year-group="${yr}">
          <div class="year-section-title-wrap">
            <span class="year-badge-pill">📅 ${yr}</span>
            <h3 class="year-heading">${yr} వినాయక చవితి ఉత్సవ జ్ఞాపకాలు</h3>
          </div>
      `;

      // Photos
      if (group.photos && group.photos.length > 0) {
        html += `
          <div class="media-subgroup-title">
            <span>📷</span> ఛాయాచిత్రాలు (Photos)
          </div>
          <div class="gallery-grid">
        `;

        group.photos.forEach((photo) => {
          const caption = photo.caption || photo.title || `${yr} ఉత్సవ చిత్రం`;
          const filename = photo.filename || (photo.file_url ? photo.file_url.split("/").pop().split("?")[0] : "");
          const fallbackPath = filename ? getGalleryFallbackPath(yr, filename) : "";
          const thisIndex = photoCounter++;

          allPhotosList.push({
            src: photo.file_url,
            fallbackSrc: fallbackPath,
            caption: caption,
            year: yr
          });

          html += `
            <div class="gallery-card ${photo.backup_required ? "backup-enabled" : ""}" data-photo-index="${thisIndex}">
              ${photo.backup_required ? `<span class="static-backup-badge" title="స్టాటిక్ బ్యాకప్ చేయబడింది">🛡️ Backup</span>` : ""}
              <div class="gallery-img-wrap" onclick="openLightbox(${thisIndex})">
                <img 
                  src="${photo.file_url}" 
                  alt="${caption}" 
                  loading="lazy"
                  data-fallback-src="${fallbackPath}"
                  onerror="handleGalleryImageError(this)"
                >
                <div class="gallery-overlay-hover">
                  <span class="zoom-icon">🔍 పూర్తి సైజులో చూడండి</span>
                </div>
              </div>
              <div class="gallery-info">
                <h4 class="gallery-item-title">${caption}</h4>
                ${photo.description ? `<p class="gallery-item-desc">${photo.description}</p>` : ""}
                <span class="gallery-year-badge">${yr}</span>
              </div>
            </div>
          `;
        });

        html += `</div>`;
      }

      // Videos (Stored in Supabase Storage or YouTube, without local filesystem fallback)
      if (group.videos && group.videos.length > 0) {
        html += `
          <div class="media-subgroup-title" style="margin-top: 2rem;">
            <span>🎥</span> ప్రత్యక్ష వీడియోలు (Videos)
          </div>
          <div class="videos-grid">
        `;

        group.videos.forEach((video) => {
          const isEmbed = video.file_url.includes("youtube.com") || video.file_url.includes("youtu.be");
          const vTitle = video.caption || video.title || `${yr} ఉత్సవ వీడియో`;

          html += `
            <div class="video-card">
              <div class="video-frame-wrap">
                ${
                  isEmbed
                    ? `<iframe src="${video.file_url}" title="${vTitle}" frameborder="0" allowfullscreen loading="lazy"></iframe>`
                    : `<video controls preload="metadata" poster="${video.thumbnail_url || ''}"><source src="${video.file_url}"></video>`
                }
              </div>
              <div class="video-info">
                <h4 class="video-title">${vTitle}</h4>
                ${video.description ? `<p class="video-desc">${video.description}</p>` : ""}
                <span class="video-year-badge">${yr}</span>
              </div>
            </div>
          `;
        });

        html += `</div>`;
      }

      html += `</div>`;
    });

    gallerySectionsContainer.innerHTML = html;
    initLightbox();
  } catch (err) {
    // Visitor sees peaceful message, no technical errors
    gallerySectionsContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem;">
        <p style="font-size: 1.1rem; color: var(--text-muted);">${FALLBACK_MESSAGE_TELUGU}</p>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 10. LIGHTBOX WITH FALLBACK SUPPORT
// --------------------------------------------------------------------------
function initLightbox() {
  const modal = document.getElementById("lightboxModal");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  if (!modal) return;

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.onclick = closeModal;

  modal.onclick = function (e) {
    if (e.target === modal) closeModal();
  };

  if (prevBtn) {
    prevBtn.onclick = function (e) {
      e.stopPropagation();
      navigateLightbox(-1);
    };
  }

  if (nextBtn) {
    nextBtn.onclick = function (e) {
      e.stopPropagation();
      navigateLightbox(1);
    };
  }

  document.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });
}

window.openLightbox = function (index) {
  if (!allPhotosList || allPhotosList.length === 0) return;
  currentPhotoIndex = (index + allPhotosList.length) % allPhotosList.length;
  renderLightboxItem();

  const modal = document.getElementById("lightboxModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
};

function navigateLightbox(dir) {
  if (!allPhotosList || allPhotosList.length === 0) return;
  currentPhotoIndex = (currentPhotoIndex + dir + allPhotosList.length) % allPhotosList.length;
  renderLightboxItem();
}

function renderLightboxItem() {
  const item = allPhotosList[currentPhotoIndex];
  if (!item) return;

  const img = document.getElementById("lightboxImg");
  const title = document.getElementById("lightboxTitle");
  const cat = document.getElementById("lightboxCategory");

  if (img) {
    img.removeAttribute("data-fallback-tried");
    img.src = item.src;
    img.onerror = function () {
      if (!img.getAttribute("data-fallback-tried") && item.fallbackSrc) {
        img.setAttribute("data-fallback-tried", "true");
        img.src = item.fallbackSrc;
      } else {
        img.style.display = "none";
        if (title) title.textContent = FALLBACK_MESSAGE_TELUGU;
      }
    };
    img.onload = function () {
      img.style.display = "block";
    };
  }

  if (title) title.textContent = item.caption || "";
  if (cat) cat.textContent = `${item.year} ఉత్సవ చిత్రం (${currentPhotoIndex + 1} / ${allPhotosList.length})`;
}

// --------------------------------------------------------------------------
// 11. DAILY POOJA SCHEDULE SECTION
// --------------------------------------------------------------------------
async function initDailyPooja() {
  const container = document.getElementById("dailyPoojaScheduleList");
  const todayHighlightContainer = document.getElementById("todayPoojaHighlight");
  if (!container && !todayHighlightContainer) return;

  try {
    const list = await fetchDailyPooja();
    if (!list || list.length === 0) return;

    const todayItem = list.find((item) => item.is_today) || list[0];
    if (todayHighlightContainer && todayItem) {
      todayHighlightContainer.innerHTML = `
        <div class="featured-pooja-card">
          <div class="featured-badge">🪔 నేటి విశేష పూజ (Today's Pooja at Pandiri)</div>
          <h3 class="featured-title">${todayItem.title}</h3>
          <div class="featured-meta-row">
            <div class="meta-item"><span class="meta-icon">📅</span><span class="meta-label">తేదీ:</span><span class="meta-val">${todayItem.date}</span></div>
            <div class="meta-item"><span class="meta-icon">⏰</span><span class="meta-label">సమయం:</span><span class="meta-val highlight">${todayItem.time}</span></div>
            ${todayItem.special_info ? `<div class="meta-item"><span class="meta-icon">✨</span><span class="meta-label">విశేషం:</span><span class="meta-val">${todayItem.special_info}</span></div>` : ""}
          </div>
          ${todayItem.description ? `<p class="featured-desc">${todayItem.description}</p>` : ""}
        </div>
      `;
    }

    if (container) {
      container.innerHTML = list
        .map(
          (item) => `
          <tr class="${item.is_today ? "today-row" : ""}">
            <td class="time-col">
              <div class="date-badge">${item.date}</div>
              <div class="time-text">${item.time}</div>
              ${item.is_today ? `<span class="today-tag">నేడు</span>` : ""}
            </td>
            <td class="title-col">
              <div class="program-title">${item.title}</div>
            </td>
            <td class="desc-col">
              <p class="program-desc">${item.description || ""}</p>
              ${item.special_info ? `<span class="special-info-pill">✨ ${item.special_info}</span>` : ""}
            </td>
          </tr>
        `
        )
        .join("");
    }
  } catch (err) {
    // Silent catch
  }
}

// --------------------------------------------------------------------------
// 12. HINDU DHARMA & SAMSKRUTHI SECTION
// --------------------------------------------------------------------------
async function initDharma() {
  const container = document.getElementById("dharmaArticlesGrid");
  if (!container) return;

  try {
    const articles = await fetchDharmaArticles();
    if (!articles || articles.length === 0) {
      container.innerHTML = `<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">వ్యాసాలు త్వరలో ప్రచురించబడును.</p>`;
      return;
    }

    container.innerHTML = articles
      .map(
        (art) => `
        <article class="dharma-article-card">
          ${
            art.image_url
              ? `
            <div class="article-image-wrap">
              <img src="${art.image_url}" alt="${art.title}" loading="lazy" onerror="this.style.display='none'">
              <span class="article-category-badge">${art.category}</span>
            </div>
          `
              : ""
          }
          <div class="article-body">
            ${!art.image_url ? `<span class="article-category-badge-inline">${art.category}</span>` : ""}
            <h3 class="article-title">${art.title}</h3>
            <div class="article-divider"></div>
            <p class="article-content">${art.content}</p>
          </div>
        </article>
      `
      )
      .join("");
  } catch (err) {
    // Silent catch
  }
}

// --------------------------------------------------------------------------
// 13. BACK TO TOP
// --------------------------------------------------------------------------
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      btn.style.display = "inline-flex";
    } else {
      btn.style.display = "none";
    }
  });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
