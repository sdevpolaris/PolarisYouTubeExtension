(function(){

  // This function will inject player.js to the context of the actual web page
  // instead of being a content script of an extension

  // Benefits of being actually injected into the context of the page include
  // exposure to the YouTube's window object and its configuration properties
  // thus allowing us to pull additional information and alter directly how the
  // HTML5 player will function

  // This method of injection is referenced from the following StackOverflow thread:
  // http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script

  var s = document.createElement('script');
  s.src = chrome.extension.getURL('src/js/scripts/player.js');
  s.onload = function() {
    this.parentNode.removeChild(this);
  };
  (document.head || document.documentElement).appendChild(s);

  // These settings will have to be present at document_start rather than document_end like the rest

  var playerSettings = {
    YT_PLAYER_ANNOTATIONS_OFF : true
  };

  document.addEventListener('PolarisSettingsRequest', function(e) {
    var settingResponse = new CustomEvent('PolarisSettingsResponse', {'detail' : playerSettings});
    document.dispatchEvent(settingResponse);
  });
})();