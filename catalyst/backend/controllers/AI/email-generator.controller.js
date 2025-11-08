const groq = require('../../config/Groq');

const generateEmailTemplate = async (req, res) => {
  try {
    const { type, context } = req.body; // type: 'interview', 'offer', 'rejection', 'notice'
    
    const prompts = {
      interview: `Generate a professional interview invitation email for a college placement drive.
      Context: ${JSON.stringify(context)}
      Include: Date, time, venue, required documents, dress code, contact information.
      Make it professional and clear.`,
      
      offer: `Generate a professional job offer email for a student.
      Context: ${JSON.stringify(context)}
      Include: Position, package/salary, joining date, next steps, contact information.
      Make it congratulatory and professional.`,
      
      rejection: `Generate a polite and encouraging rejection email for a job application.
      Context: ${JSON.stringify(context)}
      Be professional, respectful, and encouraging for future opportunities.`,
      
      notice: `Generate a placement drive notice email for students.
      Context: ${JSON.stringify(context)}
      Include: Drive details, company name, eligibility criteria, registration deadline, registration link.
      Make it informative and engaging.`
    };
    
    const prompt = prompts[type] || prompts.notice;
    
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a professional email writer for college placement office. Write clear, professional, and engaging emails." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1500
    });
    
    const emailContent = completion.choices[0].message.content;
    
    // Extract subject if present
    const subjectMatch = emailContent.match(/Subject:\s*(.+)/i);
    const subject = subjectMatch ? subjectMatch[1] : `catalyst ${type.charAt(0).toUpperCase() + type.slice(1)} Notification`;
    
    // Convert to HTML format
    const html = emailContent
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/Subject:.*/i, '');
    
    res.json({ 
      subject,
      body: emailContent,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><p>${html}</p></div>`
    });
  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ msg: 'Error generating email', error: error.message });
  }
};

module.exports = { generateEmailTemplate };

