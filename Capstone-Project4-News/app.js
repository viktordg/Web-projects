const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(express.static('public')); // Serve static files from 'public' directory

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/news', async (req, res) => {
    try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines?country=bg&category=business&apiKey=d94e2fa4d1c74038936d73cb2a224476');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news' });
    }
});

