const groq = require('../../config/Groq');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No resume file uploaded' });
    }
    
    // Extract text from PDF
    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;
    
    // Use Groq to parse and structure resume data
    const prompt = `Extract and structure the following resume information into JSON format:
    
    Resume Text:
    ${resumeText.substring(0, 3000)} ${resumeText.length > 3000 ? '...' : ''}
    
    Return JSON with this exact structure:
    {
      "personalInfo": {
        "name": "",
        "email": "",
        "phone": "",
        "address": "",
        "linkedin": "",
        "github": ""
      },
      "summary": "",
      "education": [
        {
          "degree": "",
          "institution": "",
          "year": "",
          "gpa": ""
        }
      ],
      "experience": [
        {
          "title": "",
          "company": "",
          "duration": "",
          "description": ""
        }
      ],
      "skills": {
        "technical": [],
        "soft": []
      },
      "projects": [
        {
          "name": "",
          "description": "",
          "technologies": []
        }
      ],
      "certifications": [
        {
          "name": "",
          "issuer": "",
          "date": ""
        }
      ],
      "validation": {
        "isValid": true,
        "errors": [],
        "warnings": [],
        "completeness": 85
      }
    }
    
    Return only valid JSON, no other text.`;
    
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a resume parser. Extract structured data from resumes. Always return valid JSON format only." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });
    
    let parsedData;
    try {
      parsedData = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      parsedData = {
        personalInfo: {},
        summary: "",
        education: [],
        experience: [],
        skills: { technical: [], soft: [] },
        projects: [],
        certifications: [],
        validation: {
          isValid: false,
          errors: ["Failed to parse resume structure"],
          warnings: [],
          completeness: 0
        }
      };
    }
    
    // Clean up uploaded file
    try {
      fs.unlinkSync(req.file.path);
    } catch (unlinkError) {
      console.error('Error deleting file:', unlinkError);
    }
    
    res.json({ 
      parsedData,
      extractedText: resumeText.substring(0, 1000) // Return first 1000 chars
    });
  } catch (error) {
    console.error('Error parsing resume:', error);
    // Clean up file on error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({ msg: 'Error parsing resume', error: error.message });
  }
};

module.exports = { parseResume };

