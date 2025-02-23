const express = require('express');
const axios = require('axios');
const router = express.Router();

const WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather';
const AIR_QUALITY_API = 'http://api.openweathermap.org/data/2.5/air_pollution';
const GEO_API = 'http://api.openweathermap.org/geo/1.0/direct';

router.get('/weather', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ error: 'City parameter is required' });
        }

        const geoResponse = await axios.get(`${GEO_API}?q=${city}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`);
        
        if (!geoResponse.data.length) {
            return res.status(404).json({ error: 'City not found' });
        }

        const { lat, lon } = geoResponse.data[0];

        const weatherResponse = await axios.get(`${WEATHER_API}?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);

        const airQualityResponse = await axios.get(`${AIR_QUALITY_API}?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`);

        const sunriseSunsetResponse = await axios.get(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`);

        const combinedData = {
            weather: weatherResponse.data,
            airQuality: airQualityResponse.data,
            sunriseSunset: sunriseSunsetResponse.data.results,
            coordinates: { lat, lon }
        };

        res.json(combinedData);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

module.exports = router;
