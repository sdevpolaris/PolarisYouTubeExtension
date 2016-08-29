(function() {

  "use strict";

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

  function observeSubscriptions() {
    var guide_container = document.getElementById('guide-channels');

    var observer = new MutationObserver(function(mutations) {
      for (var mutation in mutations) {
        // console.log(mutations[mutation]);
      }
    });

    var config = { attributes: true, subtree: true, childList: true};
    observer.observe(guide_container, config);
  }

  document.documentElement.addEventListener("load", function() {
    if (document.getElementsByClassName("guide-toplevel")[0]) {
      if (!document.getElementById('subscriptions-filter-section')) {
        injectSubscriptionFilter();
        observeSubscriptions();
      }
    }
  }, true);

})();