var contentScriptModules = [];

const defaultSettings = {
  "sidebar_subscriptions_search"     : true,
  "sidebar_subscriptions_sort"       : true,
  "sidebar_subscriptions_show_count" : true
};

(() => {

  "use strict";

  // Load settings into localStorage

  if (!localStorage.getItem("polaris-youtube-settings")) {
    localStorage.setItem("polaris-youtube-settings", JSON.stringify(defaultSettings));
  }

  chrome.storage.sync.get({
    "polaris-youtube-settings": defaultSettings
  }, function(items) {
    localStorage.setItem("polaris-youtube-settings", JSON.stringify(items["polaris-youtube-settings"]));
  });

})();