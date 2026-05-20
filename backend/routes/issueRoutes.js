const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  getStats
} = require('../controllers/issueController');

// All routes are protected
router.use(authMiddleware);

router.get('/stats', getStats);
router.get('/', getIssues);
router.get('/:id', getIssue);
router.post('/', createIssue);
router.put('/:id', updateIssue);
router.delete('/:id', deleteIssue);

module.exports = router;