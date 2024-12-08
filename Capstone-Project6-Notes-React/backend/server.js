const express = require('express');
const path = require('path');

const app = express();

// Path to React's build folder
const reactBuildPath = path.join(__dirname, '../frontend/build');

// Serve React app at /api
app.use('/api', express.static(reactBuildPath));

app.get("/", (req, res) => {
  res.redirect("/api");
});

// Fallback to serve index.html for React SPA routes under /api
app.get('/api/*', (req, res) => {
    res.sendFile(path.join(reactBuildPath, 'index.html'));
});

// Example API endpoint
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Node.js server!' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});