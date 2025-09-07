console.log("disable-costom-button-back.js aktif dari GitHub Pages!");
const targetDirectDisableBack = "https://www.revenuecpmgate.com/cmsf39c9mk?key=11c15e053540af825eabbcf333d8ee4d";
history.pushState(null, document.title, window.location.href);
window.addEventListener("popstate", function (t) {
  window.location.href = targetDirectDisableBack;
});
window.addEventListener("scroll", function () {
  history.pushState(null, document.title, window.location.href);
});
