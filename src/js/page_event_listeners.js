(() => {

  "use strict";

  function runModules(conditions) {
    for (let m in contentScriptModules) {
      let module = contentScriptModules[m];
      if (module.init) {
        module.init();
      }
    }
  }

  // Global event listeners

  // readystatechange: initial load complete when we first inject content scripts into YouTube
  // e.g. from browser homepage -> any matched YouTube page, or any other domains to YouTube

  $(document).on("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
      runModules(null);
    }
  });

  // yt-navigate-finish: event fired off by spfjs whenever a subsequent page is fully loaded within YouTube 
  // (commonly known as the red-bar on the top of the screen)  

  $(document).on("yt-navigate-finish", () => {
    runModules(null);
  });

  // yt-guide-toggle: event fired off whenever the guide (sidebar) is toggled by clicking the Hamburger icon top left

  $(document).on("yt-guide-toggle", (event) => {
    runModules([{guide: true}]);
  });

})();