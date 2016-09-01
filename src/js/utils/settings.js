var polarisYT = {};

var uiSettings = (function(){

  'use strict';

  function isUserLoggedIn() {
    var loginHeader = document.getElementById('yt-masthead-signin');
    return loginHeader === null;
  }

  // These settings will later be implemented into toggles in extension's options page
  // For now, simple default values

  var loginStatus = isUserLoggedIn();
  var subFilter = true;
  var watchPageSearch = true;
  var watchPageGeneral = true;

  return {
    POLARIS_YT_LOGIN             : loginStatus,
    POLARIS_YT_SUBFILTER         : subFilter && loginStatus,

    watch : {
      POLARIS_YT_WATCH_PAGE_SEARCH : watchPageSearch,
      POLARIS_YT_WATCH_PAGE_GENERAL : watchPageGeneral
    }
  };

})();