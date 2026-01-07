const express = require('express');
const router = express.Router();
const requireAuth = require('../utils/requireAuth');
const checkCourseAccess = require('../utils/checkCourseAccess');
const { sendMessage, getCourseMessages } = require('../controllers/discussionController');

/**
 * Discussion Routes
 * Base: /api/discussion
 * 
 * All routes require:
 * 1. Authentication (requireAuth)
 * 2. Course access (checkCourseAccess) - user must be instructor OR enrolled
 */

// Get all messages for a course
// GET /api/discussion/:courseId
router.get('/:courseId', requireAuth, checkCourseAccess, getCourseMessages);

// Send a new message
// POST /api/discussion/:courseId
router.post('/:courseId', requireAuth, checkCourseAccess, sendMessage);

module.exports = router;
