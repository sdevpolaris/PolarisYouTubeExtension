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

    // If any of the above four inner elements for displaying like/dislike numbers are not present, it means that
    // the current video has disabled showing of likes/dislikes

    if (!likeUnclickBtn) {
      return;
    }

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
          && relatedVideo.className.indexOf('watch-hide') === -1) {
        relatedVideo.className = relatedVideo.className + ' watch-hide';
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

  // This function will modify the uploaded date text to include the number of days since then

  function showPublishedDateInDays() {
    var uploaderInfo = document.getElementById('watch-uploader-info');
    var publishedDateText = uploaderInfo.getElementsByClassName('watch-time-text')[0];

    // There are two wordings with the text, need to replace both phrases to extract the date

    var publishedDate = publishedDateText.innerHTML.replace('Published on ', '').replace('Uploaded on ', '');

    // Using moment.js to parse the published date

    var publishedDateMoment = moment(publishedDate, 'MMM D, YYYY');

    // Current time

    var currentDateMoment = moment();

    var daysDiff = currentDateMoment.diff(publishedDateMoment, 'days');

    // Modify the text to include the days difference, with a dot separator mimicking the style on YouTube

    publishedDateText.innerHTML = publishedDateText.innerHTML + ' &#x002022 (' + daysDiff + ' days ago)';
  }

  // Register functions with global keys

  polarisYT['YT_WATCH_PAGE_SHOW_LIKE_PERCENTAGE'] = { action : showLikeDislikePercentage };
  polarisYT['YT_WATCH_PAGE_HIDE_RECOMMEND'] = { action : hideRecommendedVideos };
  polarisYT['YT_WATCH_PAGE_PUBLISH_TIME_DAYS'] = { action : showPublishedDateInDays };

})();