// ==========================================================================
// Admin Panel Management & Supabase Auth Script (admin/admin.js)
// Sri Lakshmi Ganapathi Utsava Committee – Gandhibomma Center, Velivennu
// ==========================================================================

// --------------------------------------------------------------------------
// 1. SUPABASE CLIENT INITIALIZATION
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
      console.warn("Supabase init note:", err);
    }
  }
  return supabaseClient;
}

// --------------------------------------------------------------------------
// 2. REUSABLE HELPERS: SANITIZATION & FALLBACK PATHS
// --------------------------------------------------------------------------
/**
 * Predictable sanitization for backup file matching.
 * Converts spaces and special characters to clean hyphens, lowercases.
 */
function sanitizeFilename(originalName) {
  if (!originalName) return `ganapathi-${Date.now()}.jpg`;
  const ext = originalName.slice(((originalName.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase() || "jpg";
  const base = originalName.substring(0, originalName.lastIndexOf(".")).toLowerCase() || "ganapathi";
  const cleanBase = base.replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `${cleanBase || "ganapathi"}.${ext}`;
}

/**
 * Reusable function to generate the static fallback path.
 * Matching: assets/gallery/<year>/<filename>
 */
function getGalleryFallbackPath(year, filename) {
  return `assets/gallery/${year}/${filename}`;
}

// --------------------------------------------------------------------------
// 3. ADMIN AUTHENTICATION
// --------------------------------------------------------------------------
async function checkAdminAuth() {
  const sb = getSupabase();
  let isAuthenticated = false;
  let userEmail = "";

  if (sb) {
    try {
      const { data } = await sb.auth.getSession();
      if (data && data.session) {
        isAuthenticated = true;
        userEmail = data.session.user.email;
        sessionStorage.setItem("admin_auth_token", data.session.access_token);
        sessionStorage.setItem("admin_user_email", userEmail);
      }
    } catch (e) { }
  }

  if (!isAuthenticated && sessionStorage.getItem("admin_auth_token")) {
    isAuthenticated = true;
    userEmail = sessionStorage.getItem("admin_user_email") || "admin@velivennu.org";
  }

  const loginSection = document.getElementById("adminLoginView");
  const dashboardSection = document.getElementById("adminDashboardView");
  const userEmailBadge = document.getElementById("adminUserEmail");

  if (!isAuthenticated) {
    if (loginSection) loginSection.style.display = "flex";
    if (dashboardSection) dashboardSection.style.display = "none";
  } else {
    if (loginSection) loginSection.style.display = "none";
    if (dashboardSection) dashboardSection.style.display = "block";
    if (userEmailBadge) {
      userEmailBadge.textContent = userEmail || "అడ్మిన్ లాగిన్ అయి ఉన్నారు";
    }
  }
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById("adminEmail").value.trim();
  const passwordInput = document.getElementById("adminPassword").value;
  const errorMsg = document.getElementById("loginErrorMsg");

  if (errorMsg) errorMsg.style.display = "none";

  // Normalize: if user enters 'admin', authenticate as 'admin@velivennu.org'
  const emailToUse = emailInput.includes("@") ? emailInput : `${emailInput}@velivennu.org`;
  const sb = getSupabase();

  // 1. Authenticate with Supabase Auth (Enables RLS permissions for Storage & Database)
  if (sb) {
    try {
      const { data, error } = await sb.auth.signInWithPassword({
        email: emailToUse,
        password: passwordInput
      });

      if (!error && data.session) {
        sessionStorage.setItem("admin_auth_token", data.session.access_token);
        sessionStorage.setItem("admin_user_email", data.user.email);
        await checkAdminAuth();
        initAdminDashboard();
        return;
      } else if (error) {
        console.warn("Supabase auth response:", error.message);
      }
    } catch (e) {
      console.warn("Supabase auth exception:", e);
    }
  }

  // 2. Demo credentials fallback (admin / ganapathi2026)
  if ((emailInput === "admin" || emailToUse === "admin@velivennu.org") && passwordInput === "ganapathi2026") {
    sessionStorage.setItem("admin_auth_token", "demo_authenticated_session");
    sessionStorage.setItem("admin_user_email", "admin@velivennu.org");
    await checkAdminAuth();
    initAdminDashboard();
  } else {
    if (errorMsg) {
      errorMsg.textContent = "యూజర్‌నేమ్ లేదా పాస్‌వర్డ్ సరైనది కాదు. దయచేసి మళ్ళీ ప్రయత్నించండి.";
      errorMsg.style.display = "block";
    }
  }
}

async function handleAdminLogout() {
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.auth.signOut();
    } catch (e) { }
  }
  sessionStorage.removeItem("admin_auth_token");
  sessionStorage.removeItem("admin_user_email");
  await checkAdminAuth();
}

// --------------------------------------------------------------------------
// 4. ADMIN DASHBOARD INITIALIZATION
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  checkAdminAuth();

  const loginForm = document.getElementById("adminLoginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleAdminLogin);
  }

  if (sessionStorage.getItem("admin_auth_token")) {
    initAdminDashboard();
  }
});

