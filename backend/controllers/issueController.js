const Issue = require('../models/Issue');

// Get all issues with filters, search, pagination
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
    const query = { createdBy: req.userId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Execute query
    const issues = await Issue.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Issue.countDocuments(query);

    res.json({
      success: true,
      issues,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
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
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ 
        success: false, 
        message: 'Issue not found' 
      });
    }

    res.json({ success: true, issue });

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
    const issue = await Issue.findByIdAndDelete(req.params.id);

    if (!issue) {
      return res.status(404).json({ 
        success: false, 
        message: 'Issue not found' 
      });
    }

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
    const stats = await Issue.aggregate([
      { $match: { createdBy: req.userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Issue.countDocuments({ createdBy: req.userId });

    res.json({ success: true, stats, total });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};