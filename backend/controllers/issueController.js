const Issue = require('../models/Issue');

// Get all issues with search, filter, pagination
exports.getIssues = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Execute query with pagination
    const issues = await Issue.find(query)
      .populate('createdBy', 'fullName email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Issue.countDocuments(query);

    res.json({
      success: true,
      issues,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single issue
exports.getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('createdBy', 'fullName email');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      issue
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create issue
exports.createIssue = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const issue = await Issue.create({
      title,
      description,
      priority,
      status,
      createdBy: req.userId
    });

    res.status(201).json({
      success: true,
      issue,
      message: 'Issue created successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update issue
exports.updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      issue,
      message: 'Issue updated successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete issue
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Restrict deletion to the creator of the issue
    if (issue.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this issue'
      });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Issue deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.userId;

    const total = await Issue.countDocuments({});
    const open = await Issue.countDocuments({ status: 'Open' });
    const inProgress = await Issue.countDocuments({ status: 'In Progress' });
    const resolved = await Issue.countDocuments({ status: 'Resolved' });
    const closed = await Issue.countDocuments({ status: 'Closed' });

    res.json({
      success: true,
      stats: {
        total,
        open,
        inProgress,
        resolved,
        closed,
        completionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};