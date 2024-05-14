var colors = ["#ff9999", "#99ff99", "#9999ff"]; // Array of colors
  var currentIndex = 0;

  function switchBackgroundColor() {
    document.body.style.backgroundColor = colors[currentIndex];
    currentIndex = (currentIndex + 1) % colors.length; // Increment index and loop back to 0 when it reaches the end
  }

  // Call setInterval to repeatedly call switchBackgroundColor every 3 seconds
  setInterval(switchBackgroundColor, 1000); // Adjust the time interval as needed (3000 milliseconds = 3 seconds)