(function() {

  'use strict';

  var dirty = false;
  var saveBtn;
  var reloadBtn;
  var settings;

  function loadSavedSetting(callback) {
    chrome.storage.sync.get('polaris', function(items) {
      settings = items.polaris;
      callback();
    });
  }

  function initTogglesWithSettings() {
    for (var id in settings) {
      var enabled = settings[id].enable;
      var checkbox = $('#' + id);
      checkbox[0].checked = enabled;
    }
  }

  function toggleChanged() {
    dirty = true;
    saveBtn.prop('disabled', '');
    reloadBtn.prop('disabled', '');
  }

  function initTogglesWithListeners() {
    for (var id in settings) {
      var checkbox = $('#' + id);
      checkbox.change(toggleChanged);
    }
  }

  function sendSettingUpdateMessage() {
    chrome.runtime.sendMessage({ settingsUpdate : true }, function(response) {

    });
  }

  function disableSaveAndReload() {
    saveBtn.prop('disabled', 'disabled');
    reloadBtn.prop('disabled', 'disabled');
    sendSettingUpdateMessage();
  }

  function reloadCallback() {
    initTogglesWithSettings();
    disableSaveAndReload();
  }

  function initSaveAndReload() {
    saveBtn = $('#save');
    saveBtn.click(function() {
      saveChanges(disableSaveAndReload);
    });

    reloadBtn = $('#reload');
    reloadBtn.click(function() {
      loadSavedSetting(reloadCallback);
    });
  }

  function initFunctions() {
    initTogglesWithSettings();
    initTogglesWithListeners();
    initSaveAndReload();
  }

  function saveChanges(callback) {
    for (var id in settings) {
      var checkbox = $('#' + id);
      settings[id].enable = checkbox[0].checked;
    }
    chrome.storage.sync.set({
      polaris : settings
    }, function() {
      callback();
    });
  }

  loadSavedSetting(initFunctions);
  
})();