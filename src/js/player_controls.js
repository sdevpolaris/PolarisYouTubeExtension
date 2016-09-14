polarisYT['YT_PLAYER_CUSTOM_CONTROLS'] = (function(){

  'use strict';

  // className for the preview tooltip that popups when you hover the progress bar:
  // ytp-tooltip ytp-bottom ytp-preview, the previews

  function createCustomControl(svgUri, template) {
    var customControl = template.cloneNode(true);
    customControl.getElementsByTagName('text')[0].innerHTML = svgUri;
    return customControl;
  }

  function insertCustomPlayerControls() {
    var bottomRightControls = document.querySelectorAll('.ytp-chrome-bottom .ytp-right-controls')[0];
    var settingsControl = bottomRightControls.getElementsByClassName('ytp-settings-button')[0];
    var controlTemplate = settingsControl.cloneNode(false);
    controlTemplate.innerHTML = '\
    <svg class="watch-custom-control" height="100%" width="100%"> \
      <g> \
        <text x="10" y="24.5">&#xf030;</text> \
      </g> \
    </svg>';

    var screenshotControl = createCustomControl('&#xf030;', controlTemplate);
    var repeatControl = createCustomControl('&#xf01e;', controlTemplate);

    bottomRightControls.insertBefore(screenshotControl, bottomRightControls.children[0]);
    bottomRightControls.insertBefore(repeatControl, bottomRightControls.children[0]);
  }

  return {
    action : insertCustomPlayerControls
  };

})();