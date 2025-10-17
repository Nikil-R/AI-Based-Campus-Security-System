// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// ----- Database -----
const db = require('./db/db'); // MySQL connection pool

// ----- Controllers / Routes -----
const authRoutes = require('./routes/authRoutes');      // login/register
const userRoutes = require('./routes/users');           // user management
const visitorRoutes = require('./routes/visitors');     // visitor management
const logRoutes = require('./routes/logs');             // logs
const incidentsRoutes = require('./routes/incidents');  // incidents/reports
const registerRoutes = require('./routes/register');    // optional registration routes

const app = express();

// ----- Middleware -----
app.use(cors());
app.use(express.json());

// Serve QR codes statically
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));

// ----- API Routes -----
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/register', registerRoutes);

// ----- Health Check -----
app.get('/', (req, res) => res.send('🟢 Campus Security Backend Running'));

// ----- Catch-all 404 -----
app.use((req, res, next) => {
  res.status(404).json({ error: '❌ API endpoint not found' });
});

// ----- Global Error Handler -----
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ----- Start Server -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
