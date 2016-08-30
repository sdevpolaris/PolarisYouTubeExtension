var uiSettings = (function(){

  'use strict';

  function isUserLoggedIn() {
    var loginHeader = document.getElementById('yt-masthead-signin');
    return loginHeader === null;
  }

  var loginStatus = isUserLoggedIn();
  var subFilter = true;

  return {
    POLARIS_YT_LOGIN     : loginStatus,
    POLARIS_YT_SUBFILTER : subFilter && loginStatus
  };

})();