polarisYT['YT_WATCH_PAGE_SEARCH'] = (function(){

  'use strict';

  var xhr;

  function parseResponseAsDomAndQuery(responseText) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(responseText, 'text/html');
    var resultTiles = doc.getElementsByClassName('yt-lockup-tile');

    // Display the results to the sidebar


  }

  function changeContents() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        parseResponseAsDomAndQuery(xhr.responseText);
      } else {
        console.log('Custom Search failed unexpectedly');
      }
    }
  }

  // This function returns the current username of the video playing by parsing
  // the href attribute of user's logo (Not the channel name link since that gives a hashed channel ID which cannot be used in channel search)

  function getCurrentUsername() {
    var header = document.getElementById('watch7-user-header');
    var userHref = header.getElementsByTagName('a')[0];

    return userHref.href.split('/').pop();
  }

  function queryVideos(query, channelOnly) {

    // Quit immediately if the input field has no content, no need to send a xhr with empty query

    if (query.length === 0) {
      return false;
    }

    var baseUrl;

    if (channelOnly) {
      var username = getCurrentUsername();
      baseUrl = 'https://www.youtube.com/user/' + username + '/search?query=';
    } else {
      baseUrl = 'https://www.youtube.com/results?search_query=';
    }

    xhr = new XMLHttpRequest();

    if (!xhr) {
      return false;
    }

    xhr.onreadystatechange = changeContents;
    xhr.open('GET', baseUrl + encodeURIComponent(query));
    xhr.send();
  }

  function injectCustomSearches() {

    var sidebarModules = document.getElementById('watch7-sidebar-modules');

    // Create a new section on the sidebar for the custom search functions

    var customSearchSection = document.createElement('div');
    customSearchSection.id = 'custom-search-section';
    customSearchSection.className = 'watch-sidebar-section';

    sidebarModules.insertBefore(customSearchSection, sidebarModules.firstChild);

    var customSearchesWrapper = document.createElement('div');

    // Form structure for the search input (mirroring from YouTube's search bar on the top)

    var customSearchForm = document.createElement('form');
    customSearchForm.className = 'watch-custom-search-form search-form consolidated-form';

    var customSearchBtn = document.createElement('button');
    customSearchBtn.id = 'watch-custom-search-btn';
    customSearchBtn.className = 'yt-uix-button yt-uix-button-size-default yt-uix-button-default search-btn-component search-button';

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

    // Overwriting onsubmit/onclick functions to use xhr

    customSearchForm.onsubmit = function() {
      queryVideos(customSearchTerm.value, false);
      return false;
    }

    customSearchBtn.onclick = function() {
      queryVideos(customSearchTerm.value, false);
      return false;
    }

    customChannelSearchForm.onsubmit = function() {
      queryVideos(customChannelSearchTerm.value, true);
      return false;
    }

    customChannelSearchBtn.onclick = function() {
      queryVideos(customChannelSearchTerm.value, true);
      return false;
    }

    // Line separator for the entire section

    var sidebarSeparator = document.createElement('hr');
    sidebarSeparator.className = 'watch-custom-sidebar-separation-line';

    // This toggle will show and hide search options

    var searchDisplayToggle = document.createElement('button');
    searchDisplayToggle.id = 'watch-custom-search-toggle';
    searchDisplayToggle.className = 'yt-uix-button yt-uix-button-default yt-uix-button-size-default';

    var searchDisplayToggleText = document.createElement('span');
    searchDisplayToggleText.className = 'yt-uix-button-content';
    searchDisplayToggleText.innerHTML = 'Hide Search Options';

    searchDisplayToggle.appendChild(searchDisplayToggleText);

    // Add all components to the section element

    customSearchSection.appendChild(searchDisplayToggle);
    customSearchSection.appendChild(customSearchesWrapper);
    customSearchSection.appendChild(sidebarSeparator);

    // Initially the search options should be showing

    var isSearchVisible = true;

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