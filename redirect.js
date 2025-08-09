<script>
(function(){
  const adLinks = {
    1: atob("aHR0cDovL3Byb2ZpdGJsZWNwbS5jb20vdjFyYnI1ODF4a2V5PTI1NjNjYjkxYWZkMjFkNDBhNDZlOWEyZjA3MmFjODY1LnBocA=="),
    2: atob("aHR0cDovL3Byb2ZpdGJsZWNwbS5jb20vczQ4Z215cTh3a2V5PWU2ZTEzMmNiODZmNGUwOTRmOWQyNTllMDZjN2VhMjEyLnBocA=="),
    3: atob("aHR0cHM6Ly9wcm9maXRibGVjcG0uY29tL3MzdGk0b2Q2c2VrZXk9Y21zZjM5YzltazExYzE1ZTA1MzU0MGFmODI1ZWFiYmNmMzMzZDhlZTRk")
  };

  function getBlock(){
    const saved = localStorage.getItem("vidoy_user_block");
    if (saved) return parseInt(saved);
    const randomBlock = Math.floor(Math.random() * 3) + 1;
    localStorage.setItem("vidoy_user_block", randomBlock);
    return randomBlock;
  }

  const block = getBlock();
  const redirectLink = adLinks[block];

  function triggerRedirect(){
    if (redirectLink && !window._hasRedirected){
      window._hasRedirected = true;
      window.location.href = redirectLink;
    }
  }

  document.addEventListener('click', triggerRedirect, { once: true });
})();
</script>
