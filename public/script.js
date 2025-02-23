let map;
let marker;

function initMap(lat, lon) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    } else {
        map.setView([lat, lon], 13);
    }

    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([lat, lon]).addTo(map);
}

async function getWeather() {
    const cityInput = document.getElementById('cityInput').value;
    if (!cityInput) return;

    try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(cityInput)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error fetching weather data');
        }

        document.getElementById('weatherInfo').innerHTML = `
            <div class="weather-main">
                <img src="http://openweathermap.org/img/w/${data.weather.weather[0].icon}.png" alt="Weather icon">
                <div class="temperature">${Math.round(data.weather.main.temp)}°C</div>
                <div class="description">${data.weather.weather[0].description}</div>
            </div>
            <div class="weather-details">
                <div class="weather-detail-item">
                    <h3>Feels Like</h3>
                    <p>${Math.round(data.weather.main.feels_like)}°C</p>
                </div>
                <div class="weather-detail-item">
                    <h3>Humidity</h3>
                    <p>${data.weather.main.humidity}%</p>
                </div>
                <div class="weather-detail-item">
                    <h3>Wind Speed</h3>
                    <p>${data.weather.wind.speed} m/s</p>
                </div>
                <div class="weather-detail-item">
                    <h3>Pressure</h3>
                    <p>${data.weather.main.pressure} hPa</p>
                </div>
            </div>
        `;

        const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
        document.getElementById('airQuality').innerHTML = `
            <h2>Air Quality</h2>
            <p>Status: ${aqiLabels[data.airQuality.list[0].main.aqi - 1]}</p>
            <p>PM2.5: ${data.airQuality.list[0].components.pm2_5} μg/m³</p>
            <p>PM10: ${data.airQuality.list[0].components.pm10} μg/m³</p>
        `;

        const sunrise = new Date(data.sunriseSunset.sunrise).toLocaleTimeString();
        const sunset = new Date(data.sunriseSunset.sunset).toLocaleTimeString();
        document.getElementById('sunTimes').innerHTML = `
            <h2>Sun Schedule</h2>
            <p>Sunrise: ${sunrise}</p>
            <p>Sunset: ${sunset}</p>
        `;

        initMap(data.coordinates.lat, data.coordinates.lon);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('weatherInfo').innerHTML = `
            <div class="error">${error.message}</div>
        `;
    }
}

document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});