(function () {
  try {
    // === SETTING ===
    var target = "https://shinigami.bio"; // URL tujuan redirect (wajib HTTPS)
    var cooldownMs = 20 * 1000;           // 20 detik cooldown

    // Sumber yang diizinkan: Twitter / Telegram
    var allowedSources = [
      /t\.co/i,
      /twitter\.com/i,
      /twitter/i,
      /t\.me/i,
      /telegram\.org/i,
      /telegram/i
    ];

    // Validasi URL tujuan
    if (!/^https:\/\//i.test(target)) return;

    // Bisa bypass manual dengan ?noredir=1 atau #noredir
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(location.search + location.hash)) return;

    // Cek referrer dan User-Agent
    var ref = document.referrer || "";
    var ua  = navigator.userAgent || "";
    var fromAllowed = allowedSources.some(function (re) {
      return re.test(ref) || re.test(ua);
    });
    if (!fromAllowed) return; // bukan dari Twitter/Telegram

    // Buat key unik untuk cooldown
    var page = location.origin + location.pathname;
    var key  = "redirCooldown:" + page + "|" + target + "|tw_tg";

    var now   = Date.now();
    var until = parseInt(localStorage.getItem(key) || "0", 10);
    if (now < until) return; // masih dalam cooldown

    // Set cooldown
    localStorage.setItem(key, String(now + cooldownMs));

    // Eksekusi redirect
    window.location.assign(target);

  } catch (e) {
    console.error("Redirect error:", e);
  }
})();
