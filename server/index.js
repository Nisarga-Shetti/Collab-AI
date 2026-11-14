const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

const projectsRoute = require('./routes/projects');

app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to CollabAI Backend!'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CollabAI API is working!'
  });
});

// Projects API - support both URLs
app.use('/api/projects', projectsRoute);
app.use('/api/project', projectsRoute);

// Start server
app.listen(PORT, () => {
  console.log(`CollabAI server running at http://127.0.0.1:${PORT}`);
});