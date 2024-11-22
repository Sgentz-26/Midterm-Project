const express = require('express');
const app = express();
const port = 5000;

// Middleware to serve static files
app.use(express.json());

// Example route
app.get('/', (req, res) => {
    res.send('Backend is working!');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
