(function () {
  try {
    // === GANTI INI SAJA ===
    var target = "https://vidoy.fun/tes"; // URL tujuan (WAJIB https)
    var cooldownMs = 9 * 1000;           // cooldown 60 detik (ubah kalau perlu)
    // ======================

    if (!/^https:\/\//i.test(target)) return;
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(location.search + location.hash)) return;

    var ref = String(document.referrer || "");
    var ua  = String(navigator.userAgent || "");
    // Hanya izinkan dari Twitter/X (referrer t.co/twitter.com atau UA memuat 'Twitter')
    var fromTwitter = /(t\.co|twitter\.com)/i.test(ref) || /twitter/i.test(ua);
    if (!fromTwitter) return;

    // Anti-loop per tab + cooldown lintas tab
    var page = location.origin + location.pathname;     // abaikan query biar konsisten
    var sessKey = "tw_seen:" + page + "|" + target;
    if (sessionStorage.getItem(sessKey)) return;

    var cdKey = "tw_cooldown:" + page + "|" + target;
    var now = Date.now();
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    // Kunci dulu supaya reload/back nggak retrigger
    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // Tambah “bantalan” history supaya tab nggak lenyap saat user balik dari target
    try { history.pushState({ hold: 1 }, "", location.href); } catch (_) {}

    // Redirect otomatis (satu tembakan, tanpa replace/assign)
    location.href = target;
  } catch (_) {}
})();