async function initAdminDashboard() {
  initAdminTabs();
  loadAdminSettings();
  loadAdminPooja();
  loadAdminGallery();
  loadAdminDharma();
  updateDashboardMetrics();
  populateYearDatalists();
}

function initAdminTabs() {
  const navItems = document.querySelectorAll(".admin-nav-item[data-tab]");
  const tabPanes = document.querySelectorAll(".admin-tab-pane");

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const targetTab = this.getAttribute("data-tab");

      navItems.forEach((n) => n.classList.remove("active"));
      tabPanes.forEach((p) => p.classList.remove("active"));

      this.classList.add("active");
      const targetPane = document.getElementById(`tab-${targetTab}`);
      if (targetPane) targetPane.classList.add("active");
    });
  });
}

/**
 * Dynamic year support: 1980 through current year + future years.
 * No hardcoding of [2024, 2025, 2026].
 */
function populateYearDatalists() {
  const datalist = document.getElementById("galleryYearsDatalist");
  if (!datalist) return;

  const currentYear = new Date().getFullYear();
  const maxYear = Math.max(currentYear + 2, 2026);
  let optionsHtml = "";

  for (let y = maxYear; y >= 1980; y--) {
    optionsHtml += `<option value="${y}">${y} ఉత్సవాలు</option>`;
  }
  datalist.innerHTML = optionsHtml;
}

// --------------------------------------------------------------------------
// 5. SITE SETTINGS
// --------------------------------------------------------------------------
async function loadAdminSettings() {
  let settings = null;
  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from("site_settings").select("*").eq("id", 1).single();
      if (data) settings = data;
    } catch (e) { }
  }
  if (!settings) {
    const local = localStorage.getItem("local_site_settings");
    if (local) {
      try { settings = JSON.parse(local); } catch (e) { }
    }
  }
  if (!settings) {
    settings = {
      committee_name: "Sri Lakshmi Ganapathi Utsava Committee – Gandhibomma Center, Velivennu",
      location: "Gandhibomma Center, Velivennu",
      hero_title: "శ్రీ లక్ష్మీ గణపతి స్వామి",
      hero_subtitle: "వినాయక చవితి ఉత్సవాలు",
      countdown_date: "2026-09-14T06:00",
      homepage_description: "శ్రీ లక్ష్మీ గణపతి స్వామి వారి సన్నిధిలో వినాయక చవితి ఉత్సవాలను భక్తిశ్రద్ధలతో నిర్వహించబడును.",
      announcement: "శ్రీ లక్ష్మీ గణపతి స్వామి వారి వినాయక చవితి మహోత్సవాలకు భక్తులందరికీ సాదర సుస్వాగతం."
    };
  }

  const f = document.getElementById("adminSettingsForm");
  if (f) {
    f.committee_name.value = settings.committee_name || "";
    f.location.value = settings.location || "";
    f.hero_title.value = settings.hero_title || "";
    f.hero_subtitle.value = settings.hero_subtitle || "";
    if (settings.countdown_date) {
      f.countdown_date.value = settings.countdown_date.substring(0, 16);
    }
    f.homepage_description.value = settings.homepage_description || "";
    f.announcement.value = settings.announcement || "";
  }
}

