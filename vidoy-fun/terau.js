(function () {
  try {
    // === SETTING ===
    var target = "https://contoh.domainmu.com/path"; // <-- GANTI ke URL tujuan kamu (HTTPS)
    var cooldownMs = 20 * 1000;                      // 20 detik

    // Hanya redirect jika sumbernya Telegram atau Twitter
    var allowedSources = [
      /t\.co/i,               // Twitter shortener
      /twitter\.com/i,        // Twitter referrer
      /Twitter/i,             // Twitter in-app browser UA
      /t\.me/i,               // Telegram shortener
      /telegram\.org/i,       // Telegram referrer
      /Telegram/i             // Telegram in-app browser UA
    ];

    if (!/^https:\/\//i.test(target)) return;

    // Bypass manual: ?noredir=1 atau #noredir
    if (/[?#](?:.*[&?])?noredir=1(?:&|$)/i.test(location.search + location.hash)) return;

    var ref = document.referrer || "";
    var ua  = navigator.userAgent || "";
    var fromAllowed = allowedSources.some(function (re) { return re.test(ref) || re.test(ua); });
    if (!fromAllowed) return;

    // Key unik per-halaman + target
    var page = location.origin + location.pathname; // abaikan query biar konsisten
    var key  = "redirCooldown:" + page + "|" + target + "|tw_tg";

    // Cek cooldown (localStorage tahan walau balik dari app)
    var now   = Date.now();
    var until = parseInt(localStorage.getItem(key) || "0", 10);
    if (now < until) return; // masih cooldown → jangan redirect

    // Set cooldown lebih dulu (hindari loop saat balik)
    localStorage.setItem(key, String(now + cooldownMs));

    // Redirect tanpa buka tab baru
    window.location.replace(target);
  } catch (_) {}
})();
