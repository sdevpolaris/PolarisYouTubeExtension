(function(){

  'use strict';

  var commentsShown = false;

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

    var updatedDateText = publishedDateText.innerHTML;

    if (daysDiff !== 1) {
      updatedDateText += ' &#x002022 (' + daysDiff + ' days ago)';
    } else {
      updatedDateText += ' &#x002022 (1 day ago)';
    }

    // Modify the text to include the days difference, with a dot separator mimicking the style on YouTube

    publishedDateText.innerHTML = updatedDateText;
  }

  function insertHideCommentSection() {
    var hideCommentsToggle = document.createElement('button');
    hideCommentsToggle.id = 'watch-hide-comments-toggle';
    hideCommentsToggle.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-expander';

    var hideCommentsToggleText = document.createElement('span');
    hideCommentsToggleText.className = 'yt-uix-button-content';
    hideCommentsToggleText.innerHTML = 'Hide Comment Section';

    hideCommentsToggle.appendChild(hideCommentsToggleText);

    var commentsSection = document.getElementById('watch-discussion');

    var observer = new MutationObserver(function(mutations) {
      for (var index in mutations) {
        var mutation = mutations[index];
        if (mutation.target.id === 'watch-discussion') {
          var commentsList = document.getElementById('comment-section-renderer');

          var hideCommentsToggle = document.createElement('button');
          hideCommentsToggle.id = 'watch-hide-comments-toggle';
          hideCommentsToggle.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-expander';

          var hideCommentsToggleText = document.createElement('span');
          hideCommentsToggleText.className = 'yt-uix-button-content';
          hideCommentsToggleText.innerHTML = 'Hide Comment Section';

          hideCommentsToggle.appendChild(hideCommentsToggleText);

          commentsSection.insertBefore(hideCommentsToggle, commentsSection.firstChild);

          var commentToggleFunction = function() {
            if (commentsShown) {
              commentsList.classList.remove('watch-hide');
              hideCommentsToggleText.innerHTML = 'Hide Comment Section';
            } else {
              commentsList.classList.add('watch-hide');
              hideCommentsToggleText.innerHTML = 'Show Comment Section';
            }
          };

          commentToggleFunction();

          hideCommentsToggle.onclick = function() {
            commentsShown = !commentsShown;
            commentToggleFunction();
          };

          // Disconnect the observer immediately since the Show More button disappears after one click

          observer.disconnect();
        }
      }
    });

    var config = { attributes: false, subtree: true, childList: true };
    observer.observe(commentsSection, config);
  }

  function switchWatchMode(custom) {

    // Don't do anything if it is auto, YouTube will use the default view mode based on session (or cookie?)

    if (custom === 'auto') {
      return;
    }

    var page = document.getElementById('page');

    if (custom === 'theater') {
      page.classList.add('watch-wide');
      page.classList.add('watch-stage-mode');
      page.classList.remove('watch-non-stage-mode');
    } else {
      page.classList.remove('watch-wide');
      page.classList.remove('watch-stage-mode');
      page.classList.add('watch-non-stage-mode');
    }
  }

  function showVideoKeywords() {
    var descriptionPanel = document.getElementById('watch-description');

    var keywords;

    if (playerConfigs.keywords) {
      keywords = playerConfigs.keywords.split(',').join(', ');
    } else {
      keywords = 'No keywords';
    }

    var keywordsPanel = document.createElement('div');
    keywordsPanel.className = 'yt-uix-button-panel';
    keywordsPanel.id = 'watch-keywords';
    keywordsPanel.innerHTML = '<h4>Keywords:</h4>' + keywords;

    descriptionPanel.parentNode.insertBefore(keywordsPanel, descriptionPanel.nextSibling);
  }

  // Register functions with global keys

  polarisYT['YT_WATCH_PAGE_SHOW_LIKE_PERCENTAGE'] = { action : showLikeDislikePercentage };
  polarisYT['YT_WATCH_PAGE_HIDE_RECOMMEND'] = { action : hideRecommendedVideos };
  polarisYT['YT_WATCH_PAGE_PUBLISH_TIME_DAYS'] = { action : showPublishedDateInDays };
  polarisYT['YT_WATCH_PAGE_SHOW_HIDE_COMMENTS'] = { action : insertHideCommentSection };
  polarisYT['YT_WATCH_PAGE_DEFAULT_WATCH_MODE'] = { action : switchWatchMode };
  polarisYT['YT_WATCH_SHOW_KEYWORDS'] = { action: showVideoKeywords };

})();