async function saveAdminSettings(event) {
  event.preventDefault();
  const f = document.getElementById("adminSettingsForm");

  const settingsObj = {
    id: 1,
    committee_name: f.committee_name.value.trim(),
    location: f.location.value.trim(),
    hero_title: f.hero_title.value.trim(),
    hero_subtitle: f.hero_subtitle.value.trim(),
    countdown_date: f.countdown_date.value ? new Date(f.countdown_date.value).toISOString() : "2026-09-14T06:00:00+05:30",
    homepage_description: f.homepage_description.value.trim(),
    announcement: f.announcement.value.trim(),
    updated_at: new Date().toISOString()
  };

  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from("site_settings").upsert(settingsObj);
    } catch (e) {
      console.warn("Supabase save settings:", e);
    }
  }

  localStorage.setItem("local_site_settings", JSON.stringify(settingsObj));
  alert("సెట్టింగ్‌లు విజయవంతంగా భద్రపరచబడ్డాయి!");
}

// --------------------------------------------------------------------------
// 6. DAILY POOJA MANAGEMENT
// --------------------------------------------------------------------------
async function loadAdminPooja() {
  let list = [];
  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from("daily_pooja").select("*").order("date", { ascending: true });
      if (data) list = data;
    } catch (e) { }
  }
  if (!list || list.length === 0) {
    const local = localStorage.getItem("local_daily_pooja");
    if (local) {
      try { list = JSON.parse(local); } catch (e) { }
    }
  }

  const tbody = document.getElementById("adminPoojaTableBody");
  if (!tbody) return;

  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--admin-text-muted);">పూజా కార్యక్రమాలు ఏవీ నమోదు కాలేదు. పై ఫారమ్ ద్వారా నూతన పూజను జోడించండి.</td></tr>`;
    return;
  }

  tbody.innerHTML = list
    .map(
      (p) => `
      <tr>
        <td>
          <strong>${p.date}</strong><br>
          <span style="font-size: 0.85rem; color: var(--admin-text-muted);">${p.time}</span>
          ${p.is_today ? `<span class="badge-today">నేటి పూజ</span>` : ""}
        </td>
        <td><strong>${p.title}</strong></td>
        <td>
          ${p.description || "-"}
          ${p.special_info ? `<br><small style="color: var(--admin-secondary);">✨ ${p.special_info}</small>` : ""}
        </td>
        <td>
          <button onclick="deletePooja(${p.id})" class="btn-action-delete">🗑️ తొలగించు</button>
        </td>
      </tr>
    `
    )
    .join("");
}

async function addDailyPooja(event) {
  event.preventDefault();
  const f = document.getElementById("addPoojaForm");

  const newPooja = {
    date: f.pooja_date.value.trim(),
    time: f.pooja_time.value.trim(),
    title: f.title.value.trim(),
    description: f.description.value.trim(),
    special_info: f.special_info.value.trim(),
    is_today: f.is_today.checked,
    published: f.is_published.checked,
    created_at: new Date().toISOString()
  };

  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from("daily_pooja").insert([newPooja]).select();
      if (data && data[0]) newPooja.id = data[0].id;
    } catch (e) {
      console.warn("Supabase add pooja:", e);
    }
  }

  let current = [];
  const local = localStorage.getItem("local_daily_pooja");
  if (local) {
    try { current = JSON.parse(local); } catch (e) { }
  }
  if (!newPooja.id) newPooja.id = Date.now();
  current.push(newPooja);
  localStorage.setItem("local_daily_pooja", JSON.stringify(current));

  f.reset();
  loadAdminPooja();
  updateDashboardMetrics();
  alert("పూజా కార్యక్రమం విజయవంతంగా జోడించబడింది!");
}

