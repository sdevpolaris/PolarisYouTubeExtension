function removeAnnotationWrapper(create) {
  return function () {
    window.ytplayer.config.args.iv_load_policy = "3";
    // window.ytplayer.config.args.dash = "0";
    console.log(window.ytplayer.config.args.dash);
    create.apply(this, arguments);
  };
}

window.onYouTubePlayerReady = function(playerId) {
}

// document.documentElement.addEventListener("load", function () {
//   window.yt.player.Application.create = removeAnnotationWrapper(window.yt.player.Application.create);
// }, true);