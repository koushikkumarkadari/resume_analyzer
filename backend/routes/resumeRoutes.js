const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume, getAllResumes, getResumeById, registerUser, loginUser } = require('../controllers/resumeController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getAllResumes);
router.get('/:id', getResumeById); 
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;