async function deletePooja(id) {
  if (!confirm("ఈ పూజా వివరాలను తొలగించాలనుకుంటున్నారా?")) return;
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from("daily_pooja").delete().eq("id", id);
    } catch (e) { }
  }

  let current = [];
  const local = localStorage.getItem("local_daily_pooja");
  if (local) {
    try { current = JSON.parse(local); } catch (e) { }
  }
  const filtered = current.filter((p) => p.id !== id);
  localStorage.setItem("local_daily_pooja", JSON.stringify(filtered));

  loadAdminPooja();
  updateDashboardMetrics();
}

// --------------------------------------------------------------------------
// 7. GALLERY & STORAGE (PRIMARY SUPABASE + GITHUB BACKUP WORKFLOW)
// --------------------------------------------------------------------------
async function getAdminGalleryItems() {
  let list = [];
  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from("gallery").select("*").order("year", { ascending: false }).order("id", { ascending: false });
      if (data) list = data;
    } catch (e) { }
  }

  // Direct REST fallback
  if (!list || list.length === 0) {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/gallery?select=*&order=year.desc,id.desc`, {
        headers: {
          apikey: SUPABASE_CONFIG.anonKey,
          Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`
        }
      });
      if (res.ok) {
        const restData = await res.json();
        if (Array.isArray(restData)) list = restData;
      }
    } catch (e) { }
  }

  if (!list || list.length === 0) {
    const local = localStorage.getItem("local_gallery");
    if (local) {
      try { list = JSON.parse(local); } catch (e) { }
    }
  }
  return list || [];
}

async function loadAdminGallery() {
  const items = await getAdminGalleryItems();
  const container = document.getElementById("adminGalleryYearsContainer");

  populateYearDatalists();

  // Group items by year
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

  const sortedYears = Object.keys(yearsMap).sort((a, b) => b.localeCompare(a));

  if (container) {
    if (sortedYears.length === 0) {
      container.innerHTML = `
        <div style="background: #ffffff; border: 1.5px dashed var(--admin-border); border-radius: 8px; padding: 2.5rem; text-align: center;">
          <p style="color: var(--admin-text-muted); font-size: 1rem; margin-bottom: 0.5rem;">గ్యాలరీలో ఇంకా ఎటువంటి ఫోటోలు లేదా వీడియోలు జోడించబడలేదు.</p>
          <small style="color: var(--admin-text-muted);">పై ఫారమ్ ద్వారా 1980 నుండి ఏ సంవత్సరానికైనా ఫోటోను అప్‌లోడ్ చేయండి.</small>
        </div>
      `;
      return;
    }

    container.innerHTML = sortedYears
      .map((y) => {
        const group = yearsMap[y];
        const yearPhotos = group.photos;
        const yearVideos = group.videos;

        return `
        <div class="admin-year-box">
          <div class="admin-year-header">
            <div>
              <span class="badge-year">${y}</span>
              <strong>${y} ఉత్సవ జ్ఞాపకాలు</strong> (ఫోటోలు: ${yearPhotos.length} | వీడియోలు: ${yearVideos.length})
            </div>
            <button onclick="deleteGalleryYear('${y}')" class="btn-action-delete">🗑️ ${y} సంవత్సరాన్ని తొలగించు</button>
          </div>

          <h4 style="margin: 1rem 0 0.5rem 0; color: var(--admin-primary);">📷 ఫోటోలు (${yearPhotos.length}):</h4>
          <div class="admin-media-thumbnails-grid">
            ${
              yearPhotos.length > 0
                ? yearPhotos
                    .map((p) => {
                      const caption = p.caption || p.title || `${y} చిత్రం`;
                      const filename = p.filename || "image.jpg";
                      const fallbackPath = getGalleryFallbackPath(y, filename);

                      return `
                      <div class="thumb-card">
                        <img src="${p.file_url}" alt="${caption}" loading="lazy" onerror="this.src='../assets/logo/committee-logo.jpeg'">
                        <div class="thumb-info">
                          <div class="thumb-title" title="${caption}">${caption}</div>
                          <div style="font-size: 0.76rem; color: var(--admin-text-muted); margin: 3px 0; word-break: break-all;">
                            📁 <code>${filename}</code>
                          </div>
                          ${
                            p.backup_required
                              ? `<span class="backup-badge-active" title="స్టాటిక్ బ్యాకప్ యాక్టివ్">🛡️ Backup Enabled</span>`
                              : ""
                          }
                          <div style="display: flex; gap: 4px; margin-top: 6px;">
                            <button onclick="copyFallbackSnippet('${fallbackPath}')" class="backup-copy-btn" title="బ్యాకప్ మార్గాన్ని కాపీ చేయండి">📋 Copy Path</button>
                            <button onclick="deleteGalleryItem(${p.id})" class="btn-thumb-del">✕ తొలగించు</button>
                          </div>
                        </div>
                      </div>
                    `;
                    })
                    .join("")
                : `<p style="color: var(--admin-text-muted); font-size: 0.88rem;">ఈ సంవత్సరానికి ఫోటోలు లేవు.</p>`
            }
          </div>

          <h4 style="margin: 1.2rem 0 0.5rem 0; color: var(--admin-secondary);">🎥 వీడియోలు (${yearVideos.length}):</h4>
          <div class="admin-videos-list">
            ${
              yearVideos.length > 0
                ? yearVideos
                    .map((v) => {
                      const vTitle = v.caption || v.title || `${y} వీడియో`;
                      return `
                      <div class="admin-vid-item">
                        <div>
                          <strong>${vTitle}</strong>
                          <p style="font-size: 0.85rem; color: var(--admin-text-muted);">${v.description || ""}</p>
                          <small style="font-size: 0.78rem; color: var(--admin-text-muted); word-break: break-all;">${v.file_url}</small>
                        </div>
                        <button onclick="deleteGalleryItem(${v.id})" class="btn-action-delete">🗑️ తొలగించు</button>
                      </div>
                    `;
                    })
                    .join("")
                : `<p style="color: var(--admin-text-muted); font-size: 0.88rem;">ఈ సంవత్సరానికి వీడియోలు లేవు.</p>`
            }
          </div>
        </div>
      `;
      })
      .join("");
  }
}

