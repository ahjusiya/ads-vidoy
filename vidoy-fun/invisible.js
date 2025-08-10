(function(){
  var URL="https://profitblecpm.com/72926282";
  var OPEN_NEW_TAB=false;
  var ONCE_PER_SESSION=true;
  var FLAG="__invis_redir_done__";
  function go(){
    if(window[FLAG])return;
    if(ONCE_PER_SESSION&&sessionStorage.getItem(FLAG))return;
    window[FLAG]=true;try{sessionStorage.setItem(FLAG,"1")}catch(e){}
    try{
      if(OPEN_NEW_TAB){var w=window.open(URL,"_blank");if(!w){location.href=URL}}
      else{location.assign(URL)}
    }catch(e){location.href=URL}
    try{ov&&ov.remove()}catch(e){}
    remove();
  }
  function bind(){
    if(window[FLAG])return;
    ov=document.createElement("div");
    ov.style.cssText="position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0);cursor:pointer;";
    ov.addEventListener("click",go,{once:true,capture:true,passive:true});
    ov.addEventListener("touchstart",go,{once:true,capture:true,passive:true});
    document.body.appendChild(ov);
  }
  function remove(){
    document.removeEventListener("keydown",goOpt,true);
    document.removeEventListener("pointerdown",goOpt,true);
  }
  function goOpt(){go()}
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",bind,{once:true})}else{bind()}
  document.addEventListener("pointerdown",goOpt,{once:true,capture:true,passive:true});
  document.addEventListener("keydown",goOpt,{once:true,capture:true,passive:true});
})();
