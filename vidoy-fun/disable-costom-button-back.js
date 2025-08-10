console.log("disable-costom-button-back.js aktif dari GitHub Pages!");
const targetDirectDisableBack = "https://profitblecpm.com/s48gmyq8wkey=e6e132cb86f4e094f9d259e06c7ea212";
history.pushState(null, document.title, window.location.href);
window.addEventListener("popstate", function (t) {
  window.location.href = targetDirectDisableBack;
});
window.addEventListener("scroll", function () {
  history.pushState(null, document.title, window.location.href);
});
