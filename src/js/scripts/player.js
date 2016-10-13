// This file contains functions that will be injected into the context of YouTube's
// actual web pages

(function() {

  'use strict';

  var polarisSettings = {};

  function initYTConfigListeners() {

    // This custom event is used to pass YouTube's player configuration properties

    document.addEventListener('PolarisYTConfigsRequest', function(e) {
      var response = window.ytplayer.config.args;
      var resp = new CustomEvent('PolarisYTConfigsResponse', {'detail': response});
    document.dispatchEvent(resp);
    });
  }

  function initPolarisSettingListeners() {
    document.addEventListener('PolarisSettingsResponse', function(e) {
      polarisSettings = e.detail;
      waitForPlayerApplicationCreate();
    });
  }

  function dispatchPolarisSettingRequest() {
    var settingRequest = new CustomEvent('PolarisSettingsRequest', {'detail' : 'injected'});
    document.dispatchEvent(settingRequest);
  }

  function interceptApplicationCreate(create) {
    return function () {

      // Passed in arguments[1] will be the config object that the native Application create
      // will use in order to create the player on YouTube

      // We want to return this custom function that eventually calls the original Application.create
      // but with modified args

      if (arguments && arguments[1] && arguments[1].args) {

        // iv_load_policy is the config that controls annotations, '3' denotes off and '1' is on

        arguments[1].args.iv_load_policy = polarisSettings.YT_PLAYER_ANNOTATIONS_OFF ? '3' : '1';
      }
      create.apply(this, arguments);
    };
  }

  function waitForPlayerApplicationCreate() {
    document.addEventListener('load', function(event) {
      if (event && window.yt && window.yt.player && window.yt.player.Application && window.yt.player.Application.create) {

        // Overwrite YouTube's player Application create method with our own

        Object.defineProperty(window.yt.player.Application, 'create', {
          value : interceptApplicationCreate(window.yt.player.Application.create)
        });
      }
    }, true);
  }

  initYTConfigListeners();
  initPolarisSettingListeners();
  dispatchPolarisSettingRequest();
})();