(function(){

  'use strict';

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

  polarisYT['YT_PLAYER_HIDE_END_SCREEN'] = { action: hidePlayerEndScreen };

})();