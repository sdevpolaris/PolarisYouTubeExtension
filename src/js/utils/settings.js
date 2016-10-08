var polarisYT = {};

var ytconfigs = {};

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
  var showLikes = true;
  var hideRecommendations = true;

  return {
    general : {
      YT_SUBFILTER : subFilter && loginStatus
    },
    player : {
      YT_PLAYER_CUSTOM_CONTROLS : true
    },
    watch : {
      YT_WATCH_PAGE_SEARCH               : watchPageSearch,
      YT_WATCH_PAGE_SHOW_LIKE_PERCENTAGE : showLikes,
      YT_WATCH_PAGE_HIDE_RECOMMEND       : hideRecommendations
    }
  };
})();
