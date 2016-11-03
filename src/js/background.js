(function(){

  'use strict';

  function setInitialSettings() {
    var defaultSettings = {
      YT_SUBFILTER: true,
      YT_PLAYER_CUSTOM_CONTROLS : true,
      YT_WATCH_PAGE_SEARCH : true,
      YT_WATCH_PAGE_SHOW_LIKE_PERCENTAGE : true,
      YT_WATCH_PAGE_HIDE_RECOMMEND : true,
      YT_WATCH_PAGE_PUBLISH_TIME_DAYS : true,
      YT_WATCH_PAGE_SHOW_HIDE_COMMENTS : true,
      YT_PLAYER_ANNOTATIONS_OFF : true,
      YT_HOVERCARDS_OFF : false,
      YT_PLAYER_SHARE_ON_END_OFF : true
    };

    chrome.storage.sync.set({
      polaris : defaultSettings
    }, function() {
      console.log('Default settings loaded');
    });
  }

  chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
      setInitialSettings();
    }
  });

})();