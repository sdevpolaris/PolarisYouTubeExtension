(function() {

  'use strict';

  function loadSavedSetting(callback) {
    chrome.storage.sync.get('polaris', function(items) {
      callback(items.polaris);
    });
  }

  function initializeTogglesWithSettings(settings) {
    for (var id in settings) {
      var enabled = settings[id];
      if (enabled) {
        var checkbox = $('#' + id);
        checkbox.prop('checked', true);
      }
    }
  }

  function toggleChanged() {
    console.log('set dirty');
  }

  function initializeTogglesWithListeners(settings) {
    for (var id in settings) {
      var checkbox = $('#' + id);
      checkbox.change(toggleChanged);
    }
  }

  function initializeFunctions(settings) {
    initializeTogglesWithSettings(settings);
    initializeTogglesWithListeners(settings);
    // saveChanges(settings);
  }

  function saveChanges(settings) {
    for (var id in settings) {
      var checkbox = $('#' + id);
      settings[id] = checkbox[0].checked;
    }
    chrome.storage.sync.set({
      polaris : settings
    }, function() {
      console.log('Saved settings');
    });
  }

  loadSavedSetting(initializeFunctions);

  
})();