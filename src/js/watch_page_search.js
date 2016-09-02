polarisYT['YT_WATCH_PAGE_SEARCH'] = (function(){

  'use strict';

  function injectCustomSearches() {

    var sidebarModules = document.getElementById('watch7-sidebar-modules');

    // Create a new section on the sidebar for the custom search functions

    var customSearchSection = document.createElement('div');
    customSearchSection.id = 'custom-search-section';
    customSearchSection.className = 'watch-sidebar-section';

    // Wrapper div for the search input

    var customSearchDiv = document.createElement('div');
    customSearchDiv.id = 'watch-custom-search-border';
    customSearchDiv.className = 'masthead-search-terms-border';

    sidebarModules.insertBefore(customSearchSection, sidebarModules.firstChild);

    var sidebarSeparator = document.createElement('hr');
    sidebarSeparator.className = 'watch-sidebar-separation-line';

    var customSearchHTML = '<input id="watch-custom-search" type="text" autocomplete="off" autofocus placeholder="Filter keyword" class="search-term masthead-search-renderer-input yt-uix-form-input-bidi" value=""/>';

    customSearchDiv.innerHTML = customSearchDiv.innerHTML + customSearchHTML;


    // This toggle will show and hide search options

    var searchDisplayToggle = document.createElement('button');
    searchDisplayToggle.id = 'watch-custom-search-toggle';
    searchDisplayToggle.className = 'yt-uix-button yt-uix-button-default yt-uix-button-size-default';

    var searchDisplayToggleText = document.createElement('span');
    searchDisplayToggleText.className = 'yt-uix-button-content';
    searchDisplayToggleText.innerHTML = 'Show Search Options';

    searchDisplayToggle.appendChild(searchDisplayToggleText);

    customSearchSection.appendChild(searchDisplayToggle);
    customSearchSection.appendChild(customSearchDiv);
    customSearchSection.appendChild(sidebarSeparator);
  }

  return {
    action : injectCustomSearches
  }

})();