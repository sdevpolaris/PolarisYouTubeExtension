// This file contains functions that will be injected into the context of YouTube's
// actual web pages

function removeAnnotationWrapper(create) {
  return function () {
    window.ytplayer.config.args.iv_load_policy = "3";
    // window.ytplayer.config.args.dash = "0";
    console.log(window.ytplayer.config.args.dash);
    create.apply(this, arguments);
  };
}

// This custom event is used to pass YouTube's player configuration properties

document.addEventListener('PolarisYTConfigsRequest', function(e) {
  var resp = new CustomEvent('PolarisYTConfigsResponse', {'detail': window.ytplayer.config.args});
  document.dispatchEvent(resp);
});