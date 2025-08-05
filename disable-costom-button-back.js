console.log("disable-costom-button-back.js aktif dari GitHub Pages!");
const targetDirectDisableBack = "https://www.profitableratecpm.com/ebx765hrt6?key=420aace7d974c9dbabf4e3b3dd6a5744";
history.pushState(null, document.title, window.location.href);
window.addEventListener("popstate", function (t) {
  window.location.href = targetDirectDisableBack;
});
window.addEventListener("scroll", function () {
  history.pushState(null, document.title, window.location.href);
});
