polarisYT['YT_PLAYER_CUSTOM_CONTROLS'] = (function(){

  'use strict';

  // className for the preview tooltip that popups when you hover the progress bar:
  // ytp-tooltip ytp-bottom ytp-preview, the previews

  function createCustomControl(svgUri, template) {
    var customControl = template.cloneNode(true);
    customControl.getElementsByTagName('text')[0].innerHTML = svgUri;
    return customControl;
  }

  function enableFullscreenStyles(controls, isFullScreen) {
    for (var i = 0; i < controls.length; i++) {
      var control = controls[i];
      var text = control.getElementsByTagName('text')[0];
      var svg = control.getElementsByTagName('svg')[0];

      if (isFullScreen) {
        svg.classList.remove('watch-custom-control');
        svg.classList.add('watch-custom-control-fullscreen');
        text.attributes[0].value = "15";
        text.attributes[1].value = "37";
      } else {
        svg.classList.remove('watch-custom-control-fullscreen');
        svg.classList.add('watch-custom-control');
        text.attributes[0].value = "10";
        text.attributes[1].value = "24.5";
      }
    }
  }

  function insertCustomPlayerControls() {
    var bottomRightControls = document.querySelectorAll('.ytp-chrome-bottom .ytp-right-controls')[0];
    var settingsControl = bottomRightControls.getElementsByClassName('ytp-settings-button')[0];

    // Cloning the existing settings control button as a template

    var controlTemplate = settingsControl.cloneNode(false);
    controlTemplate.innerHTML = '\
    <svg class="watch-custom-control" height="100%" width="100%"> \
      <g> \
        <text x="10" y="24.5">&#xf030;</text> \
      </g> \
    </svg>';

    // Our custom controls, note here instead of applying class names to use Font Awesome icons,
    // we directly reference by svg data uri

    var customControlsList = [];
    var screenshotControl = createCustomControl('&#xf030;', controlTemplate);
    var repeatControl = createCustomControl('&#xf01e;', controlTemplate);

    customControlsList.push(screenshotControl);
    customControlsList.push(repeatControl);

    // Insert all of the custom controls to the right hand list of controls

    for (var i = 0; i < customControlsList.length; i++) {
      var control = customControlsList[i];
      var firstChild = bottomRightControls.children[0];
      bottomRightControls.insertBefore(control, firstChild);
    }

    // Need to listen for the event when the player goes fullscreen, the bottom controls will change size
    // Bottom settings panel changes from height 36px -> 54px, need to update font sizes and svg text x-y coords

    var player = document.getElementById('movie_player');
    player.addEventListener('webkitfullscreenchange', function(e) {
      enableFullscreenStyles(customControlsList, document.webkitIsFullScreen);
    });
  }

  return {
    action : insertCustomPlayerControls
  };

})();