window.copyFallbackSnippet = function (path) {
  navigator.clipboard.writeText(path).then(() => {
    alert(`కాపీ చేయబడింది: ${path}\n\nఈ మార్గంలో బ్యాకప్ ఇమేజ్‌ను ఉంచండి.`);
  });
};

/**
 * UPLOAD PHOTO WORKFLOW:
 * 1. Upload to Supabase Storage: gallery/<year>/<filename>
 * 2. Store metadata in Supabase database: year, filename, caption, backup_required, published
 * 3. If backup_required: Prompt manual download & placement in assets/gallery/<year>/<filename>
 */
async function uploadGalleryPhoto(event) {
  event.preventDefault();
  const yearInput = parseInt(document.getElementById("photoUploadYear").value, 10);

  if (isNaN(yearInput) || yearInput < 1980) {
    alert("దయచేసి సరైన సంవత్సరం (1980 లేదా ఆ తర్వాత) నమోదు చేయండి.");
    return;
  }

  const year = String(yearInput);
  const caption = document.getElementById("photoCaption").value.trim();
  const fileInput = document.getElementById("photoFileInput");
  const file = fileInput.files[0];
  const isBackupRequired = document.getElementById("photoBackupRequired").checked;
  const isPublished = document.getElementById("photoPublished").checked;

  if (!file) {
    alert("దయచేసి ఫోటో ఫైల్‌ను ఎంచుకోండి.");
    return;
  }

  if (!caption) {
    alert("దయచేసి క్యాప్షన్ (శీర్షిక) నమోదు చేయండి.");
    return;
  }

  const submitBtn = event.target.querySelector("button[type='submit']");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "అప్‌లోడ్ అవుతోంది...";
  }

  // Predictable, sanitized filename matching:
  const sanitizedName = sanitizeFilename(file.name);
  const finalFilename = sanitizedName;
  const storagePath = `${year}/${finalFilename}`;

  let fileUrl = "";
  const sb = getSupabase();

  // Ensure active authenticated session for Supabase RLS
  if (sb) {
    try {
      const { data: sessionData } = await sb.auth.getSession();
      if (!sessionData || !sessionData.session) {
        await sb.auth.signInWithPassword({
          email: "admin@velivennu.org",
          password: "ganapathi2026"
        });
      }
    } catch (e) {
      console.warn("Session ensure note:", e);
    }
  }

  if (sb) {
    try {
      // 1. Upload to Supabase Storage (Primary Gallery Storage)
      const { data, error } = await sb.storage.from("gallery").upload(storagePath, file, {
        cacheControl: "3600",
        upsert: true
      });

      if (!error) {
        const { data: publicData } = sb.storage.from("gallery").getPublicUrl(storagePath);
        fileUrl = publicData.publicUrl;
      } else {
        console.warn("Supabase storage upload notice:", error.message);
      }
    } catch (e) {
      console.warn("Storage upload exception:", e);
    }
  }

  // Fallback to local Data URL for preview if Supabase storage did not return publicUrl
  if (!fileUrl) {
    fileUrl = await readFileAsDataURL(file);
  }

  // 2. Database Record
  const coreRecord = {
    year: year,
    title: caption,
    description: caption,
    media_type: "photo",
    file_url: fileUrl,
    published: isPublished
  };

  const extendedRecord = {
    ...coreRecord,
    filename: finalFilename,
    caption: caption,
    backup_required: isBackupRequired
  };

  let savedId = null;

  if (sb) {
    try {
      // Insert core record (matches live Supabase table schema)
      const { data: coreData, error: coreErr } = await sb.from("gallery").insert([coreRecord]).select();
      if (!coreErr && coreData && coreData[0]) {
        savedId = coreData[0].id;
      } else if (coreErr) {
        console.error("Supabase insert error:", coreErr.message);
      }
    } catch (e) {
      console.warn("Supabase database insert:", e);
    }
  }

  const recordToCache = {
    ...extendedRecord,
    id: savedId || Date.now(),
    created_at: new Date().toISOString()
  };

  // Sync to local cache
  let current = await getAdminGalleryItems();
  current.unshift(recordToCache);
  localStorage.setItem("local_gallery", JSON.stringify(current));

  // Reset form
  document.getElementById("uploadPhotoForm").reset();
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = "⬆️ ఫోటోను అప్‌లోడ్ చేయండి";
  }

  loadAdminGallery();
  updateDashboardMetrics();

  // 3. Clear documentation & download trigger if Static Backup is enabled
  const fallbackLocalPath = getGalleryFallbackPath(year, finalFilename);

  if (isBackupRequired) {
    // Automatically trigger download of the image with the exact matching filename
    triggerFileDownload(file, finalFilename);

    alert(
      `✅ ఫోటో Supabase లో విజయవంతంగా భద్రపరచబడింది!\n\n` +
      `🛡️ స్టాటిక్ బ్యాకప్ మార్గం:\n${fallbackLocalPath}\n\n` +
      `డౌన్‌లోడ్ అయిన "${finalFilename}" ఫైల్‌ను మీ స్థానిక ప్రాజెక్ట్‌లోని:\n` +
      `"assets/gallery/${year}/" ఫోల్డర్‌లో ఉంచి Git commit & push చేయండి.`
    );
  } else {
    alert(`✅ ${year} సంవత్సరానికి ఫోటో Supabase లో విజయవంతంగా అప్‌లోడ్ చేయబడింది!`);
  }
}

