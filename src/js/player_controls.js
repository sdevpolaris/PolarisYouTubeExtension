(function(){

  'use strict';

  var inCinema = false;

  function isFullscreen() {
    return document.webkitIsFullScreen;
  }

  // Loading overlay is used by showing thumbnail since it uses ajax call
  // and since some videos have really high res photo as thumbnail

  function showLoadingOverlay(displayText) {
    var loadingDiv = document.getElementById('loadingDivId');

    if (!loadingDiv) {
      loadingDiv = document.createElement('div');
      loadingDiv.id = 'loadingDivId';
      loadingDiv.className = 'custom-bottom-right-overlay';

      var loadingIconDiv = document.createElement('div');

      var loadingIcon = document.createElement('i');
      loadingIcon.id = 'customLoadingIcon';
      loadingIcon.className = 'fa fa-spinner fa-spin';

      loadingIconDiv.appendChild(loadingIcon);

      var loadingFooterDiv = document.createElement('div');
      loadingFooterDiv.id = 'loadingFooter';
      loadingFooterDiv.className = 'screenshot-container';
      loadingFooterDiv.innerHTML = '<span class="custom-header-text">' + displayText + '</span>';

      loadingDiv.appendChild(loadingIconDiv);
      loadingDiv.appendChild(loadingFooterDiv);

      if (isFullscreen()) {
        var player = document.getElementById('movie_player');
        loadingDiv.classList.add('fullscreen-overlay');
        player.appendChild(loadingDiv);
      } else {
        document.body.appendChild(loadingDiv);
      }
    }

    loadingDiv.getElementsByTagName('span').innerHTML = displayText;
    loadingDiv.classList.remove('watch-hide');
  }

  function hideLoadingOverlay() {
    var loadingDiv = document.getElementById('loadingDivId');
    if (loadingDiv) {
      loadingDiv.classList.add('watch-hide');
    }
  }

  // Master function to enable the preview panel on the bottom right
  // This is shared between taking a screenshot and showing the thumbnail
  // type - 'video' or 'image'

  function enablePreviewPanel(control, source, type) {
    var screenshotDiv = document.getElementById('screenshotDivId');
    var fullsizeBtn;
    var previewText;
    var downloadPreviewBtn;
    var downloadFullsizeBtn;

    if (!screenshotDiv) {
      screenshotDiv = document.createElement('div');
      screenshotDiv.id = 'screenshotDivId';
      screenshotDiv.className = 'custom-bottom-right-overlay';

      var screenshotHeaderDiv = document.createElement('div');
      screenshotHeaderDiv.id = 'screenshotHeader';
      screenshotHeaderDiv.className = 'screenshot-container';
      screenshotHeaderDiv.innerHTML = '<span class="custom-header-text">Preview: (426 x 240p, 16:9)</span>';

      var closeBtn = document.createElement('button');
      closeBtn.id = 'screenshot-close';
      closeBtn.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-default';
      closeBtn.innerHTML = '<span class="yt-uix-button-content">Close</span>';

      closeBtn.onclick = function() {
        screenshotDiv.classList.add('watch-hide');
      };

      screenshotHeaderDiv.appendChild(closeBtn);

      screenshotDiv.appendChild(screenshotHeaderDiv);

      var screenshotFooterDiv = document.createElement('div');
      screenshotFooterDiv.id = 'screenshotFooter';
      screenshotFooterDiv.className = 'screenshot-container';

      downloadPreviewBtn = document.createElement('a');
      downloadPreviewBtn.id = 'screenshot-dl-preview';
      downloadPreviewBtn.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-default';
      downloadPreviewBtn.innerHTML = '<span class="yt-uix-button-content">Download Preview</span>';

      fullsizeBtn = document.createElement('a');
      fullsizeBtn.id = 'screenshot-fullsize';
      fullsizeBtn.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-default';
      fullsizeBtn.innerHTML = '<span class="yt-uix-button-content">See full size</span>';

      downloadFullsizeBtn = document.createElement('a');
      downloadFullsizeBtn.id = 'screenshot-dl-full';
      downloadFullsizeBtn.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-default';
      downloadFullsizeBtn.innerHTML = '<span class="yt-uix-button-content">Download Fullsize</span>';

      screenshotFooterDiv.appendChild(downloadPreviewBtn);
      screenshotFooterDiv.appendChild(fullsizeBtn);
      screenshotFooterDiv.appendChild(downloadFullsizeBtn);

      screenshotDiv.appendChild(screenshotFooterDiv);

      if (isFullscreen()) {
        var player = document.getElementById('movie_player');
        screenshotDiv.classList.add('fullscreen-overlay');
        player.appendChild(screenshotDiv);
      } else {
        document.body.appendChild(screenshotDiv);
      }
    }

    screenshotDiv.classList.remove('watch-hide');
    fullsizeBtn = document.getElementById('screenshot-fullsize');
    previewText = document.getElementById('screenshotHeader').getElementsByTagName('span')[0];
    downloadPreviewBtn = document.getElementById('screenshot-dl-preview');
    downloadFullsizeBtn = document.getElementById('screenshot-dl-full');

    var oldPreview = screenshotDiv.getElementsByTagName('canvas')[0];
    if (oldPreview) {
      screenshotDiv.removeChild(oldPreview);
    }

    var aspectRatio;
    var width;
    var height;

    if (type === 'video') {
      aspectRatio = source.videoWidth / source.videoHeight;
      width = source.videoWidth;
      height = Math.round(width / aspectRatio);

      previewText.innerHTML = 'Screenshot Preview: (426 x 240p, 16:9)';
      downloadPreviewBtn.setAttribute('download', 'screenshot-preview.png');
      downloadFullsizeBtn.setAttribute('download', 'screenshot-full.png');
    } else {
      aspectRatio = source.width / source.height;
      width = source.width;
      height = Math.round(width / aspectRatio);

      previewText.innerHTML = 'Thumbnail Preview: (426 x 240p, 16:9)';
      downloadPreviewBtn.setAttribute('download', 'thumbnail-preview.png');
      downloadFullsizeBtn.setAttribute('download', 'thumbnail-full.png');
    }

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

    ctxFull.drawImage(source, 0, 0, width, height);

    // Draw the previous based on the full size canvas

    ctxPreview.drawImage(canvasFull, 0, 0, lowResWidth, lowResHeight);

    screenshotDiv.insertBefore(canvasPreview, screenshotDiv.children[1]);

    var screenshotImgFullsize = new Image();
    var screenshotImgFullsizeURL = canvasFull.toDataURL('image/png');

    // Need to use blobs to store the data from the canvas elements since
    // we cannot directly use toDataUrl function from canvas objects as
    // the function returns a long string of URL that has the content embedded in the URL

    // Long URLs are rejected by the browser and will not complete the download.
    // Blobs have URLs that is generated using the current domain name (youtube.com) prepended
    // to a unique identifier, which will never go past the URL length limit of the browser

    canvasPreview.toBlob(function(blob) {
      var blobUrl = URL.createObjectURL(blob);
      downloadPreviewBtn.setAttribute('href', blobUrl);
    });

    canvasFull.toBlob(function(blob) {
      var blobUrl = URL.createObjectURL(blob);
      downloadFullsizeBtn.setAttribute('href', blobUrl);
    });

    screenshotImgFullsize.src = screenshotImgFullsizeURL;
    fullsizeBtn.onclick = function() {
      var win = window.open();
      win.document.body.appendChild(screenshotImgFullsize);
    };

    if ('image' === type) {
      hideLoadingOverlay();
    }
  }

  // Return the thumbnail url that has the highest resolution
  // The key that holds the thumbnail image in the config object is "iurl[quality][_webp]"
  // Thumbnails stored on YouTube could be either a jpeg (no _webp) or webp (with _webp)

  function getThumbnailURL() {
    var key_base = 'iurl';
    var webp = '_webp';
    var qualityList = ['maxres', 'sd', 'hq', '', 'mq'];

    // Quality list is sorted from highest res to lowest
    // We want to return as soon as we find an existing one (highest resolution available)

    for (var i in qualityList) {
      var quality = qualityList[i];
      var primary = key_base + quality;
      var url = playerConfigs[primary];
      if (url) {
        return url;
      }

      var secondary = key_base + quality + webp;
      url = playerConfigs[secondary];
      if (url) {
        return url;
      }
    }
  }

  // Function to enable the loop function
  // Fortunately the YouTube html5 video supports attribute loop, which can be set to enable or disable looping

  function enableLoop(control, video) {
    control.onclick = function() {
      var svg = control.getElementsByTagName('svg')[0];
      var active = svg.classList.contains('fa-spin');
      if (active) {
        svg.classList.remove('fa-spin');
        video.loop = false;
      } else {
        svg.classList.add('fa-spin');
        video.loop = true;
      }
    }
  }

  function createCustomControlObject(svgUri, template, normX, normY, fullX, fullY) {
    var customControl = template.cloneNode(true);
    customControl.classList.remove('ytp-fullscreen-button');
    customControl.getElementsByTagName('text')[0].innerHTML = svgUri;

    var wrapper = {};
    wrapper.control = customControl;
    wrapper.normX = normX;
    wrapper.normY = normY;
    wrapper.fullX = fullX;
    wrapper.fullY = fullY;
    return wrapper;
  }

  function toggleFullscreenStyles(controlObjs) {
    for (var i = 0; i < controlObjs.length; i++) {
      var controlObj = controlObjs[i];
      var control = controlObj.control;
      var text = control.getElementsByTagName('text')[0];
      var svg = control.getElementsByTagName('svg')[0];

      if (isFullscreen()) {
        svg.classList.remove('watch-custom-control');
        svg.classList.add('watch-custom-control-fullscreen');
        text.attributes[0].value = controlObj.fullX;
        text.attributes[1].value = controlObj.fullY;
      } else {
        svg.classList.remove('watch-custom-control-fullscreen');
        svg.classList.add('watch-custom-control');
        text.attributes[0].value = controlObj.normX;
        text.attributes[1].value = controlObj.normY;
      }
    }
  }

  function toggleFullscreenPreviews() {
    var previewDiv = document.getElementById('screenshotDivId');
    var loadingDiv = document.getElementById('loadingDivId');
    var player = document.getElementById('movie_player');

    if (isFullscreen()) {
      if (previewDiv) {
        previewDiv.classList.add('fullscreen-overlay');
        player.appendChild(previewDiv);
      }
      if (loadingDiv) {
        loadingDiv.classList.add('fullscreen-overlay');
        player.appendChild(loadingDiv);
      }
    } else {
      if (previewDiv) {
        previewDiv.classList.remove('fullscreen-overlay');
        document.body.appendChild(previewDiv);
      }
      if (loadingDiv) {
        loadingDiv.classList.remove('fullscreen-overlay');
        document.body.appendChild(loadingDiv);
      }
    }
  }

  function toggleCinemaMode(overlay, header, isOn) {
    if (isOn) {
      header.classList.add('cinema-mode');
      overlay.classList.add('cinema-mode');
    } else {
      header.classList.remove('cinema-mode');
      overlay.classList.remove('cinema-mode');
    }
  }

  function createCinemaOverlay() {
    var cinemaOverlay = document.getElementById('cinema-overlay');
    if (!cinemaOverlay) {
      cinemaOverlay = document.createElement('div');
      cinemaOverlay.id = 'cinema-overlay';
      document.body.appendChild(cinemaOverlay);
    }
  }

  function cinemaModeEvent() {
    var cinemaOverlay = document.getElementById('cinema-overlay');
    var topHeader = document.getElementById('masthead-positioner');

    if (inCinema) {
      toggleCinemaMode(cinemaOverlay, topHeader, false);
    } else {
      toggleCinemaMode(cinemaOverlay, topHeader, true);
    }

    inCinema = !inCinema;
  }

  function cinemaModeCleanup(context) {
    var cinemaOverlay = document.getElementById('cinema-overlay');
    var topHeader = document.getElementById('masthead-positioner');

    if (cinemaOverlay && topHeader) {
      if (context !== 'WATCH') {
        toggleCinemaMode(cinemaOverlay, topHeader, false);
      } else {
        if (inCinema) {
          toggleCinemaMode(cinemaOverlay, topHeader, true);
        } else {
          toggleCinemaMode(cinemaOverlay, topHeader, false);
        }
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
        <text x="11" y="24">&#xf030;</text> \
      </g> \
    </svg>';

    // Our custom controls, note here instead of applying class names to use Font Awesome icons,
    // we directly reference by svg data uri

    var customControlsList = [];
    var screenshotControlObj = createCustomControlObject('&#xf030;', controlTemplate, '9', '24', '15', '36');
    var repeatControlObj = createCustomControlObject('&#xf01e;', controlTemplate, '11', '24', '17.5', '35');
    var thumbnailControlObj = createCustomControlObject('&#xf03e;', controlTemplate, '9', '24', '15', '36');
    var cinemaControlObj = createCustomControlObject('&#xf185;', controlTemplate, '9', '24', '15', '36');

    var screenshotControl = screenshotControlObj.control;
    var repeatControl = repeatControlObj.control;
    var thumbnailControl = thumbnailControlObj.control;
    var cinemaControl = cinemaControlObj.control;

    // Add our custom tooltips to the controls here

    screenshotControl.classList.add('yt-uix-tooltip');
    screenshotControl.setAttribute('title', 'Screenshot');

    repeatControl.classList.add('yt-uix-tooltip');
    repeatControl.setAttribute('title', 'Loop Video');

    thumbnailControl.classList.add('yt-uix-tooltip');
    thumbnailControl.setAttribute('title', 'See Thumbnail');

    cinemaControl.classList.add('yt-uix-tooltip');
    cinemaControl.setAttribute('title', 'Cinema Mode (Fades page to black)');

    customControlsList.push(screenshotControlObj);
    customControlsList.push(repeatControlObj);
    customControlsList.push(thumbnailControlObj);
    customControlsList.push(cinemaControlObj);

    // Insert all of the custom controls to the right hand list of controls

    for (var i = 0; i < customControlsList.length; i++) {
      var control = customControlsList[i].control;
      var firstChild = bottomRightControls.children[0];
      bottomRightControls.insertBefore(control, firstChild);
    }

    // Toggle to refresh and apply custom coordinates for the first time

    toggleFullscreenStyles(customControlsList);

    // Need to listen for the event when the player goes fullscreen, the bottom controls will change size
    // Bottom settings panel changes from height 36px -> 54px, need to update font sizes and svg text x-y coords

    var player = document.getElementById('movie_player');
    player.addEventListener('webkitfullscreenchange', function(e) {
      toggleFullscreenStyles(customControlsList);
      toggleFullscreenPreviews();
    });

    var video = player.getElementsByTagName('video')[0];

    screenshotControl.onclick = function() {
      enablePreviewPanel(screenshotControl, video, 'video');
    };

    thumbnailControl.onclick = function() {
      showLoadingOverlay('Loading Thumbnail');
      var thumbnail = new Image();

      // Need to load the content of the thumbnail into a blob to bypass the cross origin restriction
      // We need to use ajax to get the content and pass it into an image's src, and then listen for
      // the onload event to get the correct dimensions and enable the control

      // Without doing this, the canvas in the popup will be "tainted" and therefore cannot be downloaded as a file

      thumbnail.onload = function() {
        enablePreviewPanel(thumbnailControl, thumbnail, 'image');
      };

      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200 || xhr.status === 304) {
            thumbnail.src = URL.createObjectURL(xhr.response);
          }
        }
      };
      xhr.open('GET', getThumbnailURL(), true);
      xhr.responseType = 'blob';
      xhr.send();
    }

    createCinemaOverlay();
    cinemaControl.onclick = cinemaModeEvent;

    enableLoop(repeatControl, video);
  }

  polarisYT['YT_PLAYER_CUSTOM_CONTROLS'] = { action: insertCustomPlayerControls };
  polarisYT['YT_WATCH_CLEANUP'].push(cinemaModeCleanup);

})();