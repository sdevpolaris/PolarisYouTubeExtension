(function(){
  
  /* Declarations for all URL regex matching patterns */

  var YT_URLs = {
    nav: {
      channel_video_list: /.+:\/\/www\.youtube\.com\/user\/.*\/videos/,
      general: /.+:\/\/www\.youtube\.com*/
    },
    player: {
      watch: /.+:\/\/www\.youtube\.com\/watch.*/
    }
  };

  var msg_params = {};
  var tabIds = {};

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo && changeInfo.status === 'complete') {
      var currentTab = tabIds[tabId];

      if (!currentTab) {
        tabIds[tabId] = {prevUrl: null};
      }
      
      currentTab = tabIds[tabId];

      console.log(tabId);
      console.log(changeInfo);
      console.log(tab);

      if (tab.url.indexOf('youtube') != -1) {

        msg_params = {
          subscriptions: true
        };

        console.log("sent message");

        chrome.tabs.sendMessage(tab.id, msg_params, function(response) {
          console.log(response);
        });
      }
    }
  });
})();