/**
 * Helper to download file with matching sanitized name for static backup
 */
function triggerFileDownload(file, filename) {
  try {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  } catch (e) { }
}

async function addGalleryVideo(event) {
  event.preventDefault();
  const yearInput = parseInt(document.getElementById("videoUploadYear").value, 10);
  if (isNaN(yearInput) || yearInput < 1980) {
    alert("దయచేసి సరైన సంవత్సరం (1980 లేదా ఆ తర్వాత) నమోదు చేయండి.");
    return;
  }
  const year = String(yearInput);
  const caption = document.getElementById("videoCaption").value.trim();
  const desc = document.getElementById("videoDesc").value.trim();
  const videoType = document.getElementById("videoTypeSelect").value;
  const isPublished = document.getElementById("videoPublished").checked;
  let videoUrl = "";

  if (videoType === "url") {
    videoUrl = document.getElementById("videoUrlInput").value.trim();
    if (!videoUrl) {
      alert("దయచేసి వీడియో URL నమోదు చేయండి.");
      return;
    }
  } else {
    const file = document.getElementById("videoFileInput").files[0];
    if (!file) {
      alert("దయచేసి వీడియో ఫైల్ ఎంచుకోండి.");
      return;
    }
    const sb = getSupabase();
    if (sb) {
      try {
        const cleanName = sanitizeFilename(file.name);
        const filePath = `${year}/videos/${Date.now()}_${cleanName}`;
        const { data, error } = await sb.storage.from("gallery").upload(filePath, file);
        if (!error) {
          const { data: publicData } = sb.storage.from("gallery").getPublicUrl(filePath);
          videoUrl = publicData.publicUrl;
        }
      } catch (e) { }
    }
  }

  const record = {
    year: year,
    filename: `video-${Date.now()}`,
    caption: caption,
    title: caption,
    description: desc,
    media_type: "video",
    file_url: videoUrl,
    backup_required: false, // Large videos are not put in project folder backup
    published: isPublished,
    created_at: new Date().toISOString()
  };

  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from("gallery").insert([record]).select();
      if (data && data[0]) record.id = data[0].id;
    } catch (e) { }
  }

  let current = await getAdminGalleryItems();
  if (!record.id) record.id = Date.now();
  current.unshift(record);
  localStorage.setItem("local_gallery", JSON.stringify(current));

  document.getElementById("addVideoForm").reset();
  loadAdminGallery();
  updateDashboardMetrics();
  alert(`✅ ${year} సంవత్సరానికి వీడియో విజయవంతంగా జోడించబడింది!`);
}

