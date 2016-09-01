polarisYT['POLARIS_YT_WATCH_PAGE_GENERAL'] = (function(){

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

  // Master function that will make enhancements to the watch page

  function enhanceWatchPage() {
    showLikeDislikePercentage();
  }

  return {
    action : enhanceWatchPage
  }

})();