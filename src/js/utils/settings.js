// settings object used by content scripts, loaded from saved settings from options

var polarisSettings = {};

// object that holds all action functions to their corresponding setting

var polarisYT = {};

// Two config objects retrieved from the injected scripts running in YouTube's web page context

var ytConfigs = {};
var playerConfigs = {};

(function() {

  'use strict';

  // Load saved settings

  var settings = {};

  function loadSavedSetting() {
    chrome.storage.sync.get('polaris', function(items) {
      polarisSettings = items.polaris;
    });
  }

  loadSavedSetting();

})();
