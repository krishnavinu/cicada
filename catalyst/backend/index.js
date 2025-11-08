const express = require('express');
const cors = require('cors');
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

// public folder for users profile
app.use('/profileImgs', express.static(path.join(__dirname, 'public/profileImgs')));
app.use('/resume', express.static(path.join(__dirname, 'public/resumes')));
app.use('/offerLetter', express.static(path.join(__dirname, 'public/offerLetter')));

// database import 
const mongodb = require('./config/MongoDB');
mongodb();


// routes for user
app.use('/user', require('./routes/user.route'));
// routes for student user
app.use('/student', require('./routes/student.route'));
// routes for tpo user
app.use('/tpo', require('./routes/tpo.route'));
// routes for management user
app.use('/management', require('./routes/management.route'));
// routes for HOD user
app.use('/hod', require('./routes/hod.route'));
// routes for admin user
app.use('/admin', require('./routes/superuser.route'));

// route for company
app.use('/company', require('./routes/company.route'));

// Public routes (no authentication)
app.use('/public', require('./routes/public.route'));

// New feature routes
app.use('/ai', require('./routes/ai.route'));
app.use('/reports', require('./routes/reports.route'));
app.use('/analytics', require('./routes/analytics.route'));
app.use('/placement-drive', require('./routes/placementDrive.route'));
app.use('/resume', require('./routes/resume.route'));
app.use('/ats', require('./routes/ats.route'));

// test route
app.use('/test', (req, res)=>{
  res.status(200).send("Working Fine!");
});


app.listen(process.env.PORT, () => {
  console.log(`server is running in http://localhost:${process.env.PORT}`);
});
