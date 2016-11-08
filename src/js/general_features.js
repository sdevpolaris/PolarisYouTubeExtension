polarisYT['YT_GENERAL_REDIRECT_YOUTUBE_SUB'] = (function() {

  'use strict';

  function changeLogoHref() {

    // Do not change the logo link if there is no user logged in. (Pointless to show subscription page)

    if (!ytConfigs.LOGGED_IN) {
      return;
    }

    var logoAnchor = document.getElementById('yt-masthead-logo-fragment').getElementsByTagName('a')[0];
    logoAnchor.setAttribute('href', '/feed/subscriptions');
  }  

  return {
    action : changeLogoHref
  };

})();