const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('../features/auth/auth.route');
const planUnauthRoutes = require('../features/plan/plan.unauth.route');

// Mount routes
router.use('/auth', authRoutes);
router.use('/plan', planUnauthRoutes);

module.exports = router;
