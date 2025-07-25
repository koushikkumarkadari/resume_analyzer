const { db } = require('../db/init');
const { analyzeResume } = require('../services/analysisService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const uploadResume = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.error('No token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('Analyzing resume...');
    const analysis = await analyzeResume(req.file.buffer);
    const {
      name, email, phone, linkedin_url, portfolio_url, summary, work_experience,
      education, technical_skills, soft_skills, projects, certifications,
      resume_rating, improvement_areas, upskill_suggestions
    } = analysis;

    db.run(
      `INSERT INTO resumes (
        user_id, file_name, name, email, phone, linkedin_url, portfolio_url, summary,
        work_experience, education, technical_skills, soft_skills, projects,
        certifications, resume_rating, improvement_areas, upskill_suggestions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        decoded.id, req.file.originalname, name, email, phone, linkedin_url, portfolio_url, summary,
        JSON.stringify(work_experience), JSON.stringify(education),
        JSON.stringify(technical_skills), JSON.stringify(soft_skills),
        JSON.stringify(projects), JSON.stringify(certifications),
        resume_rating, improvement_areas, JSON.stringify(upskill_suggestions)
      ],
      function (err) {
        if (err) return res.status(500).json({ message: 'Database error', error: err.message });
        res.json({ id: this.lastID, ...analysis });
      }
    );
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

const getAllResumes = (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    db.all(`SELECT * FROM resumes WHERE user_id = ?`, [decoded.id], (err, rows) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err.message });
      res.json(rows.map(row => ({
        ...row,
        work_experience: JSON.parse(row.work_experience),
        education: JSON.parse(row.education),
        technical_skills: JSON.parse(row.technical_skills),
        soft_skills: JSON.parse(row.soft_skills),
        projects: JSON.parse(row.projects),
        certifications: JSON.parse(row.certifications),
        upskill_suggestions: JSON.parse(row.upskill_suggestions)
      })));
    });
  } catch (error) {
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

const getResumeById = (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    db.get('SELECT * FROM resumes WHERE id = ? AND user_id = ?', [req.params.id, decoded.id], (err, row) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err.message });
      if (!row) return res.status(404).json({ message: 'Resume not found' });
      res.json({
        ...row,
        work_experience: JSON.parse(row.work_experience),
        education: JSON.parse(row.education),
        technical_skills: JSON.parse(row.technical_skills),
        soft_skills: JSON.parse(row.soft_skills),
        projects: JSON.parse(row.projects),
        certifications: JSON.parse(row.certifications),
        upskill_suggestions: JSON.parse(row.upskill_suggestions)
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    // Check if user already exists
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
      if (user) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], function (err) {
        if (err) return res.status(500).json({ message: 'Database error', error: err.message });
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
      if (err || !user) return res.status(400).json({ message: 'Invalid credentials' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = { uploadResume, getAllResumes, getResumeById, registerUser, loginUser };