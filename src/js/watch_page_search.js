polarisYT['YT_WATCH_PAGE_SEARCH'] = (function(){

  'use strict';

  function buildItem(tile) {

    // Url of the video

    var url = tile.querySelectorAll('.yt-lockup-thumbnail a.yt-uix-sessionlink')[0].attributes.href.value;

    // There are two possible ways to get the source of the thumbnail image element
    // either through the src attribute or the data-thumb attribute

    var img = tile.getElementsByTagName('img')[0];
    var thumbnail = img.attributes['data-thumb'];
    var imgsrc;

    if (thumbnail === undefined) {
      imgsrc = img.attributes.src.value;
    } else {
      imgsrc = img.attributes['data-thumb'].value;
    }

    // Title of the video

    var title = tile.querySelectorAll('.yt-lockup-content .yt-lockup-title a')[0].attributes.title.value;

    // ytid is used for showing the correct hover card for the channel

    var channelMeta = tile.querySelectorAll('.yt-lockup-byline a')[0];
    var channel = channelMeta.innerText;
    var ytid = channelMeta.attributes['data-ytid'].value;

    var videoTime = tile.querySelectorAll('.video-time');

    if (videoTime.length === 0) {
      videoTime = '';
    } else {
      videoTime = videoTime[0].innerText;
    }

    // View count can be either a number, or in the case of streaming videos, they have "(number) watching" instead

    var viewsMeta = tile.querySelectorAll('.yt-lockup-meta-info li');
    var views;

    if (viewsMeta.length === 1) {
      views = viewsMeta[0].innerText;
    } else if (viewsMeta.length === 2) {
      views = viewsMeta[1].innerText;
    }

    // A simple template for a video item in the related list
    // The entire HTML element is exported from inspecting YouTube's watch page
    // and stripping away unnecessary attributes and styles

    // Using pure HTML declaration here with string concatentation since rebuilding
    // this entire element using DOM API would be a huge pain

    var item = document.createElement('li');
    item.className = 'video-list-item related-list-item show-video-time';

    var itemInnerHTML = '\
    <div class="content-wrapper"> \
      <a href="'+url+'" class="yt-uix-sessionlink  content-link spf-link spf-link " rel="spf-prefetch" title="'+title+'"> \
        <span dir="ltr" class="title" aria-describedby="description-id-616660"> \
          '+title+'\
        </span> \
        <span class="accessible-description"> \
          - Duration: '+videoTime+'. \
        </span> \
        <span class="stat attribution"><span class="g-hovercard" data-name="autonav" data-ytid="'+ytid+'">'+channel+'</span></span> \
        <span class="stat view-count"> \
          '+views+'\
        </span> \
      </a> \
    </div> \
    <div class="thumb-wrapper"> \
      <a href="'+url+'" class="yt-uix-sessionlink thumb-link spf-link spf-link" rel="spf-prefetch" tabindex="-1" aria-hidden="true"> \
        <span class="yt-uix-simple-thumb-wrap yt-uix-simple-thumb-related" tabindex="0" data-vid="Qcah1Tk2cn0"> \
          <img height="94" style="top: 0px" src="'+imgsrc+'" aria-hidden="true" width="168"> \
        </span> \
      </a> \
      <span class="video-time"> \
        '+videoTime+'\
      </span> \
    </div>';

    item.innerHTML = itemInnerHTML;

    return item;
  }

  function displaySearchResults(tiles, query, cbObject) {

    // Always hide related videos (Old lists) and show our new search results
    // whenever the search query completes

    cbObject.searchResultList.innerHTML = '';
    cbObject.relatedSection.classList.add('watch-hide');
    cbObject.upNextSection.classList.add('watch-hide');

    // Update title with query

    cbObject.searchResultTitle.innerHTML = 'Result for query: ' + query;

    // Build each item from the result and add to the search result list

    for (var t = 0; t < tiles.length; t++) {
      var item = buildItem(tiles[t]);
      cbObject.searchResultList.appendChild(item);
    }
  }

  function parseResponseAsDomAndQuery(responseText, query, cbObject) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(responseText, 'text/html');
    var resultTiles = doc.getElementsByClassName('yt-lockup-video');

    // Display the results to the sidebar

    displaySearchResults(resultTiles, query, cbObject);
  }

  // This function returns the current username of the video playing by parsing
  // the href attribute of user's logo (Not the channel name link since that gives a hashed channel ID which cannot be used in channel search)

  function getCurrentUsername() {
    var header = document.getElementById('watch7-user-header');
    var userHref = header.getElementsByTagName('a')[0];

    return userHref.href.split('/').pop();
  }

  function queryVideos(xhr, query, channelOnly, cbObject) {

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

    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          parseResponseAsDomAndQuery(xhr.responseText, query, cbObject);
        } else {
          console.log('Custom Search failed unexpectedly');
        }
    }
    };
    xhr.open('GET', baseUrl + encodeURIComponent(query));
    xhr.send();
  }

  // Main function to create the section which all the custom search bars will sit in
  // Mainly using DOM API here to create the components since it would be easier to reference when
  // dealing with events

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

    // Instantiate references to the related video lists (After search section has already been added at the top)

    var upNextSection = sidebarModules.children[1];
    var relatedSection = sidebarModules.children[2];

    // Create the search resulting section

    var searchResultSection = document.createElement('div');
    searchResultSection.className = 'watch-sidebar-section';

    var searchResultTitle = document.createElement('div');
    searchResultTitle.innerHTML = 'Result for query: ';

    var searchResultBody = document.createElement('div');
    searchResultBody.className = 'watch-sidebar-body';

    var searchResultList = document.createElement('ul');
    searchResultList.className = 'video-list';

    searchResultBody.appendChild(searchResultList);

    searchResultSection.appendChild(searchResultTitle);
    searchResultSection.appendChild(searchResultBody);

    // Overwriting onsubmit/onclick functions to use xhr

    var xhr;

    var callbackObject = {};
    callbackObject.upNextSection = upNextSection;
    callbackObject.relatedSection = relatedSection;
    callbackObject.searchResultTitle = searchResultTitle;
    callbackObject.searchResultList = searchResultList;

    customSearchForm.onsubmit = function() {
      queryVideos(xhr, customSearchTerm.value, false, callbackObject);
      return false;
    }

    customSearchBtn.onclick = function() {
      queryVideos(xhr, customSearchTerm.value, false, callbackObject);
      return false;
    }

    customChannelSearchForm.onsubmit = function() {
      queryVideos(xhr, customChannelSearchTerm.value, true, callbackObject);
      return false;
    }

    customChannelSearchBtn.onclick = function() {
      queryVideos(xhr, customChannelSearchTerm.value, true, callbackObject);
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

    sidebarModules.appendChild(searchResultSection);

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