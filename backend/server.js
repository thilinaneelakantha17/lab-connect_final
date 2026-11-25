/**
 * Lab Connect — Sri Lanka School Laboratory Resource Sharing System
 * Express.js REST API Server
 * Ministry of Education Sri Lanka Initiative
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const apiRoutes = require('./routes/api');
const { checkDatabaseConnection } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Health Check
app.get('/api/health', (req, res) => {
  checkDatabaseConnection()
    .then(() => {
      res.json({
        status: 'OK',
        database: 'MySQL',
        service: 'Lab Connect Sri Lanka API',
        ministry: 'Ministry of Education — Science & Technology Branch',
        timestamp: new Date().toISOString(),
      });
    })
    .catch((error) => {
      console.error('[LabConnect Database Error]:', error.message);
      res.status(503).json({ status: 'ERROR', database: 'MySQL unavailable' });
    });
});

// Mount API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[LabConnect Error]:', err.stack);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Lab Connect Express API running on http://localhost:${PORT}`);
});
