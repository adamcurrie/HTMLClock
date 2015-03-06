function extractToken(hash)
 {
   console.log(hash);
   var tokenPlus = hash.split('access_token=')[1];
   var token = tokenPlus.split("&")[0];
   return token;
}

function redirect_init () {
   var useCallback = function()
   {
      if (localStorage.callback)
      {
         window[localStorage.callback]();
         //setTimeout(function() {window.close()}, 10000);
         //window.close()
         return;
      }
      else
      {
         alert('callback not specified in local storage');
         return;
      }
   }
   // Check for hash in window.location.hash, then store in local storage
   if (localStorage.token)
   {
      useCallback();
      return;
   }
   // if not in url bar, check in local storage
   var token = extractToken(window.location.hash);
   console.log(token);
   if (token)
   {
      localStorage.token = token;
      useCallback();
      return;
   }
   alert('No token found');
}