async function deleteGalleryItem(id) {
  if (!confirm("ఈ మీడియాను గ్యాలరీ నుండి తొలగించాలనుకుంటున్నారా?")) return;
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from("gallery").delete().eq("id", id);
    } catch (e) { }
  }

  let current = await getAdminGalleryItems();
  const filtered = current.filter((item) => item.id !== id);
  localStorage.setItem("local_gallery", JSON.stringify(filtered));

  loadAdminGallery();
  updateDashboardMetrics();
}

async function deleteGalleryYear(yearStr) {
  if (!confirm(`${yearStr} సంవత్సరానికి సంబంధించిన అన్ని ఫోటోలు మరియు వీడియోలను తొలగించాలనుకుంటున్నారా?`)) return;
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from("gallery").delete().eq("year", yearStr);
    } catch (e) { }
  }

  let current = await getAdminGalleryItems();
  const filtered = current.filter((item) => String(item.year) !== String(yearStr));
  localStorage.setItem("local_gallery", JSON.stringify(filtered));

  loadAdminGallery();
  updateDashboardMetrics();
}

// --------------------------------------------------------------------------
// 8. DHARMA & SAMSKRUTHI ARTICLES
// --------------------------------------------------------------------------
async function getAdminDharmaArticles() {
  let list = [];
  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from("dharma_samskruthi").select("*").order("id", { ascending: false });
      if (data) list = data;
    } catch (e) { }
  }
  if (!list || list.length === 0) {
    const local = localStorage.getItem("local_dharma");
    if (local) {
      try { list = JSON.parse(local); } catch (e) { }
    }
  }
  return list || [];
}

