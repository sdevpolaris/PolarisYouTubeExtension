polarisYT['YT_WATCH_PAGE_SEARCH'] = (function(){

  'use strict';

  function injectCustomSearches() {

    var sidebarModules = document.getElementById('watch7-sidebar-modules');

    // Create a new section on the sidebar for the custom search functions

    var customSearchSection = document.createElement('div');
    customSearchSection.id = 'custom-search-section';
    customSearchSection.className = 'watch-sidebar-section';

    sidebarModules.insertBefore(customSearchSection, sidebarModules.firstChild);

    var customSearchesWrapper = document.createElement('div');
    customSearchesWrapper.className = 'watch-hide';

    // Form structure for the search input (mirroring from YouTube's search bar on the top)

    var customSearchForm = document.createElement('form');
    customSearchForm.className = 'watch-custom-search-form search-form consolidated-form';
    // customSearchForm.innerHTML = '<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default search-btn-component search-button" type="submit" id="watch-custom-search-btn"><span class="watch-custom-search-glass yt-uix-button-content">Search</span></button><div class="watch-custom-search-terms masthead-search-terms-border"><input class="watch-custom-search-term search-term masthead-search-renderer-input yt-uix-form-input-bidi" name="search_query" value="" type="text" tabindex="1" placeholder="Search" title="Search" aria-label="Search" dir="ltr" spellcheck="false" style="outline: none;"></div>';

    var customSearchBtn = document.createElement('button');
    customSearchBtn.id = 'watch-custom-search-btn';
    customSearchBtn.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-default search-btn-component search-button';
    customSearchBtn.type = 'submit';

    var customSearchBtnContent = document.createElement('span');
    customSearchBtnContent.className = 'watch-custom-search-glass yt-uix-button-content';
    customSearchBtnContent.innerHTML = 'Search';

    var customSearchTerms = document.createElement('div');
    customSearchTerms.className = 'watch-custom-search-terms masthead-search-terms-border';

    var customSearchTerm = document.createElement('input');
    customSearchTerm.className = 'watch-custom-search-term search-term masthead-search-renderer-input yt-uix-form-input-bidi';
    customSearchTerm.type = 'text';
    customSearchTerm.value = '';
    customSearchTerm.placeholder = 'Search';

    customSearchTerms.appendChild(customSearchTerm);
    customSearchBtn.appendChild(customSearchBtnContent);

    customSearchForm.appendChild(customSearchBtn);
    customSearchForm.appendChild(customSearchTerms);

    // Form structure for the search input for searching only in current channel

    var customChannelSearchForm = customSearchForm.cloneNode(false);
    var customChannelSearchBtn = customSearchBtn.cloneNode(false);
    var customChannelSearchBtnContent = customSearchBtnContent.cloneNode(false);
    var customChannelSearchTerms = customSearchTerms.cloneNode(false);
    var customChannelSearchTerm = customSearchTerm.cloneNode(false);
    customChannelSearchTerm.placeholder = 'Search in the current channel';

    customChannelSearchTerms.appendChild(customChannelSearchTerm);
    customChannelSearchBtn.appendChild(customChannelSearchBtnContent);

    customChannelSearchForm.appendChild(customChannelSearchBtn);
    customChannelSearchForm.appendChild(customChannelSearchTerms);

    customSearchesWrapper.appendChild(customSearchForm);
    customSearchesWrapper.appendChild(customChannelSearchForm);

    // Line separator for the entire section

    var sidebarSeparator = document.createElement('hr');
    sidebarSeparator.className = 'watch-custom-sidebar-separation-line';

    // This toggle will show and hide search options

    var searchDisplayToggle = document.createElement('button');
    searchDisplayToggle.id = 'watch-custom-search-toggle';
    searchDisplayToggle.className = 'yt-uix-button yt-uix-button-default yt-uix-button-size-default';

    var searchDisplayToggleText = document.createElement('span');
    searchDisplayToggleText.className = 'yt-uix-button-content';
    searchDisplayToggleText.innerHTML = 'Show Search Options';

    searchDisplayToggle.appendChild(searchDisplayToggleText);

    // Add all components to the section element

    customSearchSection.appendChild(searchDisplayToggle);
    customSearchSection.appendChild(customSearchesWrapper);
    customSearchSection.appendChild(sidebarSeparator);

    // Initially the search options should be hidden

    var isSearchVisible = false;

    searchDisplayToggle.onclick = function() {
      isSearchVisible = !isSearchVisible;
      if (isSearchVisible) {
        customSearchesWrapper.classList.remove('watch-hide');
        searchDisplayToggleText.innerHTML = 'Hide Search Options';
      } else {
        customSearchesWrapper.classList.add('watch-hide');
        searchDisplayToggleText.innerHTML = 'Show Search Options';
      }
    }
  }

  return {
    action : injectCustomSearches
  }

})();