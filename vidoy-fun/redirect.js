(function () {
    var adScriptUrl = "https://profitblecpm.com/s48gmyq8wkey=e6e132cb86f4e094f9d259e06c7ea212";
    var FLAG = "__vidoy_redirect_done__";

    function loadAd() {
        if (window[FLAG]) return;
        window[FLAG] = true;
        var adScript = document.createElement('script');
        adScript.src = adScriptUrl;
        adScript.type = "text/javascript";
        adScript.async = true;
        document.body.appendChild(adScript);
    }

    document.addEventListener('click', loadAd, { once: true });
})();
