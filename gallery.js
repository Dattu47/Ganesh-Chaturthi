// ==========================================================================
// శ్రీ లక్ష్మీ గణపతి స్వామి – వినాయక చవితి ఉత్సవాలు
// Sri Lakshmi Ganapathi Utsava Committee – Gandhibomma Center, Velivennu
// Dedicated Gallery Engine: All Photos Side-by-Side Year-Wise & Direct Downloads (gallery.js)
// ==========================================================================

(function () {
  'use strict';

  // 1. SUPABASE CLIENT CONFIGURATION
  const GALLERY_SUPABASE_CONFIG = {
    url: "https://mcaizlxahzlncqnygwuh.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYWl6bHhhaHpsbmNxbnlnd3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMzM5NjksImV4cCI6MjEwNDYwOTk2OX0.XnUSmMCIMNMGKWoOBzB7ZpzbhmN1lxTuGpiNLyID0Jw"
  };

  let gallerySupabaseClient = null;

  function getGallerySupabase() {
    if (gallerySupabaseClient) return gallerySupabaseClient;
    if (window.supabase && GALLERY_SUPABASE_CONFIG.url && GALLERY_SUPABASE_CONFIG.anonKey) {
      try {
        gallerySupabaseClient = window.supabase.createClient(GALLERY_SUPABASE_CONFIG.url, GALLERY_SUPABASE_CONFIG.anonKey);
      } catch (e) { }
    }
    return gallerySupabaseClient;
  }

  // 2. STATIC PROJECT BACKUP MANIFEST (All 21 Historical Festival Years)
  // Ensures 100% offline & instantaneous rendering on GitHub / Cloudflare Pages / Local
  const STATIC_BACKUP_GALLERY = [
    { id: 33, year: "2025", title: "2025 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2025 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2025/2025.jpeg", filename: "2025.jpeg", backup_required: true, published: true },
    { id: 32, year: "2024", title: "2024 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2024 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2024/2024.jpeg", filename: "2024.jpeg", backup_required: true, published: true },
    { id: 31, year: "2023", title: "2023 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2023 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2023/2023.jpeg", filename: "2023.jpeg", backup_required: true, published: true },
    { id: 30, year: "2022", title: "2022 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2022 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2022/2022.jpeg", filename: "2022.jpeg", backup_required: true, published: true },
    { id: 29, year: "2021", title: "2021 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2021 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2021/2021.jpeg", filename: "2021.jpeg", backup_required: true, published: true },
    { id: 28, year: "2020", title: "2020 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ (2)", description: "గాంధీబొమ్మ సెంటర్ నందు 2020 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2020/2020-2.jpeg", filename: "2020-2.jpeg", backup_required: true, published: true },
    { id: 27, year: "2020", title: "2020 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ (1)", description: "గాంధీబొమ్మ సెంటర్ నందు 2020 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2020/2020-1.jpeg", filename: "2020-1.jpeg", backup_required: true, published: true },
    { id: 26, year: "2019", title: "2019 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2019 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2019/2019.jpeg", filename: "2019.jpeg", backup_required: true, published: true },
    { id: 25, year: "2018", title: "2018 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2018 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2018/2018.jpeg", filename: "2018.jpeg", backup_required: true, published: true },
    { id: 24, year: "2017", title: "2017 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2017 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2017/2017.jpeg", filename: "2017.jpeg", backup_required: true, published: true },
    { id: 23, year: "2016", title: "2016 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2016 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2016/2016.jpeg", filename: "2016.jpeg", backup_required: true, published: true },
    { id: 22, year: "2015", title: "2015 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2015 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2015/2015.jpeg", filename: "2015.jpeg", backup_required: true, published: true },
    { id: 21, year: "2014", title: "2014 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2014 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2014/2014.jpeg", filename: "2014.jpeg", backup_required: true, published: true },
    { id: 37, year: "2013", title: "2013 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2013 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2013/2013.jpeg", filename: "2013.jpeg", backup_required: true, published: true },
    { id: 38, year: "2012", title: "2012 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2012 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2012/2012.jpeg", filename: "2012.jpeg", backup_required: true, published: true },
    { id: 20, year: "2011", title: "2011 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2011 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2011/2011.jpeg", filename: "2011.jpeg", backup_required: true, published: true },
    { id: 19, year: "2010", title: "2010 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2010 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2010/2010.jpeg", filename: "2010.jpeg", backup_required: true, published: true },
    { id: 39, year: "2009", title: "2009 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2009 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2009/2009.jpeg", filename: "2009.jpeg", backup_required: true, published: true },
    { id: 18, year: "2008", title: "2008 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2008 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2008/2008.jpeg", filename: "2008.jpeg", backup_required: true, published: true },
    { id: 17, year: "2006", title: "2006 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2006 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2006/2006.jpeg", filename: "2006.jpeg", backup_required: true, published: true },
    { id: 16, year: "2005", title: "2005 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2005 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2005/2005.jpeg", filename: "2005.jpeg", backup_required: true, published: true },
    { id: 15, year: "2004", title: "2004 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 2004 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/2004/2004.jpeg", filename: "2004.jpeg", backup_required: true, published: true },
    { id: 14, year: "1974", title: "1974 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 1974 వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/1974/1974.jpeg", filename: "1974.jpeg", backup_required: true, published: true },
    { id: 13, year: "1963", title: "1963 శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ", description: "గాంధీబొమ్మ సెంటర్ నందు 1963 వినాయక చవితి ప్రప్రథమ మహోత్సవాల దివ్య దర్శనం.", media_type: "photo", file_url: "https://mcaizlxahzlncqnygwuh.supabase.co/storage/v1/object/public/gallery/1963/1963.jpeg", filename: "1963.jpeg", backup_required: true, published: true }
  ];

  function getGalleryFallbackPath(year, filename) {
    if (!year || !filename) return "";
    const cleanYear = String(year).trim();
    const cleanFilename = String(filename).trim().replace(/^\/+/, "");
    return `assets/gallery/${cleanYear}/${cleanFilename}`;
  }

  // 3. FETCH MEDIA WITH TIMEOUT GUARD
  async function fetchGalleryMediaWithTimeout(timeoutMs) {
    timeoutMs = timeoutMs || 3000;
    const fetchPromise = (async () => {
      let items = [];
      const sb = getGallerySupabase();
      if (sb) {
        try {
          const { data, error } = await sb
            .from("gallery")
            .select("*")
            .eq("published", true)
            .order("year", { ascending: false })
            .order("id", { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) {
            items = data;
          }
        } catch (e) { }
      }

      // Direct REST fallback
      if (items.length === 0 && GALLERY_SUPABASE_CONFIG.url && GALLERY_SUPABASE_CONFIG.anonKey) {
        try {
          const res = await fetch(`${GALLERY_SUPABASE_CONFIG.url}/rest/v1/gallery?published=eq.true&order=year.desc,id.desc`, {
            headers: {
              apikey: GALLERY_SUPABASE_CONFIG.anonKey,
              Authorization: `Bearer ${GALLERY_SUPABASE_CONFIG.anonKey}`
            }
          });
          if (res.ok) {
            const restData = await res.json();
            if (Array.isArray(restData) && restData.length > 0) {
              items = restData;
            }
          }
        } catch (e) { }
      }

      return items;
    })();

    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve([]), timeoutMs));
    return Promise.race([fetchPromise, timeoutPromise]);
  }

  // 4. IMAGE ERROR FALLBACK HANDLER
  function handleGalleryImageError(imgEl) {
    if (!imgEl) return;
    const fallbackSrc = imgEl.getAttribute("data-fallback-src");
    const alreadyTried = imgEl.getAttribute("data-fallback-tried") === "true";

    if (!alreadyTried && fallbackSrc && imgEl.src !== fallbackSrc) {
      imgEl.setAttribute("data-fallback-tried", "true");
      imgEl.src = fallbackSrc;
    } else {
      const wrap = imgEl.closest(".photo-thumb-wrap") || imgEl.parentElement;
      if (wrap) {
        wrap.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:1rem; text-align:center; background:rgba(255,255,255,0.85); color:var(--text-muted, #777);">
            <span style="font-size:1.8rem; margin-bottom:0.25rem;">🕉️</span>
            <p style="font-size:0.85rem; margin:0; font-weight:600; color:#4e0d14;">ఈ చిత్రం ప్రస్తుతం అందుబాటులో లేదు.</p>
          </div>
        `;
      }
    }
  }

  // 5. DOWNLOAD ORIGINAL PHOTO FUNCTION
  async function downloadGalleryPhoto(primaryUrl, fallbackUrl, filename, event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    let targetUrl = primaryUrl || fallbackUrl;
    const cleanName = filename ? filename.replace(/[^\w.-]/g, "_") : "ganapathi-swamy.jpeg";

    try {
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error("Primary download fetch failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = cleanName;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        a.remove();
      }, 1500);
    } catch (err) {
      // If primary failed, try fallback
      if (fallbackUrl && fallbackUrl !== targetUrl) {
        try {
          const fbResponse = await fetch(fallbackUrl);
          if (fbResponse.ok) {
            const blob = await fbResponse.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = blobUrl;
            a.download = cleanName;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              window.URL.revokeObjectURL(blobUrl);
              a.remove();
            }, 1500);
            return;
          }
        } catch (fbErr) { }
      }

      // Direct anchor fallback
      const directLink = document.createElement("a");
      directLink.style.display = "none";
      directLink.href = targetUrl || fallbackUrl;
      directLink.download = cleanName;
      directLink.target = "_blank";
      document.body.appendChild(directLink);
      directLink.click();
      setTimeout(() => directLink.remove(), 1500);
    }
  }

  // 6. GALLERY STATE & RENDERING ENGINE
  let groupedMedia = {};
  let availableYears = [];
  let masterPhotosList = [];
  let activeLightboxIndex = 0;
  let currentSelectedYear = "all";

  function populateGallery(items) {
    if (!items || items.length === 0) return;

    // Group media by Year
    groupedMedia = {};
    items.forEach((item) => {
      const yr = String(item.year || "").trim();
      if (!yr) return;
      if (!groupedMedia[yr]) {
        groupedMedia[yr] = { photos: [], videos: [] };
      }
      if (item.media_type === "video") {
        groupedMedia[yr].videos.push(item);
      } else {
        groupedMedia[yr].photos.push(item);
      }
    });

    // Sort years descending (2025 -> 2024 -> ... -> 1963)
    availableYears = Object.keys(groupedMedia).sort((a, b) => b.localeCompare(a));
    if (availableYears.length === 0) return;

    renderYearControls();
    renderAllPhotosSideBySide(currentSelectedYear);
  }

  function renderYearControls() {
    const yearSelect = document.getElementById("galleryYearSelect");
    const yearPillsContainer = document.getElementById("yearPillsContainer");

    // Populate Year Select Dropdown
    if (yearSelect) {
      yearSelect.innerHTML = `
        <option value="all"${currentSelectedYear === "all" ? " selected" : ""}>🌟 అన్ని సంవత్సరాలు (All 21 Years) - అన్ని ఫోటోలు</option>
        ${availableYears
          .map((yr) => `<option value="${yr}"${currentSelectedYear === yr ? " selected" : ""}>${yr} వినాయక చవితి ఉత్సవాలు</option>`)
          .join("")}
      `;

      yearSelect.onchange = function () {
        handleYearSelection(this.value);
      };
    }

    // Populate Fast Year Pills
    if (yearPillsContainer) {
      yearPillsContainer.innerHTML = `
        <button type="button" class="year-pill-btn${currentSelectedYear === "all" ? " active" : ""}" data-year="all">అన్ని సంవత్సరాలు (All)</button>
        ${availableYears
          .map((yr) => `<button type="button" class="year-pill-btn${currentSelectedYear === yr ? " active" : ""}" data-year="${yr}">${yr}</button>`)
          .join("")}
      `;

      yearPillsContainer.querySelectorAll(".year-pill-btn").forEach((btn) => {
        btn.onclick = function () {
          handleYearSelection(this.getAttribute("data-year"));
        };
      });
    }
  }

  async function initDedicatedGallery() {
    // 1. INSTANT ZERO-DELAY RENDER using static project backup!
    populateGallery(STATIC_BACKUP_GALLERY);

    // 2. Background non-blocking sync with Supabase
    try {
      const liveItems = await fetchGalleryMediaWithTimeout(3000);
      if (Array.isArray(liveItems) && liveItems.length > 0) {
        populateGallery(liveItems);
      }
    } catch (e) {
      // Live fetch error caught silently; static backup already rendered
    }
  }

  // 7. HANDLE YEAR SELECTION (Filter or View All)
  function handleYearSelection(selectedYear) {
    currentSelectedYear = selectedYear || "all";

    // Sync Dropdown
    const yearSelect = document.getElementById("galleryYearSelect");
    if (yearSelect && yearSelect.value !== currentSelectedYear) {
      yearSelect.value = currentSelectedYear;
    }

    // Sync Pills
    const yearPillsContainer = document.getElementById("yearPillsContainer");
    if (yearPillsContainer) {
      yearPillsContainer.querySelectorAll(".year-pill-btn").forEach((btn) => {
        if (btn.getAttribute("data-year") === currentSelectedYear) {
          btn.classList.add("active");
          btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        } else {
          btn.classList.remove("active");
        }
      });
    }

    renderAllPhotosSideBySide(currentSelectedYear);
  }

  // 8. RENDER ALL PHOTOS SIDE BY SIDE YEAR-WISE
  function renderAllPhotosSideBySide(filterYear) {
    const container = document.getElementById("galleryAllYearsContainer");
    const loadingStatusBox = document.getElementById("loadingStatusBox");
    if (!container) return;

    if (loadingStatusBox) {
      loadingStatusBox.style.display = "none";
    }

    const isAll = (filterYear === "all" || !filterYear);
    const yearsToRender = isAll ? availableYears : [filterYear];

    masterPhotosList = [];
    let globalPhotoIndex = 0;
    let allPhotos = [];
    let allVideos = [];

    yearsToRender.forEach((yr) => {
      const group = groupedMedia[yr];
      if (!group) return;
      (group.photos || []).forEach(p => allPhotos.push({ ...p, year: yr }));
      (group.videos || []).forEach(v => allVideos.push({ ...v, year: yr }));
    });

    if (allPhotos.length === 0 && allVideos.length === 0) {
      container.innerHTML = `
        <div class="no-media-box" style="text-align: center; padding: 3rem 1rem; background: rgba(255,255,255,0.95); border-radius: 14px; border: 1.5px dashed var(--gold, #d4af37);">
          <p style="font-size: 1.15rem; color: var(--maroon, #721214); font-weight: 700;">ఈ సంవత్సరానికి చిత్రాలు అందుబాటులో లేవు.</p>
          <button type="button" class="year-pill-btn active" onclick="handleYearSelection('all')" style="margin-top: 1rem; cursor: pointer;">
            అన్ని సంవత్సరాల ఫోటోలు చూడండి (View All)
          </button>
        </div>
      `;
      return;
    }

    const bannerTitle = isAll
      ? "శ్రీ లక్ష్మీ గణపతి స్వామి వారి చారిత్రక ఉత్సవ దర్శనం (1963 – 2025)"
      : `${filterYear} వినాయక చవితి ఉత్సవ ఫోటోలు`;
    const bannerCount = `${allPhotos.length} దివ్య ఛాయాచిత్రాలు${allVideos.length ? ` • ${allVideos.length} వీడియోలు` : ""}`;

    let html = `
      <!-- Top Summary Banner -->
      <div class="active-year-banner" style="background: rgba(255,255,255,0.96); backdrop-filter: blur(8px); border-radius: 14px; padding: 1rem 1.4rem; margin-bottom: 2rem; border: 1.5px solid var(--gold, #d4af37); box-shadow: 0 4px 16px rgba(0,0,0,0.06); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div class="active-year-title" style="margin: 0; font-size: 1.35rem; color: #4e0d14; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          <span>🌺</span>
          <span>${bannerTitle}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          ${!isAll ? `<button type="button" onclick="handleYearSelection('all')" class="year-pill-btn" style="background: #fdfaf2; border: 1.5px solid var(--gold); font-size: 0.88rem; padding: 0.4rem 0.9rem; cursor: pointer; border-radius: 50px; font-weight: 700; color: #4e0d14;">← అన్ని ఫోటోలు</button>` : ""}
          <div class="active-year-count" style="background: #fdf6e2; color: #694a08; font-weight: 700; padding: 0.35rem 1rem; border-radius: 50px; font-size: 0.92rem; border: 1px solid #e2cb94;">
            ${bannerCount}
          </div>
        </div>
      </div>
    `;

    // Photos Grid (Displayed Side by Side in One Continuous Responsive Grid!)
    if (allPhotos.length > 0) {
      html += `<div class="photo-grid">`;

      allPhotos.forEach((photo) => {
        const thisPhotoIndex = globalPhotoIndex++;
        const yr = photo.year;
        const caption = photo.caption || photo.title || `${yr} శ్రీ లక్ష్మీ గణపతి స్వామి దివ్యాలంకరణ`;
        const desc = photo.description || `గాంధీబొమ్మ సెంటర్ నందు ${yr} వినాయక చవితి మహోత్సవాల దివ్య దర్శనం.`;
        const filename = photo.filename || (photo.file_url ? photo.file_url.split("/").pop().split("?")[0] : `${yr}.jpeg`);
        const localPath = getGalleryFallbackPath(yr, filename);
        const primarySrc = localPath || photo.file_url;
        const fallbackSrc = photo.file_url || localPath;
        const dlFilename = `ganapathi-${yr}-${filename.replace(/^ganapathi-/, "")}`;

        masterPhotosList.push({
          src: primarySrc,
          fallbackSrc: fallbackSrc,
          caption: caption,
          year: yr,
          filename: dlFilename
        });

        html += `
          <div class="gallery-photo-card" data-index="${thisPhotoIndex}">
            <div class="photo-thumb-wrap" onclick="openLightbox(${thisPhotoIndex})" title="పూర్తి సైజులో చూడటానికి క్లిక్ చేయండి">
              <!-- Year Badge Ribbon on Top of Photo -->
              <div class="photo-year-badge">
                <span>📅</span> ${yr}
              </div>
              <img 
                src="${primarySrc}" 
                alt="${caption}" 
                loading="lazy"
                data-fallback-src="${fallbackSrc}"
                onerror="handleGalleryImageError(this)"
              />
              <div class="photo-zoom-hint">
                <span>🔍</span> జూమ్
              </div>
            </div>
            <div class="photo-details-body">
              <div>
                <h4 class="photo-title-text">${caption}</h4>
                <p class="photo-desc-text">${desc}</p>
              </div>
              <button 
                type="button" 
                class="photo-download-btn" 
                onclick="downloadGalleryPhoto('${primarySrc}', '${fallbackSrc}', '${dlFilename}', event)"
                title="${yr} స్వామివారి ఒరిజినల్ ఫోటోను డౌన్లోడ్ చేసుకోండి">
                <span class="dl-icon">⬇</span> డౌన్లోడ్ (${yr})
              </button>
            </div>
          </div>
        `;
      });

      html += `</div>`;
    }

    // Videos Grid if any
    if (allVideos.length > 0) {
      html += `
        <div style="margin-top: 3rem;">
          <div class="media-group-heading" style="color: #4e0d14; font-size: 1.25rem; font-weight: 800; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🎥</span> ఉత్సవాల వీడియోలు
          </div>
          <div class="video-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
      `;

      allVideos.forEach((video) => {
        const yr = video.year;
        const vTitle = video.caption || video.title || `${yr} ఉత్సవ వీడియో`;
        html += `
          <div class="gallery-video-card" style="background: rgba(255,255,255,0.96); border-radius: 14px; border: 1.5px solid rgba(212,175,55,0.65); padding: 0.75rem;">
            <video controls preload="metadata" style="width: 100%; border-radius: 8px; max-height: 360px; background: #000;">
              <source src="${video.file_url}" type="video/mp4">
              మీ బ్రౌజర్ వీడియోను ప్లే చేయలేకపోతోంది.
            </video>
            <div style="padding: 0.6rem 0.25rem 0.25rem 0.25rem;">
              <h4 style="font-size: 1rem; font-weight: 700; color: #4e0d14; margin: 0;">${vTitle}</h4>
            </div>
          </div>
        `;
      });

      html += `</div></div>`;
    }

    container.innerHTML = html;
  }

  // 9. LIGHTBOX VIEWER WITH DOWNLOAD
  function openLightbox(index) {
    if (!masterPhotosList || !masterPhotosList[index]) return;
    activeLightboxIndex = index;
    updateLightboxContent();

    const modal = document.getElementById("lightboxModal");
    if (modal) modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const modal = document.getElementById("lightboxModal");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  function updateLightboxContent() {
    const item = masterPhotosList[activeLightboxIndex];
    if (!item) return;

    const img = document.getElementById("lightboxImg");
    const caption = document.getElementById("lightboxCaption");
    const dlBtn = document.getElementById("lightboxDownloadBtn");

    if (img) {
      img.src = item.src;
      img.alt = item.caption;
      img.setAttribute("data-fallback-src", item.fallbackSrc);
      img.onerror = function () {
        if (this.src !== item.fallbackSrc && item.fallbackSrc) {
          this.src = item.fallbackSrc;
        }
      };
    }

    if (caption) {
      caption.textContent = `${item.caption} (${item.year} - ${activeLightboxIndex + 1} / ${masterPhotosList.length})`;
    }

    if (dlBtn) {
      dlBtn.onclick = function (e) {
        downloadGalleryPhoto(item.src, item.fallbackSrc, item.filename, e);
      };
    }
  }

  function initLightboxEvents() {
    const closeBtn = document.getElementById("lightboxClose");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");
    const modal = document.getElementById("lightboxModal");

    if (closeBtn) closeBtn.onclick = closeLightbox;

    if (prevBtn) {
      prevBtn.onclick = function (e) {
        e.stopPropagation();
        if (masterPhotosList.length <= 1) return;
        activeLightboxIndex = (activeLightboxIndex - 1 + masterPhotosList.length) % masterPhotosList.length;
        updateLightboxContent();
      };
    }

    if (nextBtn) {
      nextBtn.onclick = function (e) {
        e.stopPropagation();
        if (masterPhotosList.length <= 1) return;
        activeLightboxIndex = (activeLightboxIndex + 1) % masterPhotosList.length;
        updateLightboxContent();
      };
    }

    if (modal) {
      modal.onclick = function (e) {
        if (e.target === modal) closeLightbox();
      };
    }

    document.addEventListener("keydown", function (e) {
      if (!modal || !modal.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft" && prevBtn) prevBtn.click();
      if (e.key === "ArrowRight" && nextBtn) nextBtn.click();
    });
  }

  // 10. UI HANDLERS (Mobile Menu, Music Player, Back to Top)
  function initMobileMenu() {
    const toggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");
    if (!toggle || !navLinks) return;

    toggle.onclick = function () {
      const active = navLinks.classList.toggle("active");
      toggle.classList.toggle("active");
      toggle.setAttribute("aria-expanded", active);
    };

    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.onclick = function () {
        navLinks.classList.remove("active");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", false);
      };
    });
  }

  function initMusicPlayer() {
    const musicBtn = document.getElementById("musicBtn");
    const audioEl = document.getElementById("devotionalAudio");
    const musicIcon = document.getElementById("musicIcon");
    const musicLabel = document.getElementById("musicLabel");

    if (!musicBtn || !audioEl) return;

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

    musicBtn.onclick = function () {
      if (isPlaying) {
        audioEl.pause();
        updateUI(false);
      } else {
        audioEl.play().then(() => updateUI(true)).catch(() => updateUI(false));
      }
    };

    const shouldAutoplay = sessionStorage.getItem("devotional_music_active");
    if (shouldAutoplay === "true") {
      audioEl.play().then(() => updateUI(true)).catch(() => updateUI(false));
    }
  }

  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    window.addEventListener("scroll", function () {
      if (window.scrollY > 350) {
        btn.style.display = "inline-flex";
        btn.style.opacity = "1";
      } else {
        btn.style.display = "none";
        btn.style.opacity = "0";
      }
    }, { passive: true });

    btn.onclick = function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }

  // 11. EXPOSE GLOBAL FUNCTIONS FOR INLINE HTML EVENT HANDLERS
  window.handleGalleryImageError = handleGalleryImageError;
  window.downloadGalleryPhoto = downloadGalleryPhoto;
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;
  window.handleYearSelection = handleYearSelection;

  // 12. ROBUST INITIALIZATION
  function initAll() {
    initLightboxEvents();
    initMobileMenu();
    initMusicPlayer();
    initBackToTop();
    initDedicatedGallery();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
