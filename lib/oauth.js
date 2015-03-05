var IMGUR_BASE = "https://api.imgur.com/oauth2/authorize";

function oauth_init(obj)
{
   obj = JSON.parse(obj);
   localStorage.client_id = obj.client_id;
   localStorage.type = obj.type;
   localStorage.callback = obj.callback_function;
}

function login()
{
   if (!localStorage.client_id || !localStorage.type)
   {
      alert('Local storage did not have client_id and type');
      return;
   }
   var authUrl = IMGUR_BASE + "?client_id=" + localStorage.client_id + "&response_type=" + localStorage.type;
   console.log(authUrl);
   newwindow=window.open(authUrl,'Imgur Oauth Login','height=500,width=500');
   if (window.focus)
   {
      newwindow.focus();
   }
   console.log('test');
   return false;
}

function imgur_username()
{
   if (localStorage.token)
   {
      var apiURI = "https://api.imgur.com/3/account/me/";
       $.ajax({
         type:"GET",
         beforeSend: function (request)
         {
            request.setRequestHeader("Authorization", "Bearer " + localStorage.token);
            request.setRequestHeader('Accept', "application/json");
         },
         url: apiURI,
         success: function (response) {
            if (response.status == 200)
               alert(response.data.url);
            else
               alert('An error occured using Imgur');
         }
       });
   }
   else
   {
      alert('token no present in local storage');
   }
}