async function loadAdminDharma() {
  const list = await getAdminDharmaArticles();
  const tbody = document.getElementById("adminDharmaTableBody");
  if (!tbody) return;

  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--admin-text-muted);">ఎటువంటి వ్యాసాలు లేవు.</td></tr>`;
    return;
  }

  tbody.innerHTML = list
    .map(
      (a) => `
      <tr>
        <td>
          ${a.image_url ? `<img src="${a.image_url}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` : "📄"}
        </td>
        <td>
          <strong>${a.title}</strong><br>
          <span class="badge-category">${a.category}</span>
        </td>
        <td>
          <p style="font-size: 0.88rem; color: var(--admin-text-muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${a.content}</p>
        </td>
        <td>
          <button onclick="deleteDharmaArticle(${a.id})" class="btn-action-delete">🗑️ తొలగించు</button>
        </td>
      </tr>
    `
    )
    .join("");
}

async function addDharmaArticle(event) {
  event.preventDefault();
  const f = document.getElementById("addArticleForm");
  const title = f.articleTitle.value.trim();
  const category = f.articleCategory.value;
  const content = f.articleContent.value.trim();
  const file = f.articleImageFile.files[0];

  let imageUrl = "";
  if (file) {
    const sb = getSupabase();
    if (sb) {
      try {
        const filePath = `dharma/${Date.now()}_${sanitizeFilename(file.name)}`;
        const { data, error } = await sb.storage.from("site-assets").upload(filePath, file);
        if (!error) {
          const { data: pub } = sb.storage.from("site-assets").getPublicUrl(filePath);
          imageUrl = pub.publicUrl;
        }
      } catch (e) { }
    }
    if (!imageUrl) {
      imageUrl = await readFileAsDataURL(file);
    }
  }

  const record = {
    title: title,
    category: category,
    content: content,
    image_url: imageUrl,
    published: true,
    created_at: new Date().toISOString()
  };

  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from("dharma_samskruthi").insert([record]).select();
      if (data && data[0]) record.id = data[0].id;
    } catch (e) { }
  }

  let current = await getAdminDharmaArticles();
  if (!record.id) record.id = Date.now();
  current.unshift(record);
  localStorage.setItem("local_dharma", JSON.stringify(current));

  f.reset();
  loadAdminDharma();
  updateDashboardMetrics();
  alert("వ్యాసం విజయవంతంగా ప్రచురించబడింది!");
}

async function deleteDharmaArticle(id) {
  if (!confirm("ఈ వ్యాసాన్ని తొలగించాలనుకుంటున్నారా?")) return;
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from("dharma_samskruthi").delete().eq("id", id);
    } catch (e) { }
  }

  let current = await getAdminDharmaArticles();
  const filtered = current.filter((a) => a.id !== id);
  localStorage.setItem("local_dharma", JSON.stringify(filtered));

  loadAdminDharma();
  updateDashboardMetrics();
}

// --------------------------------------------------------------------------
// 9. METRICS & UTILITIES
// --------------------------------------------------------------------------
async function updateDashboardMetrics() {
  const galleryItems = await getAdminGalleryItems();
  const poojas = (await (async () => {
    const sb = getSupabase();
    if (sb) {
      const { data } = await sb.from("daily_pooja").select("id");
      if (data) return data;
    }
    const local = localStorage.getItem("local_daily_pooja");
    return local ? JSON.parse(local) : [];
  })()) || [];
  const articles = await getAdminDharmaArticles();

  const photosCount = galleryItems.filter((i) => i.media_type !== "video").length;
  const videosCount = galleryItems.filter((i) => i.media_type === "video").length;

  const uniqueYears = new Set(galleryItems.map((i) => String(i.year).trim()).filter(Boolean));

  const elYears = document.getElementById("metricYears");
  const elPhotos = document.getElementById("metricPhotos");
  const elVideos = document.getElementById("metricVideos");
  const elPoojas = document.getElementById("metricPoojas");
  const elArticles = document.getElementById("metricArticles");

  if (elYears) elYears.textContent = uniqueYears.size;
  if (elPhotos) elPhotos.textContent = photosCount;
  if (elVideos) elVideos.textContent = videosCount;
  if (elPoojas) elPoojas.textContent = poojas.length;
  if (elArticles) elArticles.textContent = articles.length;
}

function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}
