function openEmbededPlayer(info, tab) {
  if (info.linkUrl && /^https:\/\/www\.youtube\.com\/watch.*$/.test(info.linkUrl)) {
    var linkToVideo = new URL(info.linkUrl);
    var videoId = linkToVideo.searchParams.get('v');
    var embededUrl = 'https://www.youtube.com/embed/' + videoId;
    chrome.tabs.create({
      url: embededUrl
    });
  }
}

function contextMenusCreated() {
}

var contextMenusUrls = ["https://www.youtube.com/*"];

chrome.contextMenus.create({
  "id" : "polaris-youtube-embeded",
  "title" : "Open video in embeded view",
  "contexts" : ["link"],
  "documentUrlPatterns" : contextMenusUrls,
  onclick : openEmbededPlayer
}, contextMenusCreated);