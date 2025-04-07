// TEMPERATURE CONVERSION PROGRAM
const textBox = document.getElementById("textBox");
const toFahrenheit = document.getElementById("toFahrenheit");
const toCelsius = document.getElementById("toCelsius");
const result = document.getElementById("result");
let temp;

//convert function
function convert() {
  if (toFahrenheit.checked) {
    temp = Number(textBox.value); // changing string data type to number
    temp = (temp * 9) / 5 + 32; // foumlar from celsious to fahrenheit
    result.textContent = temp.toFixed(1) + "°F"; // toFixed(1) will return 1 digit after the comma
  } else if (toCelsius.checked) {
    temp = Number(textBox.value);
    temp = (temp - 32) * (5 / 9);
    result.textContent = temp.toFixed(1) + "°C";
  } else {
    result.textContent = "Select a unit";
  }
}

// to add fahrenheit symbol on windows Alt + 0176
// to add fahrenheit symbol on mac option + shift + 8
