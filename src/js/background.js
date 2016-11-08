(function(){

  'use strict';

  function setInitialSettings() {
    var defaultSettings = {
      YT_GENERAL_SUBFILTER               : { enable : true , inject: false },
      YT_GENERAL_HOVERCARDS_OFF          : { enable : true , inject: true  },
      YT_GENERAL_SHARE_ON_END_OFF        : { enable : true , inject: true  },
      YT_GENERAL_DISABLE_SPF             : { enable : false, inject: true  },
      YT_GENERAL_REDIRECT_YOUTUBE_SUB    : { enable : true , inject: false },
      YT_WATCH_PAGE_SEARCH               : { enable : true , inject: false },
      YT_WATCH_PAGE_SHOW_LIKE_PERCENTAGE : { enable : true , inject: false },
      YT_WATCH_PAGE_HIDE_RECOMMEND       : { enable : true , inject: false },
      YT_WATCH_PAGE_PUBLISH_TIME_DAYS    : { enable : true , inject: false },
      YT_WATCH_PAGE_SHOW_HIDE_COMMENTS   : { enable : true , inject: false },
      YT_PLAYER_CUSTOM_CONTROLS          : { enable : true , inject: false },
      YT_PLAYER_ANNOTATIONS_OFF          : { enable : true , inject: true  }
    };

    chrome.storage.sync.set({
      polaris : defaultSettings
    }, function() {
      console.log('Default settings loaded');
    });
  }

  function sendSettingUpdateToAllTabs() {
    chrome.tabs.query({}, function(tabs) {
      for (var tab in tabs) {
        chrome.tabs.sendMessage(tabs[tab].id, { settingUpdate : true }, function(response) {

        });
      }
    });
  }

  chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
      setInitialSettings();
    }
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.settingsUpdate) {
      sendSettingUpdateToAllTabs();
    }
  });

})();