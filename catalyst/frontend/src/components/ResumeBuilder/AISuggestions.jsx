import { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function AISuggestions({ suggestions, matchScore, onGetSuggestions, resumeData, jobId }) {
  const [loading, setLoading] = useState(false);
  const [skillSuggestions, setSkillSuggestions] = useState(null);
  const [resumeScore, setResumeScore] = useState(null);

  const handleGetSuggestions = async () => {
    setLoading(true);
    try {
      await onGetSuggestions();
    } finally {
      setLoading(false);
    }
  };

  const getSkillSuggestions = async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const jobResponse = await axios.get(`${BASE_URL}/tpo/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const response = await axios.post(
        `${BASE_URL}/resume/ai-skill-suggestions`,
        {
          jobTitle: jobResponse.data.jobTitle,
          jobDescription: jobResponse.data.jobDescription
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSkillSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error getting skill suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResumeScore = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/resume/ai-score`,
        { resumeData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setResumeScore(response.data.score);
    } catch (error) {
      console.error('Error getting resume score:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="ai-suggestions-container p-4 rounded-lg shadow-lg backdrop-blur-xl border-2"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)'
      }}
    >
      <h2 
        className="text-2xl font-bold mb-4"
        style={{ color: 'var(--color-text)' }}
      >
        AI Suggestions
      </h2>

      {/* Match Score Section */}
      <div 
        className="mb-6 p-4 rounded-lg border-2"
        style={{
          background: 'rgba(var(--color-primary-rgb, 102, 126, 234), 0.1)',
          borderColor: 'rgba(var(--color-primary-rgb, 102, 126, 234), 0.3)'
        }}
      >
        {matchScore !== null ? (
          <div className="text-center">
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              Job Match Score
            </h3>
            <div 
              className="text-5xl font-bold mb-2"
              style={{ color: 'var(--color-primary)' }}
            >
              {matchScore}%
            </div>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {matchScore >= 80 ? 'Excellent Match!' : 
               matchScore >= 60 ? 'Good Match' : 
               matchScore >= 40 ? 'Moderate Match' : 
               'Needs Improvement'}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p 
              className="mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Get AI-powered suggestions for your resume
            </p>
            <Button
              onClick={handleGetSuggestions}
              disabled={loading || !jobId}
              variant="primary"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                border: 'none'
              }}
            >
              {loading ? 'Analyzing...' : 'Get AI Suggestions'}
            </Button>
            {!jobId && (
              <p 
                className="text-sm mt-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Select a job to get personalized suggestions
              </p>
            )}
          </div>
        )}
      </div>

      {/* Suggestions Content */}
      {suggestions && (
        <div className="space-y-6">
          {/* Matched Skills */}
          {suggestions.matchedSkills && suggestions.matchedSkills.length > 0 && (
            <div 
              className="p-4 rounded-lg border-2"
              style={{
                background: 'rgba(var(--color-success-rgb, 16, 185, 129), 0.1)',
                borderColor: 'rgba(var(--color-success-rgb, 16, 185, 129), 0.3)'
              }}
            >
              <h4 
                className="font-semibold mb-2"
                style={{ color: 'var(--color-success)' }}
              >
                <i className="fa-solid fa-check-circle mr-2"></i>
                Matched Skills
              </h4>
              <ul className="list-disc list-inside">
                {suggestions.matchedSkills.map((skill, idx) => (
                  <li 
                    key={idx}
                    style={{ color: 'var(--color-text)' }}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Skills */}
          {suggestions.missingSkills && suggestions.missingSkills.length > 0 && (
            <div 
              className="p-4 rounded-lg border-2"
              style={{
                background: 'rgba(var(--color-warning-rgb, 245, 158, 11), 0.1)',
                borderColor: 'rgba(var(--color-warning-rgb, 245, 158, 11), 0.3)'
              }}
            >
              <h4 
                className="font-semibold mb-2"
                style={{ color: 'var(--color-warning)' }}
              >
                <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                Missing Skills
              </h4>
              <ul className="list-disc list-inside">
                {suggestions.missingSkills.map((skill, idx) => (
                  <li 
                    key={idx}
                    style={{ color: 'var(--color-text)' }}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Skills */}
          <div 
            className="p-4 rounded-lg border-2"
            style={{
              background: 'rgba(var(--color-info-rgb, 6, 182, 212), 0.1)',
              borderColor: 'rgba(var(--color-info-rgb, 6, 182, 212), 0.3)'
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 
                className="font-semibold"
                style={{ color: 'var(--color-info)' }}
              >
                <i className="fa-solid fa-lightbulb mr-2"></i>
                Skill Suggestions
              </h4>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={getSkillSuggestions}
                disabled={loading || !jobId}
                style={{
                  borderColor: 'var(--color-info)',
                  color: 'var(--color-info)'
                }}
              >
                Get Suggestions
              </Button>
            </div>
            {skillSuggestions && (
              <div className="mt-3">
                {skillSuggestions.technicalSkills && skillSuggestions.technicalSkills.length > 0 && (
                  <div className="mb-3">
                    <strong style={{ color: 'var(--color-text)' }}>Technical Skills:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {skillSuggestions.technicalSkills.map((skill, idx) => (
                        <li 
                          key={idx}
                          style={{ color: 'var(--color-text)' }}
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {skillSuggestions.softSkills && skillSuggestions.softSkills.length > 0 && (
                  <div className="mb-3">
                    <strong style={{ color: 'var(--color-text)' }}>Soft Skills:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {skillSuggestions.softSkills.map((skill, idx) => (
                        <li 
                          key={idx}
                          style={{ color: 'var(--color-text)' }}
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Improvements */}
          {suggestions.improvements && suggestions.improvements.length > 0 && (
            <div 
              className="p-4 rounded-lg border-2"
              style={{
                background: 'rgba(var(--color-primary-rgb, 102, 126, 234), 0.1)',
                borderColor: 'rgba(var(--color-primary-rgb, 102, 126, 234), 0.3)'
              }}
            >
              <h4 
                className="font-semibold mb-2"
                style={{ color: 'var(--color-primary)' }}
              >
                <i className="fa-solid fa-arrow-up mr-2"></i>
                Suggested Improvements
              </h4>
              <ul className="list-disc list-inside">
                {suggestions.improvements.map((improvement, idx) => (
                  <li 
                    key={idx}
                    style={{ color: 'var(--color-text)' }}
                  >
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ATS Optimization */}
          {suggestions.atsOptimization && suggestions.atsOptimization.length > 0 && (
            <div 
              className="p-4 rounded-lg border-2"
              style={{
                background: 'rgba(var(--color-secondary-rgb, 118, 75, 162), 0.1)',
                borderColor: 'rgba(var(--color-secondary-rgb, 118, 75, 162), 0.3)'
              }}
            >
              <h4 
                className="font-semibold mb-2"
                style={{ color: 'var(--color-secondary)' }}
              >
                <i className="fa-solid fa-robot mr-2"></i>
                ATS Optimization Tips
              </h4>
              <ul className="list-disc list-inside">
                {suggestions.atsOptimization.map((tip, idx) => (
                  <li 
                    key={idx}
                    style={{ color: 'var(--color-text)' }}
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Resume Score */}
      <div 
        className="mt-6 p-4 rounded-lg border-2"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <h4 
            className="font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            Resume Quality Score
          </h4>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={getResumeScore}
            disabled={loading}
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)'
            }}
          >
            Get Score
          </Button>
        </div>
        {resumeScore && (
          <div className="mt-3">
            <div 
              className="text-3xl font-bold text-center mb-2"
              style={{ color: 'var(--color-primary)' }}
            >
              {resumeScore.overallScore}/100
            </div>
            {resumeScore.breakdown && (
              <div 
                className="grid grid-cols-2 gap-2 text-sm"
                style={{ color: 'var(--color-text)' }}
              >
                <div>Content: {resumeScore.breakdown.contentCompleteness}/20</div>
                <div>Keywords: {resumeScore.breakdown.keywordOptimization}/20</div>
                <div>Formatting: {resumeScore.breakdown.formatting}/20</div>
                <div>Achievements: {resumeScore.breakdown.achievements}/20</div>
                <div className="col-span-2">ATS: {resumeScore.breakdown.atsCompatibility}/20</div>
              </div>
            )}
            {resumeScore.feedback && resumeScore.feedback.length > 0 && (
              <div className="mt-3">
                <strong style={{ color: 'var(--color-text)' }}>Feedback:</strong>
                <ul className="list-disc list-inside ml-4">
                  {resumeScore.feedback.map((item, idx) => (
                    <li 
                      key={idx}
                      style={{ color: 'var(--color-text)' }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AISuggestions;

