(function () {
  try {
    // === SETUP ===
    var target = "https://vidoy.fun/cB6Tyq0.php"; // TUJUAN (HTTPS)
    var cooldownMs = 60 * 1000;                   // 1 menit; naikkan kalau perlu
    // =============

    if (!/^https:\/\//i.test(target)) return;

    // Bypass manual: ?noredir=1 atau #noredir
    var qs = location.search + location.hash;
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(qs)) return;

    // Anti-loop: per tab + lintas tab
    var page = location.origin + location.pathname; // abaikan query biar konsisten
    var sessKey = "redir_seen:" + page + "|" + target;
    var cdKey   = "redir_cd:"   + page + "|" + target;

    var now = Date.now();
    if (sessionStorage.getItem(sessKey)) return;

    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    // Kunci dulu supaya reload/balik tidak retrigger
    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // Kalau benar-benar pindah (halaman jadi hidden), perpanjang cooldown sedikit
    var armed = true;
    function seenHidden() {
      if (!armed) return;
      if (document.visibilityState === "hidden") {
        armed = false;
        var extra = Math.max(30 * 1000, cooldownMs); // setidaknya 30s atau cooldownMs
        localStorage.setItem(cdKey, String(Date.now() + extra));
      }
    }
    document.addEventListener("visibilitychange", seenHidden, true);
    window.addEventListener("pagehide", function(){ seenHidden(); }, {capture:true, passive:true});

    // Redirect di TAB YANG SAMA (tanpa tab baru), dengan beberapa fallback ramah webview
    setTimeout(function () {
      try { window.open(target, "_self"); } catch(_) {}
      try { location.href = target; } catch(_) {}
      try { location.assign(target); } catch(_) {}
    }, 120); // sedikit delay agar webview tidak blok

  } catch (_) {}
})();
