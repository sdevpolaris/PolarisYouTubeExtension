(function() {
  'use strict';
  var navigBtn = null;
  var playerBtn = null;
  var navigPage = null;
  var playerPage = null;

  /* Navigation variables */

  var removePlaylist = null;

  /* Player variables */
  var defaultPlayerQualityGroup = null;
  var defaultPlayerQuality = 'large';
  var qualityButtons = null;
  
  var defaultVolume = 100;
  var defaultVolumeInput = null;
  
  var removeAnnotations = false;
  var removeAnnotationsToggle = null;

  var pauseVideoOnStart = false;
  var pauseVideoOnStartToggle = null;

  var defaultPlayerSize = 'large';
  var playerSizeButtons = null;

  var saveBtn = null;
  var saveNotify = null;

  function initGlobalNavToggle() {
    $('.navbar-nav li').click(function(){
      $('.navbar-nav li.active').removeClass('active');
      var currNav = $(this);
      if (!currNav.hasClass('active')) {
        currNav.addClass('active');
      }
    });
  }

  function globalSettingToggle(panel) {
    var selectedPanel = $('.panel.visible');
    if (!panel.hasClass('visible')) {
      if (selectedPanel.length) {
        selectedPanel.fadeTo('fast', 0, function(){
          selectedPanel.removeClass('visible');
          panel.addClass('visible');
          panel.fadeTo('fast', 1);
        });
      }
    }
  }

  function dirty(flag) {
    flag? saveBtn.removeClass('disabled') : saveBtn.addClass('disabled');
  }

  function initCheckBoxToggle(cbID) {
    var setting = $(cbID);
    setting.change(function() {
      setting[0].checked = $(this).is(':checked');
      dirty(true);
    });
    return setting;
  }

  function initNavPage() {
    removePlaylist = initCheckBoxToggle('#rm-playlist');
  }

  function qualityBtnToggle(qButtons, index) {
    function removeActive(i, qButtons) {
      if (i != index) {
        if (qButtons[i].active) {
          qButtons[i].active = false;
          qButtons[i].obj.removeClass('active');
        }
      }
    }
    for (var ind in qButtons) {
      removeActive(ind, qButtons);
    }
  }

  function initQualityClickHandlers(qGroup, qButtons) {
    function qualityClickHandler(index, qButton) {
      qButton[index].obj.click(function() {
        if (qButton[index].active) {
          dirty(false);
        } else {
          dirty(true);
        }
        qButton[index].obj.addClass('active');
        qButton[index].active = true;
        defaultPlayerQuality = qButton[index].text;
        qualityBtnToggle(qButton, index);
      });
    }
    for (var i in qButtons) {
      qualityClickHandler(i, qButtons);
    }
  }

  function sizeBtnToggle(qButtons, index) {
    function removeActive(i, qButtons) {
      if (i != index) {
        if (qButtons[i].active) {
          qButtons[i].active = false;
          qButtons[i].obj.removeClass('active');
        }
      }
    }
    for (var ind in qButtons) {
      removeActive(ind, qButtons);
    }
  }

  function initSizeClickHandlers(qButtons) {
    function sizeClickHandler(index, qButton) {
      qButton[index].obj.click(function() {
        if (qButton[index].active) {
          dirty(false);
        } else {
          dirty(true);
        }
        qButton[index].obj.addClass('active');
        qButton[index].active = true;
        defaultPlayerSize = qButton[index].text;
        qualityBtnToggle(qButton, index);
      });
    }
    for (var i in qButtons) {
      sizeClickHandler(i, qButtons);
    }
  }

  function initPlayerPage() {
    // Quality buttons
    defaultPlayerQualityGroup = $('default-quality-list');
    qualityButtons = { auto: {obj: $('#auto'),   text: 'auto',   active: false},
                       tiny: {obj: $('#tiny'),   text: 'tiny',   active: false},
                      small: {obj: $('#small'),  text: 'small',  active: false},
                     medium: {obj: $('#medium'), text: 'medium', active: false},
                      large: {obj: $('#large'),  text: 'large',  active: false},
                      hd720: {obj: $('#hd720'),  text: 'hd720',  active: false},
                     hd1080: {obj: $('#hd1080'), text: 'hd1080', active: false} };
    initQualityClickHandlers(defaultPlayerQualityGroup, qualityButtons);
    
    // Volume
    defaultVolumeInput = $('#default-volume');
    defaultVolumeInput.change(function() {
      var volumeChange = $(this)[0].valueAsNumber;
      if (!(volumeChange === NaN) && volumeChange <= 100 && volumeChange >= 0) {
        defaultVolume = volumeChange;
        dirty(true);
      }
    });

    // Annotation
    removeAnnotationsToggle = $('#rm-annotations');
    removeAnnotationsToggle.change(function(){
      if ($(this).is(':checked')) {
        removeAnnotations = true;
      } else {
        removeAnnotations = false;
      }
      dirty(true);
    });

    // Pausing
    pauseVideoOnStartToggle = $('#pause-video');
    pauseVideoOnStartToggle.change(function() {
      if ($(this).is(':checked')) {
        pauseVideoOnStart = true;
      } else {
        pauseVideoOnStart = false;
      }
      dirty(true);
    });

    playerSizeButtons = { small: {obj: $('#player-small'), text: 'small', active: false},
                          large: {obj: $('#player-large'), text: 'large', active: false} };
    initSizeClickHandlers(playerSizeButtons);
  }

  function reloadPlayerSettings() {
    qualityButtons[defaultPlayerQuality].active = true;
    qualityButtons[defaultPlayerQuality].obj.addClass('active');

    defaultVolumeInput[0].value = defaultVolume;

    removeAnnotationsToggle[0].checked = removeAnnotations;

    pauseVideoOnStartToggle[0].checked = pauseVideoOnStart;

    playerSizeButtons[defaultPlayerSize].active = true;
    playerSizeButtons[defaultPlayerSize].obj.addClass('active');
  }

  function reloadSettings() {
    chrome.storage.sync.get(['nav_rmPL', 
                             'player_quality', 
                             'player_volume', 
                             'player_annotation',
                             'player_pauseOnStart',
                             'player_size'], 
                              function(result){
      if (result['nav_rmPL'] !== undefined) {
        removePlaylist[0].checked = result['nav_rmPL'];
      }
      if (result['player_quality'] !== undefined) {
        defaultPlayerQuality = result['player_quality'];
      }
      if (result['player_volume'] !== undefined) {
        defaultVolume = result['player_volume'];
      }
      if (result['player_annotation'] !== undefined) {
        removeAnnotations = result['player_annotation'];
      }
      if (result['player_pauseOnStart'] !== undefined) {
        pauseVideoOnStart = result['player_pauseOnStart'];
      }
      if (result['player_size'] !== undefined) {
        defaultPlayerSize = result['player_size'];
      }
      reloadPlayerSettings();
    });
  }

  function initGlobal() {
    saveBtn = $('.save');
    saveNotify = $('.save-notify');
    saveBtn.click(function(){
      chrome.storage.sync.set({
        'nav_rmPL': removePlaylist[0].checked,
        'player_quality': defaultPlayerQuality,
        'player_volume': defaultVolume,
        'player_annotation': removeAnnotations,
        'player_pauseOnStart': pauseVideoOnStart,
        'player_size': defaultPlayerSize
      }, function(){
        saveNotify.show();
        dirty(false);
        setTimeout(function(){
          saveNotify.hide();
        }, 750); 
      }); 
    });
  }

  function init() {
    navigBtn = $('.navig-btn');
    playerBtn = $('.player-btn');
    navigPage = $('.navig-settings');
    playerPage = $('.player-settings');

    $('#rm-playlist-icon').tooltip({placement: 'top'});
    $('#default-quality-icon').tooltip({placement: 'top'});
    $('#rm-annotations-icon').tooltip({placement: 'top'});
    $('#smart-buffering-icon').tooltip({placement: 'top'});

    // Default nav settings for now
    navigBtn.parent().addClass('active');
    navigPage.css('opacity', '1');

    initGlobalNavToggle();
    initGlobal();
    initNavPage();
    initPlayerPage();
    reloadSettings();

    navigBtn.click(function(e){
      globalSettingToggle(navigPage);
    });
    playerBtn.click(function(e){
      globalSettingToggle(playerPage);
    });
  }

  init();
})();