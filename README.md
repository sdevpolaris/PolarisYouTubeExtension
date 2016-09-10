Polaris: YouTube Extension
=============

A Google Chrome browser extension that features additional UI/video player enhancements when viewing/browsing YouTube videos on www.youtube.com

### How to install (Developer version)
- Clone this repository to local
- In Chrome, open the Options menu and navigate to More Tools -> Extensions
- Check Developer Mode on the top of the page
- Click Load unpacked extension... and point to the folder containing the repository
- Check Enabled to enable the extension

##Features

####Like/Dislike Percentages

Enabling this feature will show the percentages of likes and dislikes, providing a more accurate visual comparison

<img width='180' src="https://github.com/sdevpolaris/PolarisYouTubeExtension/blob/master/docs/assets/likes-percentage-before.png"></img>
<img width='180' src="https://github.com/sdevpolaris/PolarisYouTubeExtension/blob/master/docs/assets/likes-percentage-after.png"></img>


####Remove Recommended Videos

Currently the recommended videos feature on YouTube is not great when it comes to recommending actual relevant videos, and often it bloats the related videos list. This feature will hide these recommended videos in the list

<img width='320' src="https://github.com/sdevpolaris/PolarisYouTubeExtension/blob/master/docs/assets/recommend-remove-before.png"></img>
<img width='320' src="https://github.com/sdevpolaris/PolarisYouTubeExtension/blob/master/docs/assets/recommend-remove-after.png"></img>

#### Subscription Filter

This feature will insert a new section in the left sidebar on YouTube to allow a user to enter filter words and find channels quicker by filtering the subscribed channels list

The effect of filtering will also persist when the user chooses a different sort order

<img height='350' src="https://github.com/sdevpolaris/PolarisYouTubeExtension/blob/master/docs/assets/subscription-filter-1.png"></img>
<img height='350' src="https://github.com/sdevpolaris/PolarisYouTubeExtension/blob/master/docs/assets/subscription-filter-2.png"></img>

#### Custom Searches

A new section will be inserted on the left sidebar to allow users to search videos either globally or in the current channel only. These search functions use asynchronous calls and will not redirect to a different page so the user can search while the current video is playing

At any time the user can click the switch toggle button to switch between the old related videos list and the search results

<img width='320' src="https://github.com/sdevpolaris/PolarisYouTubeExtension/blob/master/docs/assets/custom-search-1.png"></img>

<img height='320' src="https://github.com/sdevpolaris/PolarisYouTubeExtension/blob/master/docs/assets/custom-search-2.png"></img>
