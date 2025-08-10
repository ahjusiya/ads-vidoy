(function(){
  const URL="https://profitblecpm.com/s48gmyq8wkey=e6e132cb86f4e094f9d259e06c7ea212";
  document.addEventListener('click', function(){
    // buka tab baru; kalau diblok popup, fallback ganti halaman
    const w = window.open(URL, '_blank');
    if (!w) location.href = URL;
  }, { once:true });
})();
