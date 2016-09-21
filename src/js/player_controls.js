polarisYT['YT_PLAYER_CUSTOM_CONTROLS'] = (function(){

  'use strict';

  // className for the preview tooltip that popups when you hover the progress bar:
  // ytp-tooltip ytp-bottom ytp-preview, the previews

  function enableScreenshot(control, video) {
    control.onclick = function() {
      var screenshotDiv = document.getElementById('screenshotDivId');
      var fullsizeBtn;
      var downloadPreviewBtn;
      var downloadFullsizeBtn;

      if (!screenshotDiv) {
        screenshotDiv = document.createElement('div');
        screenshotDiv.id = 'screenshotDivId';
        screenshotDiv.className = 'custom-bottom-right-overlay yt-card';

        var screenshotHeaderDiv = document.createElement('div');
        screenshotHeaderDiv.id = 'screenshotHeader';
        screenshotHeaderDiv.className = 'screenshot-container';
        screenshotHeaderDiv.innerHTML = '<span class="screenshot-text">Preview: (426 x 240p, 16:9)</span>';

        var closeBtn = document.createElement('button');
        closeBtn.id = 'screenshot-close';
        closeBtn.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-default';
        closeBtn.innerHTML = '<span class="yt-uix-button-content">Close</span>';

        closeBtn.onclick = function() {
          screenshotDiv.classList.add('watch-hide');
        };

        fullsizeBtn = document.createElement('button');
        fullsizeBtn.id = 'screenshot-fullsize';
        fullsizeBtn.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-default';
        fullsizeBtn.innerHTML = '<span class="yt-uix-button-content">See full size</span>';

        screenshotHeaderDiv.appendChild(fullsizeBtn);
        screenshotHeaderDiv.appendChild(closeBtn);

        screenshotDiv.appendChild(screenshotHeaderDiv);

        var screenshotFooterDiv = document.createElement('div');
        screenshotFooterDiv.id = 'screenshotFooter';
        screenshotFooterDiv.className = 'screenshot-container';

        downloadPreviewBtn = document.createElement('a');
        downloadPreviewBtn.id = 'screenshot-dl-preview';
        downloadPreviewBtn.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-default';
        downloadPreviewBtn.innerHTML = '<span class="yt-uix-button-content">Download Preview</span>';

        downloadFullsizeBtn = document.createElement('a');
        downloadFullsizeBtn.id = 'screenshot-dl-full';
        downloadFullsizeBtn.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-default';
        downloadFullsizeBtn.innerHTML = '<span class="yt-uix-button-content">Download Fullsize</span>';

        screenshotFooterDiv.appendChild(downloadPreviewBtn);
        screenshotFooterDiv.appendChild(downloadFullsizeBtn);

        screenshotDiv.appendChild(screenshotFooterDiv);

        document.body.appendChild(screenshotDiv);
      }

      screenshotDiv.classList.remove('watch-hide');
      fullsizeBtn = document.getElementById('screenshot-fullsize');
      downloadPreviewBtn = document.getElementById('screenshot-dl-preview');
      downloadFullsizeBtn = document.getElementById('screenshot-dl-full');

      var oldPreview = screenshotDiv.getElementsByTagName('canvas')[0];
      if (oldPreview) {
        screenshotDiv.removeChild(oldPreview);
      }

      var aspectRatio = video.videoWidth / video.videoHeight;
      var width = video.videoWidth;
      var height = Math.round(video.videoWidth / aspectRatio);

      // Dimension for previews, 16:9 240p

      var lowResWidth = 426;
      var lowResHeight = 240;

      var canvasPreview = document.createElement('canvas');
      canvasPreview.width = lowResWidth;
      canvasPreview.height = lowResHeight;

      var canvasFull = document.createElement('canvas');
      canvasFull.width = width;
      canvasFull.height = height;

      var ctxPreview = canvasPreview.getContext('2d');
      var ctxFull = canvasFull.getContext('2d');

      // Draw the full resolution screenshot first

      ctxFull.drawImage(video, 0, 0, width, height);

      // Draw the previous based on the full size canvas

      ctxPreview.drawImage(canvasFull, 0, 0, lowResWidth, lowResHeight);

      screenshotDiv.insertBefore(canvasPreview, screenshotDiv.children[1]);

      var screenshotImgFullsize = new Image();
      var screenshotImgPreviewURL = canvasPreview.toDataURL('image/png');
      var screenshotImgFullsizeURL = canvasFull.toDataURL('image/png');
      screenshotImgFullsize.src = screenshotImgFullsizeURL;
      downloadPreviewBtn.setAttribute('href', screenshotImgPreviewURL);
      downloadPreviewBtn.setAttribute('download', 'screenshot-preview.png');
      downloadFullsizeBtn.setAttribute('href', screenshotImgFullsizeURL);
      downloadFullsizeBtn.setAttribute('download', 'screenshot-full.png');

      fullsizeBtn.onclick = function() {
        var win = window.open();
        win.document.body.appendChild(screenshotImgFullsize);
      };
    };
  }

  // Function to enable the loop function
  // Fortunately the YouTube html5 video supports attribute loop, which can be set to enable or disable looping

  function enableLoop(control, video) {
    control.onclick = function() {
      var svg = control.getElementsByTagName('svg')[0];
      var active = svg.classList.contains('control-active');
      if (active) {
        svg.classList.remove('control-active');
        video.loop = false;
      } else {
        svg.classList.add('control-active');
        video.loop = true;
      }
    }
  }

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

    var alreadyInserted = bottomRightControls.getAttribute('custom-controls-inserted');

    // If the controls are already inserted, quit this function immediately

    if ('true' === alreadyInserted) {
      return;
    }

    bottomRightControls.setAttribute('custom-controls-inserted', 'true');

    var fullscreenControl = bottomRightControls.getElementsByClassName('ytp-fullscreen-button')[0];

    // Cloning the existing settings control button as a template

    var controlTemplate = fullscreenControl.cloneNode(false);
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

    var video = player.getElementsByTagName('video')[0];

    enableScreenshot(screenshotControl, video);
    enableLoop(repeatControl, video);
  }

  return {
    action : insertCustomPlayerControls
  };

})();