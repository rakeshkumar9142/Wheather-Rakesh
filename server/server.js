const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const apiRoutes = require('./api');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is undefined
if (!process.env.PORT) {
    console.warn('Warning: PORT is not defined in the environment variables. Defaulting to 3000.');
}
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
