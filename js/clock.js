function padZero(time)
{
   return time < 10 ? "0" + time : time;
}
function getTime()
{
   var today = new Date();
   var time = [];

   time.push(today.getHours());
   time.push(":");
   time.push(padZero(today.getMinutes()));
   time.push(":");
   time.push(padZero(today.getSeconds()));

   document.getElementById('clockText').innerHTML = time.join("");
   setTimeout(function(){getTime()}, 1000);
 }

 function getLocation()
 {
   if (navigator.geolocation)
   {
      navigator.geolocation.getCurrentPosition(function (position) {
         getTemp(position.coords.latitude, position.coords.longitude);
         $("#locationInfo").html("Your curent location is: " +
          position.coords.latitude + "," + position.coords.longitude);
         $("#location").text("Update Current Location");
      });
   }
   else
   {
      console.log("Geolocation is not supported by this browser.");
   }
 }

 function getClassForTemp(temp)
 {
   if (temp < 60)
   {
      return "cold";
   }
   else if (temp < 70)
   {
      return "chilly";
   }
   else if (temp < 80)
   {
      return "nice";
   }
   else if (temp < 90)
   {
      return "warm";
   }
   else
   {
      return "hot";
   }
 }


 function getTempLocation(latitude, longitude)
 {
   var forecastLink = "https://api.forecast.io/forecast/";
   var apiKey = "d3d7fdcf3c1dfd8d2b377bfe5e07e45e";
   var position = latitude + "," + longitude;
   var callbackParam = "?callback=?";
   var url = forecastLink + apiKey + "/" + position + callbackParam;

   $.getJSON(url, function(data) {
      $("#forecastLabel").html(data.daily.data[0].summary);
      $("#forecastIcon").html("<img src=\"img/" + data.daily.data[0].icon + ".png\">");
      $("body").addClass(getClassForTemp(data.daily.data[0].temperatureMax));
      console.log(data);
   });
 }

  function getTemp()
 {
   var defaultLatitude = "35.300399";
   var defaultLongitude = "-120.662362";
   getTempLocation(defaultLatitude, defaultLongitude);
 }