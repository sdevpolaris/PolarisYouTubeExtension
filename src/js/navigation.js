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

  function performAllActions(category, actions) {
    for (var key in category) {
      var enabled = category[key];
      if (enabled) {
        actions[key].action();
      }
    }
  }

  function globalNavigationHandler(event) {
    var destURL;

    if (event === null) {
      destURL = window.location.href;
    } else {
      destURL = event.detail.url;
    }

    // Check for YouTube's domain (Could be unnecessary since spfdone event can only be received on YouTube)

    if (destURL.indexOf('youtube.com') !== -1) {

      performAllActions(uiSettings.general, polarisYT);

      // Watch page with all of its feature toggles

      if (destURL.indexOf('watch') !== -1) {
        performAllActions(uiSettings.watch, polarisYT);
        performAllActions(uiSettings.player, polarisYT);
      }

    }    
  }

  // Handler call to first visit to any YouTube page (via content script injection through declaration in manifest)

  globalNavigationHandler(null);

  // Handler call to subsequent visits to YouTube pages (when YouTube's spfjs is already running)

  document.addEventListener('spfdone', globalNavigationHandler);

})();