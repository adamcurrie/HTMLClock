var userid;
function statusChangeCallback(response) {
  if (response.status === 'connected') {
    alarms();
  } else if (response.status === 'not_authorized') {
    $('fbLoginStatus').html('Please log into this app.');
  } else {
    $('fbLoginStatus').html('Please log into Facebook.');
  }
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '736660249781045',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.1'
  });

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};

$(document).ready(function() {
  $.ajaxSetup({ cache: true });
  $.getScript('http://connect.facebook.net/en_UK/all.js', function(){   
    $('#loginbutton,#feedbutton').removeAttr('disabled');
  });
});

function alarms() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
    getAllAlarms(response.id);
    userid = response.id;
    console.log('Successful login for: ' + response.name);
    $('#fbLoginStatus').html('Thanks for logging in, ' + response.name + '!');
  });
}