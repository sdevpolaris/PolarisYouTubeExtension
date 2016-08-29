(function(){

  var watch_url_pattern = /.+:\/\/www\.youtube\.com\/watch.*/;

  function disableAutoplayAndAnnotations() {
    var settings = document.querySelector(".ytp-settings-button");

    // Clicking the Settings button so that each label within the list can be created
    settings.click();
    settings.click();

    var labels = document.getElementsByClassName("ytp-menuitem-label");

    for (var i = 0; i < labels.length; i++) {
      var label = labels[i];
      if (label.innerHTML === "Autoplay" && label.parentNode.getAttribute("aria-checked") === "true") {
        label.click();
      }
      if (label.innerHTML === "Annotations" && label.parentNode.getAttribute("aria-checked") === "true") {
        label.click();
      }
    }
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.watch) {
      setTimeout(function() {
        disableAutoplayAndAnnotations();
        console.log("ran");
      }, 1500); // Temporary detection
    }
  });

  if (watch_url_pattern.test(window.location.href)) {
    disableAutoplayAndAnnotations();
    console.log("ran begin");
  }

})();