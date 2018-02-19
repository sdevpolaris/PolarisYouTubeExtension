// feature 1: filter channels
// feature 2: sort by num of new vids
// feature 4: Show subscriptions count besides label

var sidebarSubscriptionsModule = (() => {
  
  "use strict";

  var settings = {};

  const NUM_OF_SECTIONS = 6;
  const SUBSCRIPTION_SECTION_INDEX = 2;
  
  var searchEnabled = false;
  var sortEnabled = false;

  var sortByCount = false; // False - default lexicographical order, True - sort subscriptions by their unwatched videos count

  function enableSubscriptionsFilterListener(input, section) {
    input.on("input", (event) => {

      // Dynamically call to retrieve the list of subscription items to avoid getting an outdated list

      var items = section.find("#items").children();
      var filter = input.val();
      var numOfItems = items.length;
      var count = numOfItems;
      
      for (let i = 0; i < numOfItems; i++) {
        let subscriptionItem = $(items[i]);
        let subscriptionTitle = subscriptionItem.find(".title").html();
        
        if (subscriptionTitle.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
          subscriptionItem.removeClass("hidden");
        } else {
          subscriptionItem.addClass("hidden");
          count--;
        }
      }
      updateSubscriptionsCount(section, count);
    });
  }

  function enableSubscriptionsSearch(section) {

    if (!settings["sidebar_subscriptions_search"] || searchEnabled) {
      return;
    }

    var searchDiv = $("<div/>", {
      id: "sidebar-subscription-filter"
    });

    var searchInput = $("<input/>", {
      id: "sidebar-subscription-filter-input",
      type: "text",
      class: "ytd-searchbox",
      placeholder: "Filter..",
      style: "outline: none;",
      autocomplete: "off"
    });

    // Search box widget

    var ytdSearchBox = $("<ytd-searchbox/>", {
      class: "style-scope ytd-masthead",
      mode: "legacy",
      id: "sidebar-subscription-filter-search"
    });

    // Clean off Search button, and container childNodes

    ytdSearchBox.find("#search-icon-legacy").remove();
    ytdSearchBox.find("#container").empty().append(searchInput);
    ytdSearchBox.find("#search-form").submit((event) => {
      event.preventDefault();
    });
    
    var subscriptionList = section.find("#items");

    searchDiv.append(ytdSearchBox);
    searchDiv.insertBefore(subscriptionList);

    enableSubscriptionsFilterListener(searchInput, section);
    searchEnabled = true;
  }

  function updateSubscriptionsCount(section, count) {

    if (!settings["sidebar_subscriptions_show_count"]) {
      return;
    }

    var subscriptionsHeader = section.find("h3").find("#guide-section-title").find("a");
    subscriptionsHeader[0].innerHTML = "Subscriptions" + " (" + count + ")";
  }

  function getSubscriptionSortFunction() {
    if (sortByCount) {
      sortByCount = !sortByCount;
      return (a, b) => {
        let titleA = $(a).find(".title").html();
        let titleB = $(b).find(".title").html();
        if (titleA < titleB) {
          return -1;
        } else if (titleA > titleB) {
          return 1;
        } else {
          return 0;
        }
      };
    } else {
      sortByCount = !sortByCount;
      return (a, b) => {
        let countA = parseInt($(a).find(".guide-entry-count").html());
        let countB = parseInt($(b).find(".guide-entry-count").html());
        if (countA < countB) {
          return 1;
        } else if (countA > countB) {
          return -1;
        } else {
          return 0;
        }
      };
    }
  }

  function enableSubscriptionsSort(section) {

    if (!settings["sidebar_subscriptions_sort"] || sortEnabled) {
      return;
    }

    var subscriptionsHeader = section.find("h3").find("#guide-section-title").find("a");
    subscriptionsHeader.removeAttr("href").prop("onclick", null).off("click");
    subscriptionsHeader.click((event) => {
      var items = section.find("#items");
      var itemsList = items.find(".ytd-guide-section-renderer");
      var sortResult = itemsList.sort(getSubscriptionSortFunction());
      items.empty();
      sortResult.appendTo(items);
      return false; // prevent default anchor redirect
    });

    sortEnabled = true;
  }

  function init() {

    var sidebarSections = $("#sections")[0];

    // If the sidebar doesn't exist on the current page, exit immediately
    // e.g. Watch page doesn't initialize with the sidebar

    if (!sidebarSections) {
      return;
    }

    settings = JSON.parse(localStorage.getItem("polaris-youtube-settings"));

    if (sidebarSections.childNodes.length === NUM_OF_SECTIONS) {
      var subscriptionSection = $(sidebarSections.childNodes[SUBSCRIPTION_SECTION_INDEX]);
      enableSubscriptionsSearch(subscriptionSection);
      enableSubscriptionsSort(subscriptionSection);
    } else {
      var sidebarSectionsObserver = new MutationObserver((mutations) => {
        if (sidebarSections.childNodes.length === NUM_OF_SECTIONS) {
          var subscriptionSection = $(sidebarSections.childNodes[SUBSCRIPTION_SECTION_INDEX]);
          sidebarSectionsObserver.disconnect();
          enableSubscriptionsSearch(subscriptionSection);
          enableSubscriptionsSort(subscriptionSection);
        }
      });

      sidebarSectionsObserver.observe(sidebarSections, {
        childList: true
      });  
    }
  }

  return {
    init: init
  };

})();

contentScriptModules.push(sidebarSubscriptionsModule);