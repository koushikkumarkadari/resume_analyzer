const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const resumeRoutes = require('./routes/resumeRoutes');
const { initDatabase } = require('./db/init');

dotenv.config();
const app = express();
initDatabase();

app.use(cors());
app.use(express.json());
app.use('/api/resumes', resumeRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));