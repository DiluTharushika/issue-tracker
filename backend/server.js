const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Issue Tracker API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);


const issueRoutes = require('./routes/issueRoutes');

app.use('/api/issues', issueRoutes);