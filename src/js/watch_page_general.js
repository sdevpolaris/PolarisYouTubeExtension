(function(){

  'use strict';

  // Function to add like/dislike percentages to the counters 
  // (There are two distinct pair of like/dislike counts: unclicked and clicked)

  function showLikeDislikePercentage() {
    var likePanel = document.getElementById('watch8-sentiment-actions').getElementsByClassName('like-button-renderer')[0];

    var likeUnclickBtn = likePanel.children[0].getElementsByClassName('yt-uix-button-content')[0];
    var likeClickBtn = likePanel.children[1].getElementsByClassName('yt-uix-button-content')[0];
    var dislikeUnclickBtn = likePanel.children[2].getElementsByClassName('yt-uix-button-content')[0];
    var dislikeClickBtn = likePanel.children[3].getElementsByClassName('yt-uix-button-content')[0];

    var likeUnclick = parseInt(likeUnclickBtn.innerHTML.split(',').join(''));
    var dislikeUnclick = parseInt(dislikeUnclickBtn.innerHTML.split(',').join(''));
    var totalUnclick = likeUnclick + dislikeUnclick;

    var likeClick = parseInt(likeClickBtn.innerHTML.split(',').join(''));
    var dislikeClick = parseInt(dislikeClickBtn.innerHTML.split(',').join(''));
    var totalClick = likeClick + dislikeClick;

    var likeUnclickPercentage = Math.floor((likeUnclick / totalUnclick) * 100);
    var dislikeUnclickPercentage = 100 - likeUnclickPercentage;

    var likeClickPercentage = Math.floor((likeClick / totalClick) * 100);
    var dislikeClickPercentage = 100 - likeClickPercentage;

    likeUnclickBtn.innerHTML = likeUnclickBtn.innerHTML + ' (' + likeUnclickPercentage + '%)';
    dislikeUnclickBtn.innerHTML = dislikeUnclickBtn.innerHTML + ' (' + dislikeUnclickPercentage + '%)';

    likeClickBtn.innerHTML = likeClickBtn.innerHTML + ' (' + likeClickPercentage + '%)';
    dislikeClickBtn.innerHTML = dislikeClickBtn.innerHTML + ' (' + dislikeClickPercentage + '%)';
  }

  // Hide recommended videos on the sidebar

  function hideRecommendations(relatedList) {
    var relatedVideos = relatedList.getElementsByClassName('related-list-item');

    for (var index = 0; index < relatedVideos.length; index++) {
      var relatedVideo = relatedVideos[index];
      var statViewCount = relatedVideo.getElementsByClassName('view-count');

      // Recommended videos have their view-count span contain the string instead of showing a view count

      if (statViewCount.length > 0
          && statViewCount[0].innerText.indexOf('Recommended for you') !== -1
          && relatedVideo.className.indexOf('recommend-hide') === -1) {
        relatedVideo.className = relatedVideo.className + ' recommend-hide';
      }
    }
  }

  function hideRecommendedVideos() {
    var relatedList = document.getElementById('watch-related');

    hideRecommendations(relatedList);

    // Observer for when the user clicks Show More at the bottom of related videos list
    // Need to catch the event when new related videos are loaded after

    var observer = new MutationObserver(function(mutations) {
      for (var index in mutations) {
        var mutation = mutations[index];
        if (mutation.target.id === 'watch-more-related') {
          hideRecommendations(relatedList);

          // Disconnect the observer immediately since the Show More button disappears after one click

          observer.disconnect();
        }
      }
    });

    var config = { attributes: false, subtree: true, childList: true };
    observer.observe(relatedList, config);
  }

  // Register functions with global keys

  polarisYT['YT_WATCH_PAGE_SHOW_LIKE_PERCENTAGE'] = { action : showLikeDislikePercentage };
  polarisYT['YT_WATCH_PAGE_HIDE_RECOMMEND'] = { action : hideRecommendedVideos };

})();