(function(){

  'use strict';

  function isUserLoggedIn() {
    var loginHeader = document.getElementById('yt-masthead-signin');
    return loginHeader === null;
    console.log("is logged in?");
    console.log(loginHeader);
  }

  isUserLoggedIn();

})();