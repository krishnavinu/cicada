const User = require("../../models/user.model");
const Resume = require("../../models/resume.model");
const bcrypt = require('bcrypt');


const Signup = async (req, res) => {
  const { first_name, email, number, password } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ msg: "User Already Exists!" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name: first_name,
      email: email,
      number: number,
      password: hashPassword,
      role: "student",
      studentProfile: {
        isApproved: false
      }
    });
    await newUser.save();

    // Auto-create resume with pre-filled data
    try {
      const newResume = new Resume({
        userId: newUser._id,
        templateId: 'template-1',
        sections: {
          personalInfo: {
            fullName: first_name || '',
            email: email || '',
            phone: number || ''
          },
          summary: '',
          education: [],
          experience: [],
          skills: [],
          projects: [],
          certifications: [],
          achievements: [],
          languages: []
        },
        styling: {
          fontFamily: 'Arial',
          fontSize: '12px',
          colorScheme: 'blue',
          layout: 'single-column'
        }
      });
      await newResume.save();
    } catch (resumeError) {
      console.log("Error creating auto-resume:", resumeError);
      // Don't fail signup if resume creation fails
    }

    return res.json({ msg: "User Created!" });
  } catch (error) {
    console.log("student.signup.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

module.exports = Signup;