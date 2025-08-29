(function () {
  try {
    // ==== GANTI BAGIAN INI SAJA ====
    var fallbackUrl   = "https://vidoy.fun"; // WAJIB https
    var appScheme     = "myapp";                             // skema app kamu
    var appPath       = "/open?ref=tw";                      // path/query di dalam app
    var androidPkg    = "com.example.myapp";                 // package Android
    var cooldownMs    = 60 * 1000;                           // cooldown biasa (1 menit)
    var installCdMs   = 30 * 60 * 1000;                      // cooldown kalau terdeteksi app terbuka (30 menit)
    // ===============================

    // bypass manual
    if (!/^https:\/\//i.test(fallbackUrl)) return;
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(location.search + location.hash)) return;

    // deteksi sumber (Telegram/X): referrer sering kosong di Telegram → andalkan UA
    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");
    var fromRef = /(t\.co|twitter\.com|t\.me|telegram\.org)/i.test(REF);
    var fromUA  = /(twitter|telegram|telegram-android|tgapp)/i.test(UA);
    var allowed = fromRef || (!fromRef && fromUA);
    if (!allowed) return;

    // platform
    var isAndroid = /Android/i.test(UA);
    var isIOS     = /iPhone|iPad|iPod/i.test(UA);

    // anti-loop per-tab + cooldown lintas tab
    var page   = location.origin + location.pathname; // abaikan query biar konsisten
    var sessKey= "deeplink_seen:" + page + "|" + fallbackUrl;
    var cdKey  = "deeplink_cooldown:" + page + "|" + fallbackUrl;
    var now    = Date.now();
    var until  = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (sessionStorage.getItem(sessKey)) return;
    if (now < until) return;

    // kunci lebih dulu (kalau reload/balik, tidak retrigger)
    sessionStorage.setItem(sessKey, "1");

    // bantalan history supaya tab tidak "hilang" saat balik dari app
    try {
      history.pushState({ hold: 1 }, "", location.href);
    } catch (_) {}

    // build deep links
    var iosDeepLink   = appScheme + "://" + appPath.replace(/^\//, "");
    var androidIntent = "intent://" + appPath.replace(/^\//, "") +
                        "#Intent;scheme=" + encodeURIComponent(appScheme) +
                        ";package=" + encodeURIComponent(androidPkg) +
                        ";S.browser_fallback_url=" + encodeURIComponent(fallbackUrl) +
                        ";end";

    // mekanisme deteksi "app benar-benar kebuka"
    // kalau halaman jadi hidden sesaat setelah trigger, anggap sukses → set cooldown panjang
    var successArmed = true;
    function onVisChange() {
      if (!successArmed) return;
      if (document.visibilityState === "hidden") {
        successArmed = false;
        // app kemungkinan terbuka → jangan redirect lagi saat user balik
        localStorage.setItem(cdKey, String(Date.now() + installCdMs));
      }
    }
    document.addEventListener("visibilitychange", onVisChange, true);

    // fallback timer iOS: jika app tidak terpasang, halaman tetap aktif → alihkan ke web
    var iosTimer = null;

    // lakukan redirect (tanpa klik)
    if (isAndroid) {
      // Telegram Android biasanya menerima intent:// di in-app webview
      location.href = androidIntent;
      // jika tidak pindah (jarang), sebagai cadangan, set cooldown biasa:
      setTimeout(function() {
        if (successArmed) { // belum sempat hidden → anggap gagal
          localStorage.setItem(cdKey, String(Date.now() + cooldownMs));
          // terakhir, arahkan ke fallback agar user tetap lanjut
          try { location.href = fallbackUrl; } catch(_) {}
        }
      }, 1200);
    } else if (isIOS) {
      // iOS pakai scheme + timer fallback
      var t0 = Date.now();
      location.href = iosDeepLink;
      iosTimer = setTimeout(function () {
        // kalau masih di halaman (belum hidden) dalam ~1s, anggap app tak ada → ke fallback
        if (Date.now() - t0 < 1600 && successArmed) {
          localStorage.setItem(cdKey, String(Date.now() + cooldownMs));
          try { location.href = fallbackUrl; } catch(_) {}
        }
      }, 1000);
    } else {
      // desktop/lainnya → langsung fallback
      localStorage.setItem(cdKey, String(Date.now() + cooldownMs));
      location.href = fallbackUrl;
    }
  } catch (_) {}
})();
