(function () {
  const STORAGE_KEY = "vidoy_ad_counter";
  const REDIRECT_LINK = "https://www.profitableratecpm.com/cmsf39c9mk?key=11c15e053540af825eabbcf333d8ee4d";
  const visitCount = parseInt(localStorage.getItem(STORAGE_KEY) || "0") + 1;
  localStorage.setItem(STORAGE_KEY, visitCount);
  if (visitCount % 3 !== 0) return;

  const redirectOnce = () => {
    window.location.href = REDIRECT_LINK;
  };

  window.addEventListener("click", function (e) {
    const target = e.target;
    if (target.tagName === "VIDEO" || target.closest("video")) {
      redirectOnce();
    }
  }, { once: true });
})();
