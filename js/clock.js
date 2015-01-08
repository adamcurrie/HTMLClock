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