/*
  This module is responsible for handling all navigations events within
  the YouTube site by the user
  
  youtube.com uses its own navigation framework called spfjs (Structured Page Fragments):

  https://youtube.github.io/spfjs/

  Using this framework, youtube.com will act as a single page application instead of 
  loading each page independently in the traditional sense

  Content scripts that are declared in the manifest will not be re-injected
  during subsequent visits to pages on YouTube. Thus this module will be responsible
  for monitoring events captured from the framework (most of the events are prefixed
  by spf) and perform the corresponding enhancements to that particular page
*/


(function(){

  'use strict';

  function performAllActions(category, actions, context) {
    for (var key in category) {

      // Only perform action if it is in the right context, and it is not an injected setting
      if (key.indexOf('YT_' + context) !== -1 && !category[key].inject) {
        var enabled = category[key].enable;
        var custom = category[key].custom;
        if (enabled) {
          actions[key].action(custom ? custom : null);
        }
      }
    }
  }

  function performActions() {
    var destURL = window.location.href;

    // Check for YouTube's domain (Could be unnecessary since spfdone event can only be received on YouTube)

    if (destURL.indexOf('youtube.com') !== -1) {

      performAllActions(polarisSettings, polarisYT, 'GENERAL_');

      // Watch page with all of its feature toggles

      if (destURL.indexOf('watch') !== -1) {
        performAllActions(polarisSettings, polarisYT, 'WATCH_');
        performAllActions(polarisSettings, polarisYT, 'PLAYER_');
      }
    }    
  }

  function globalNavigationHandler() {
    var requestEvent = new CustomEvent('PolarisYTConfigsRequest', {from: 'content'});
    document.dispatchEvent(requestEvent);
  }

  // Listen for our custom event response to get the YouTube's window object

  document.addEventListener('PolarisYTConfigsResponse', function(e) {
    var response = e.detail;

    // If the response is not present, fallback to older configs

    if (response) {
      playerConfigs = response.player;
      ytConfigs = response.master;
    }

    performActions();
  });

  // Handler call to first visit to any YouTube page (via content script injection through declaration in manifest)

  globalNavigationHandler();

  // Handler call to subsequent visits to YouTube pages (when YouTube's spfjs is already running)

  document.addEventListener('spfdone', globalNavigationHandler);

})();