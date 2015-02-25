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
      $("#forecastLabel").html(data.daily.summary);
      $("#forecastIcon").html("<img src=\"img/" + data.daily.icon + ".png\">");
      $("body").addClass(getClassForTemp(data.daily.data[0].temperatureMax));
   });
}

function getTemp()
{
   var defaultLatitude = "35.300399";
   var defaultLongitude = "-120.662362";
   getTempLocation(defaultLatitude, defaultLongitude);
}

function showAlarmPopup()
{
   $("#mask").removeClass("hide");
   $("#popup").removeClass("hide");
}

function hideAlarmPopup()
{
   $("#mask").addClass("hide");
   $("#popup").addClass("hide");
}

function insertAlarm(hours, mins, ampm, alarmName, id)
{
   var time = hours + ":" + mins + ampm;
   var blankDiv = $("<div>").addClass("flexable").attr('id', id + "Delete");
   var deleteDiv = $("<div>").addClass("delete")
      .html("<a id='"+ id + "' href='#'>Delete</a>")
   var deleteStr = "$('#" + id + "').click(function() {deleteAlarm('" + id + "');});";
   deleteDiv.append("<script>" + deleteStr + "</script>");

   blankDiv.append($("<div>").addClass("name").html(alarmName))
   .append($("<div>").addClass("time").html(time))
   .append(deleteDiv);
   $("#alarms").append(blankDiv);
}

function converToDate(hours, mins, ampm)
{
   var now = new Date();
   var tomorrow = new Date();
   tomorrow.setDate(now.getDate()+1);
   var year = now.getFullYear();
   var month = now.getMonth();
   var day = now.getDate();
   if (ampm == 'pm') {
      hours = parseInt(hours);
      hours += 12;
      hours = hours.toString();
   }
   var alarm = new Date(year, month, day, hours, mins, 0, 0);
   return alarm;
}

function convertTimeToParams(time)
{
   var data = new Object();
   data.hours = time.getHours();
   data.mins = padZero(time.getMinutes());
   data.ampm = (time.getHours() >= 12) ? "pm" : "am";
   data.hours = ((data.hours + 11) % 12) + 1;
   return data;
}

function addAlarm()
{
   var hours = $("#hours option:selected").text();
   var mins = $("#mins option:selected").text();
   var ampm = $("#ampm option:selected").text();
   var alarmName = $("#alarmName").val();
   var time = converToDate(hours, mins, ampm);
   
   var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();
      alarmObject.save({"time": time,"alarmName": alarmName, "userid": userid}, {
      success: function(object) {
        if($('#alarms').html() == 'No Alarms Set') 
        {
          $('#alarms').empty();
        }
        insertAlarm(hours, mins, ampm, alarmName, object.id);
        hideAlarmPopup();
      }
    });
}

function deleteAlarm (id) {
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   query.get(id, {
     success: function(myObj) {
       myObj.destroy({});
       ga('send', 'event', 'Alarm', 'Delete');
       $("#" + id + "Delete").remove();
       if($('#alarms').is(':empty')) 
       {
          $('#alarms').html("No Alarms Set");
       }
     },
     error: function(object, error) {

     }
   });
}

function setAlarm(callback, date){
    var time = date.getTime() - (new Date()).getTime();
    return setTimeout(callback, time);
}

function getAllAlarms(userid)
{
   Parse.initialize("VYSgrRNB98UccaOsphztx7SEHEEBOdabwcN9m7Mr", "0sz13Q3sPnk7gYyuoJdFTk00YMyFTf9ehS9CAU5q");
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   query = query.contains('userid', userid);
   query.find({
      success: function(results) {
         for (var i = 0; i < results.length; i++) 
         {
            var data = convertTimeToParams(results[i].attributes.time);
            insertAlarm(data.hours, data.mins, data.ampm, results[i].attributes.alarmName, results[i].id);
         }
         if (results.length == 0)
         {
            $('#alarms').html("No Alarms Set");
         }
      }
   });
}