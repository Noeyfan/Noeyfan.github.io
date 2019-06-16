var ts1 = new Date("June 15, 2019 09:11:11");
var ts2 = new Date("June 15, 2019 11:33:33");
var ts3 = new Date("June 15, 2019 14:22:22");
var ts4 = new Date("June 15, 2019 15:28:28");
var ts5 = new Date("June 15, 2019 19:05:05");

function ds(cd, ts) {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = cd - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
	if (ts == "ts1") return "Good Morning! Time to get dressed up and put on some Make up! Wait, what is that purple box??!!";
	if (ts == "ts2") return "Navigate to 440 Bellevue Way NE, Bellevue, WA 98004 !";
	if (ts == "ts3") return "How can a Gemini girl only have one gift for her birthday? Well, come with me, here is another one!";
	if (ts == "ts4") return "Movie MIB time!! 4:30@AMC Bellevue";
	if (ts == "ts5") return "The sunset was merely a flush of rose on top of Columbia Tower and star has yet to rise. Close your eyes and make a wish, the best future is waiting for you :)";
    }

    return "* * * " + round(days) + "d " + round(hours) + "h " + round(minutes) + "m " + round(seconds) + "s * * *";
}

function round(x) {
    if (x < 10) return "0" + x;
    else return x;
}

// Update the count down every 1 second
var x = setInterval(function() {
  // Display the result in the element with id="demo"
  document.getElementById("ts1").innerHTML = ds(ts1, "ts1");
  document.getElementById("ts2").innerHTML = ds(ts2, "ts2");
  document.getElementById("ts3").innerHTML = ds(ts3, "ts3");
  document.getElementById("ts4").innerHTML = ds(ts4, "ts4");
  document.getElementById("ts5").innerHTML = ds(ts5, "ts5");
}, 1000);
