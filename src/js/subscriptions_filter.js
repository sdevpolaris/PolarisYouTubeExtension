(function() {

  'use strict';

  function injectSubscriptionFilter() {

    // Find the existing subscriptions side panels on YouTube

    var subscriptions_panel = document.getElementsByClassName("guide-toplevel")[0];
    var subscriptions_section = document.getElementById('guide-subscriptions-section');

    // Create a new section

    var subscriptions_filter_section = document.createElement('li');
    subscriptions_filter_section.id = "subscriptions-filter-section";
    subscriptions_filter_section.className = "guide-section";

    // Insert our section before the existing one

    subscriptions_panel.insertBefore(subscriptions_filter_section, subscriptions_section);
    var subscriptions_filter_html = '<h3>SUBSCRIPTIONS FILTER</h3><div id="subscriptions-filter-border" class="masthead-search-terms-border"><input id="subscriptions-filter-search" type="text" autocomplete="off" autofocus placeholder="Filter keyword" class="search-term masthead-search-renderer-input yt-uix-form-input-bidi" value=""/></div><hr class="guide-section-separator">';
    
    // Inject custom inputs and misc. elements

    subscriptions_filter_section.innerHTML = subscriptions_filter_html + subscriptions_filter_section.innerHTML;

    // Initialize filter function

    var search = document.getElementById("subscriptions-filter-search");
    search.oninput = function() {
      filterSubscriptions(search.value);
    };


    /*
      A mutation observer is used to watch for whenever the user changes the sort order of the subscription list on the side panel

      Three sort orders from YouTube's UI: Most relevant, New activity, and A-Z

      Whenever a sort order is selected, the entire subscription list will be deleted and re-added by YouTube's scripts
      This observer will filter mutations and catch the exact one when it occurs, so that we can apply the existing filter word
      to the new sorted list to make the UI work seemlessly
    */

    var observer = new MutationObserver(function(mutations) {
      for (var index in mutations) {
        var mutation = mutations[index];
        if (mutation.addedNodes.length === 3 &&
            mutation.removedNodes.length === 1 &&
            mutation.removedNodes[0].id === 'guide-subscriptions-section') {
          filterSubscriptions(search.value);
        }
      }
    });

    var config = { attributes: false, subtree: true, childList: true };
    observer.observe(subscriptions_panel, config);
  }

  function filterSubscriptions(keyword) {
    var subscription_list_wrapper = document.getElementById("guide-channels");
    var subscriptions = subscription_list_wrapper.getElementsByTagName("li");

    for (var i = 0; i < subscriptions.length; i++) {
      var channel_name = subscriptions[i].getElementsByTagName("a")[0].getAttribute("title");
      if (channel_name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
        subscriptions[i].style.display = "";
      } else {
        subscriptions[i].style.display = "none";
      }
    }
  }

  var documentElement = document.documentElement;
  var isSidePanelLoaded = document.getElementsByClassName("guide-toplevel")[0] !== undefined;
  var isSubscriptionFilterInjected = document.getElementById('subscriptions-filter-section') !== null;

  if (uiSettings.POLARIS_YT_SUBFILTER) {

    // Inject the filter immediately if the page has already loaded the side panel

    if (isSidePanelLoaded && !isSubscriptionFilterInjected) {
      injectSubscriptionFilter();
    } else {

      // Listen for the event during the first time the user clicks the Hamburger icon and opens up the side panel

      documentElement.addEventListener("load", function handler() {
        if (document.getElementsByClassName("guide-toplevel")[0]) {
          if (!document.getElementById('subscriptions-filter-section')) {
            injectSubscriptionFilter();
            documentElement.removeEventListener('load', handler, true);
          }
        }
      }, true);
    }
  }

})();