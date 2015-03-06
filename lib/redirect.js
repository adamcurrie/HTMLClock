function extractToken(hash)
 {
   var tokenPlus = hash.split('access_token=')[1];
   if (tokenPlus)
      return tokenPlus.split("&")[0];
   else
      return '';
}

function redirect_init () {
   var useCallback = function()
   {
      if (localStorage.callback)
      {
         window[localStorage.callback]();
         return;
      }
      else
      {
         alert('callback not specified in local storage');
         return;
      }
   }
   var token = extractToken(window.location.hash);
   if (token)
   {
      localStorage.token = token;
      useCallback();
   }
   // Check for hash in window.location.hash, then store in local storage
   else if (localStorage.token)
   {
      useCallback();
   }
   else
   {
      alert('No token found');
   }  
   
}