(function(){

  'use strict';

  var defaultSettings = {
    YT_GENERAL_SUBFILTER               : { enable : true , inject: false },
    YT_GENERAL_HOVERCARDS_OFF          : { enable : false, inject: true  },
    YT_GENERAL_SHARE_ON_END_OFF        : { enable : true , inject: true  },
    YT_GENERAL_DISABLE_SPF             : { enable : false, inject: true  },
    YT_GENERAL_REDIRECT_YOUTUBE_SUB    : { enable : true , inject: false },
    YT_WATCH_PAGE_SEARCH               : { enable : true , inject: false },
    YT_WATCH_PAGE_SHOW_LIKE_PERCENTAGE : { enable : true , inject: false },
    YT_WATCH_PAGE_HIDE_RECOMMEND       : { enable : true , inject: false },
    YT_WATCH_PAGE_PUBLISH_TIME_DAYS    : { enable : true , inject: false },
    YT_WATCH_PAGE_SHOW_HIDE_COMMENTS   : { enable : true , inject: false },
    YT_WATCH_PAGE_DEFAULT_WATCH_MODE   : { enable : true , inject: false, custom : 'auto' },
    YT_WATCH_SHOW_KEYWORDS             : { enable : true , inject: false },
    YT_PLAYER_CUSTOM_CONTROLS          : { enable : true , inject: false },
    YT_PLAYER_ANNOTATIONS_OFF          : { enable : true , inject: true  },
    YT_PLAYER_SHOW_TOP_INFO            : { enable : false, inject: true  },
    YT_PLAYER_HIDE_END_SCREEN          : { enable : true , inject: false },
    YT_PLAYER_HIDE_SUGGESTION_OVERLAYS : { enable : true , inject: false }
  };

  function loadSavedSetting(callback) {
    chrome.storage.sync.get('polaris', function(items) {
      callback(items.polaris);
    });
  }

  function saveSettings(settings) {
    chrome.storage.sync.set({
      polaris : settings
    }, function() {
      console.log('Setting saved');
    });
  }

  function updateSettings(settings) {

    // If there is no settings stored, reload the default

    if (!settings) {
      saveSettings(defaultSettings);
    }

    // Update the stored setting with new setting keys

    for (var key in defaultSettings) {
      if (!settings[key]) {
        settings[key] = defaultSettings[key];
      }
    }

    saveSettings(settings);
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
      saveSettings(defaultSettings);
    } else if (details.reason === 'update') {
      loadSavedSetting(updateSettings);
    }
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.settingsUpdate) {
      sendSettingUpdateToAllTabs();
    }
  });

})();