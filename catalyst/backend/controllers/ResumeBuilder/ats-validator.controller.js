const groq = require('../../config/Groq');

// ATS-friendly formatting validation
const validateATSFormat = async (req, res) => {
  try {
    const { resumeData } = req.body;
    
    const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility.

RESUME DATA:
${JSON.stringify(resumeData?.sections || {}, null, 2)}

Evaluate ATS compatibility based on:
1. Standard section headings (Summary, Experience, Education, Skills)
2. Keyword optimization
3. Formatting (no images, tables, or complex layouts)
4. File format compatibility
5. Contact information clarity
6. Date formats
7. Bullet points usage
8. Font and styling simplicity

Return JSON:
{
  "atsCompatible": true,
  "score": 85,
  "issues": [
    "Missing standard section headings",
    "Complex formatting detected"
  ],
  "recommendations": [
    "Use standard section names like 'Experience' instead of 'Work History'",
    "Remove images and graphics",
    "Use simple bullet points"
  ],
  "keywordOptimization": {
    "score": 80,
    "missingKeywords": ["JavaScript", "React"],
    "suggestedKeywords": ["Add more technical keywords from job description"]
  },
  "formattingScore": 90,
  "structureScore": 85
}

Return only valid JSON.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an ATS compatibility expert. Analyze resumes for ATS-friendly formatting. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });
    
    const validation = JSON.parse(completion.choices[0].message.content);
    
    res.json({ validation });
  } catch (error) {
    console.error('Error validating ATS format:', error);
    res.status(500).json({ 
      msg: 'Error validating ATS format', 
      error: error.message 
    });
  }
};

// Extract and match keywords
const extractKeywords = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    
    const prompt = `Extract keywords from the resume and job description, then match them.

RESUME DATA:
${JSON.stringify(resumeData?.sections || {}, null, 2)}

JOB DESCRIPTION:
${jobDescription?.substring(0, 2000) || 'N/A'}

Return JSON:
{
  "resumeKeywords": ["JavaScript", "React", "Node.js"],
  "jobKeywords": ["JavaScript", "React", "TypeScript", "Docker"],
  "matchedKeywords": ["JavaScript", "React"],
  "missingKeywords": ["TypeScript", "Docker"],
  "matchPercentage": 50,
  "recommendations": [
    "Add TypeScript to skills",
    "Mention Docker experience if applicable"
  ]
}

Return only valid JSON.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a keyword extraction and matching expert. Extract and match keywords between resume and job description. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });
    
    const keywords = JSON.parse(completion.choices[0].message.content);
    
    res.json({ keywords });
  } catch (error) {
    console.error('Error extracting keywords:', error);
    res.status(500).json({ 
      msg: 'Error extracting keywords', 
      error: error.message 
    });
  }
};

module.exports = {
  validateATSFormat,
  extractKeywords
};

