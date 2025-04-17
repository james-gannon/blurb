const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock API endpoints
app.post('/api/get-inbox-data', (req, res) => {
  // Mock response
  res.json({
    calls: [
      {
        caller_name: 'Test Caller',
        summary: 'This is a test call summary for local development',
        audio_url: '#',
        status: 'Unreviewed'
      }
    ]
  });
});

app.post('/api/register-push', (req, res) => {
  console.log('Push subscription received:', req.body);
  res.status(201).json({ message: 'Subscription saved' });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});