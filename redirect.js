(function () {
  // 
  const adLinks = {
    1: atob("aHR0cHM6Ly9wcm9maXRibGVjcG0uY29tLzcyOTI2Mjgy"),
    2: "https://profitblecpm.com/r2",
    3: "https://profitblecpm.com/r3"
  };

  function getBlock() {
    const saved = localStorage.getItem("vidoy_user_block");
    if (saved) return parseInt(saved);

    const randomBlock = Math.floor(Math.random() * 3) + 1; // 1–3
    localStorage.setItem("vidoy_user_block", randomBlock);
    return randomBlock;
  }

  const block = getBlock();
  const redirectLink = adLinks[block];

  function triggerRedirect() {
    if (redirectLink && !window._hasRedirected) {
      window._hasRedirected = true;
      window.location.href = redirectLink;
    }
  }

  document.addEventListener('click', triggerRedirect, { once: true });
})();
