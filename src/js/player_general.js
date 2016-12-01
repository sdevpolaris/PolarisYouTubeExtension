(function(){

  'use strict';

  // Each of the functions in this encapsulated self-invoking function has to keep its
  // own set of variables that reference existing dom elements on the document (such as the movie_player)
  // such that mutation observers will not observe on older variables (due to YouTube's spf), and GC will handle
  // unused variables from previous function calls

  function hidePlayerEndScreen() {
    var player = document.getElementById('movie_player');

    // Initially the end screen div does not contain any video tiles,
    // they are only loaded when the current playing video approaches to less than 10 seconds
    // until the end, then the video tiles for the end screen are loaded into the div and get displayed

    // We want an observer to observe when these video tiles are loaded, then simply hide the entire end screen div

    var observer = new MutationObserver(function(mutations) {
      for (var index in mutations) {
        var mutation = mutations[index];

        // Find the mutation corresponding to the end screen

        if (mutation.target.classList.contains('ytp-endscreen-content')) {
          var endscreen = player.getElementsByClassName('ytp-endscreen-content')[0];

          // Hide the end screen

          endscreen.classList.add('watch-hide');

          // Disconnect the observer immediately once the operation is done
          observer.disconnect();
        }
      }
    });

    var config = { attributes: false, subtree: true, childList: true };
    observer.observe(player, config);
  }

  function hideSuggestionOverlays() {
    var player = document.getElementById('movie_player');

    // These overlays can either be loaded at the start of video, or during the video
    // Need an observer for the second case

    var overlays = player.getElementsByClassName('ytp-ce-element');
    if (overlays.length > 0) {
      for (var i = 0; i < overlays.length; i++) {
        overlays[i].classList.add('ce-hide');
      }
    } else {
      var observer = new MutationObserver(function(mutations) {
        for (var index in mutations) {
          var mutation = mutations[index];

          // Check for the mutations that add HTML dom nodes

          if (mutation.addedNodes.length > 0
            && typeof mutation.addedNodes[0] === 'object'
            && mutation.addedNodes[0].nodeType === 1
            && mutation.addedNodes[0].classList.contains('ytp-ce-element')) {

            for (var i = 0; i < mutation.addedNodes.length; i++) {
              mutation.addedNodes[i].classList.add('ce-hide');
            }

            // Continue the loop since the overlays will be added in sequence, and we want to disconnect
            // the observer as soon as possible
            continue;
          }
          // Disconnect the observer immediately once all consecutive ce-elements are loaded
          observer.disconnect();
        }
      });

      var config = { attributes: false, subtree: true, childList: true };
      observer.observe(player, config);
    }
  }

  polarisYT['YT_PLAYER_HIDE_END_SCREEN'] = { action: hidePlayerEndScreen };
  polarisYT['YT_PLAYER_HIDE_SUGGESTION_OVERLAYS'] = { action : hideSuggestionOverlays };

})();