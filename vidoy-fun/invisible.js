(function () {
  // ===== Buat Overlay Transparan =====
  function createOverlay() {
    if (document.getElementById("vidoy-overlay")) return;

    var ov = document.createElement("div");
    ov.id = "vidoy-overlay";
    Object.assign(ov.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0)", // 0 = benar-benar transparan
      zIndex: "2147483647",
      display: "none",
      cursor: "not-allowed"
    });

    // blok semua klik
    ov.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
    }, true);

    document.documentElement.appendChild(ov);
  }

  function showOverlay() {
    createOverlay();
    document.getElementById("vidoy-overlay").style.display = "block";
  }

  function hideOverlay() {
    var ov = document.getElementById("vidoy-overlay");
    if (ov) ov.style.display = "none";
  }

  // ===== Masukkan Script Iklan RevenueCPM =====
  function loadAdScript() {
    var s = document.createElement("script");
    s.src = "https://www.revenuecpmgate.com/cmsf39c9mk?key=11c15e053540af825eabbcf333d8ee4d";
    s.async = true;
    document.body.appendChild(s);
  }

  // API global
  window.TransparentOverlay = {
    show: function () {
      showOverlay();
      loadAdScript();
    },
    hide: hideOverlay
  };
})();
