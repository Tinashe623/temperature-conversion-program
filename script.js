// DOM Elements
const textBox = document.getElementById("textBox");
const radioButtons = document.querySelectorAll('input[name="unit"]');
const resultDisplay = document.getElementById("result");
const resultUnitLabel = document.getElementById("resultUnit");
const body = document.body;
const historyList = document.getElementById("historyList");
const historySection = document.getElementById("historySection");

let history = JSON.parse(localStorage.getItem('tempHistory')) || [];

// Initialization
updateHistoryDisplay();

// Event Listeners
textBox.addEventListener("input", performConversion);
radioButtons.forEach(btn => btn.addEventListener("change", performConversion));

function performConversion() {
    const inputVal = textBox.value;
    if (inputVal === "") {
        resultDisplay.textContent = "0.0";
        updateVisuals(0, 'Fahrenheit');
        return;
    }

    const temp = parseFloat(inputVal);
    let result;
    let unitLabel;

    const toFahrenheit = document.getElementById("toFahrenheit").checked;
    const toCelsius = document.getElementById("toCelsius").checked;
    const toKelvin = document.getElementById("toKelvin").checked;

    if (toFahrenheit) {
        result = (temp * 9 / 5) + 32;
        unitLabel = "Fahrenheit";
    } else if (toCelsius) {
        result = (temp - 32) * (5 / 9);
        unitLabel = "Celsius";
    } else if (toKelvin) {
        result = temp + 273.15;
        unitLabel = "Kelvin";
    }

    resultDisplay.textContent = result.toFixed(1);
    resultUnitLabel.textContent = unitLabel;

    updateVisuals(result, unitLabel);
    saveToHistory(temp, result, unitLabel);
}

function updateVisuals(temp, unit) {
    // Normalize to Celsius for color mapping
    let celsius;
    if (unit === "Fahrenheit") {
        celsius = (temp - 32) * (5 / 9);
    } else if (unit === "Kelvin") {
        celsius = temp - 273.15;
    } else {
        celsius = temp;
    }

    let hue;
    if (celsius <= 0) {
        hue = 200; // Cold Blue
    } else if (celsius <= 25) {
        hue = 160; // Mild Teal
    } else if (celsius <= 40) {
        hue = 40;  // Warm Orange
    } else {
        hue = 10;  // Hot Red
    }

    body.style.background = `linear-gradient(135deg, hsl(${hue}, 40%, 10%) 0%, hsl(${hue}, 40%, 20%) 100%)`;
}

function saveToHistory(input, result, unit) {
    const fromUnit = document.getElementById("toFahrenheit").checked ? "°C" : 
                     (document.getElementById("toKelvin").checked ? "°C" : "°F");
    
    // Clear check for Kelvin specifically in UI labeling
    const toUnit = unit === "Fahrenheit" ? "°F" : (unit === "Celsius" ? "°C" : "K");
    
    const entry = {
        text: `${input}${fromUnit} ➡ ${result.toFixed(1)}${toUnit}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Prevent duplicates in history
    if (history.length > 0 && history[0].text === entry.text) return;

    history.unshift(entry);
    if (history.length > 5) history.pop();
    
    localStorage.setItem('tempHistory', JSON.stringify(history));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (history.length === 0) {
        historySection.classList.remove("active");
        return;
    }

    historySection.classList.add("active");
    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <span>${item.text}</span>
            <span style="color: var(--text-muted); opacity: 0.6;">${item.time}</span>
        </div>
    `).join('');
}

function clearHistory() {
    history = [];
    localStorage.removeItem('tempHistory');
    updateHistoryDisplay();
}
