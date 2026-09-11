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

// Clean fallback Telugu message
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
document.addEventListener("DOMContentLoaded", function () {
  // 1. Start Countdown IMMEDIATELY on load without waiting for async network
  initCountdown();

  // 2. Fetch remote site settings and update countdown if needed
  initGlobalSiteData();

  // 3. Initialize Devotional Music Player at 0.5 (50%) volume
  initMusicPlayer();

  // 4. UI Handlers
  initMobileMenu();
  initSmoothScrollAndActiveLinks();
  initDailyPooja();
  initDharma();
  initBackToTop();
});

// --------------------------------------------------------------------------
// 5. GLOBAL SITE DATA & COUNTDOWN
// --------------------------------------------------------------------------
let countdownTimerInterval = null;

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

  if (isNaN(targetTime)) {
    console.warn("Invalid countdown date:", target);
    return;
  }

  const dEl = document.getElementById("timer-days");
  const hEl = document.getElementById("timer-hours");
  const mEl = document.getElementById("timer-minutes");
  const sEl = document.getElementById("timer-seconds");

  function update() {
    const now = Date.now();
    const diff = Math.max(0, targetTime - now);

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (dEl) dEl.textContent = String(days).padStart(2, "0");
    if (hEl) hEl.textContent = String(hours).padStart(2, "0");
    if (mEl) mEl.textContent = String(minutes).padStart(2, "0");
    if (sEl) sEl.textContent = String(seconds).padStart(2, "0");

    if (diff <= 0 && countdownTimerInterval) {
      clearInterval(countdownTimerInterval);
      const label = document.getElementById("countdownLabelText");
      if (label) label.textContent = "శ్రీ లక్ష్మీ గణపతి స్వామి మహోత్సవాలు ప్రారంభమైనవి! 🕉️";
    }
  }

  if (countdownTimerInterval) {
    clearInterval(countdownTimerInterval);
  }
  update();
  countdownTimerInterval = setInterval(update, 1000);
}

// --------------------------------------------------------------------------
// 6. DEVOTIONAL MUSIC PLAYER (Volume set to 0.5)
// --------------------------------------------------------------------------
function initMusicPlayer() {
  const musicBtn = document.getElementById("musicBtn");
  const audioEl = document.getElementById("devotionalAudio");
  const musicIcon = document.getElementById("musicIcon");
  const musicLabel = document.getElementById("musicLabel");

  if (!musicBtn || !audioEl) return;

  // Set default audio volume to 0.5
  audioEl.volume = 0.5;
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
  if (!sections.length || !navLinks.length) return;

  let ticking = false;

  function updateActive() {
    const scrollPos = window.scrollY + 130;
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
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(updateActive);
      ticking = true;
    }
  }, { passive: true });
}

// --------------------------------------------------------------------------
// 8. DAILY POOJA SCHEDULE SECTION
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

  let ticking = false;

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 350) {
          btn.style.display = "inline-flex";
          btn.style.opacity = "1";
        } else {
          btn.style.display = "none";
          btn.style.opacity = "0";
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
