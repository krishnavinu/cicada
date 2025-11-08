import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

function ResumePreview({ resumeData, template }) {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Resume'
  });

  const sections = resumeData?.sections || {};
  const styling = resumeData?.styling || {};
  
  const getColorScheme = () => {
    // Check template first, then fallback to styling
    if (template === 'template-2') {
      return { primary: '#000000', secondary: '#333333' };
    }
    if (template === 'template-3') {
      return { primary: '#7c3aed', secondary: '#5b21b6' };
    }
    // Default or template-1
    return { primary: '#2563eb', secondary: '#1e40af' };
  };

  const colors = getColorScheme();

  return (
    <div 
      className="resume-preview"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)'
      }}
    >
      <div className="mb-4 flex justify-end">
        <button
          onClick={handlePrint}
          className="px-4 py-2 text-white rounded transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(var(--color-primary-rgb), 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <i className="fa-solid fa-print mr-2"></i> Print
        </button>
      </div>
      
      <div
        ref={printRef}
        className="bg-white p-8 shadow-lg"
        style={{
          fontFamily: styling.fontFamily || 'Arial',
          fontSize: styling.fontSize || '12px',
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        {/* Header */}
        <div
          className="border-b-2 pb-4 mb-6"
          style={{ borderColor: colors.primary }}
        >
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            {sections.personalInfo?.fullName || 'Your Name'}
          </h1>
          <div className="text-gray-600">
            {sections.personalInfo?.email && (
              <span>{sections.personalInfo.email} | </span>
            )}
            {sections.personalInfo?.phone && (
              <span>{sections.personalInfo.phone}</span>
            )}
          </div>
          {sections.personalInfo?.address && (
            <p className="text-gray-600">{sections.personalInfo.address}</p>
          )}
          <div className="flex gap-4 mt-2">
            {sections.personalInfo?.linkedin && (
              <a href={sections.personalInfo.linkedin} className="text-blue-600">
                LinkedIn
              </a>
            )}
            {sections.personalInfo?.github && (
              <a href={sections.personalInfo.github} className="text-gray-800">
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {sections.summary && (
          <div className="mb-6">
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: colors.primary }}
            >
              Professional Summary
            </h2>
            <p className="text-gray-700">{sections.summary}</p>
          </div>
        )}

        {/* Education */}
        {sections.education && sections.education.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: colors.primary }}
            >
              Education
            </h2>
            {sections.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold">
                    {edu.degree || 'Degree'} - {edu.institution || 'Institution'}
                  </h3>
                  <span className="text-gray-600">{edu.year || ''}</span>
                </div>
                {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {sections.experience && sections.experience.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: colors.primary }}
            >
              Experience
            </h2>
            {sections.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <h3 className="font-semibold">{exp.title || 'Job Title'}</h3>
                  <span className="text-gray-600">{exp.duration || ''}</span>
                </div>
                <p className="text-gray-600 mb-1">{exp.company || 'Company'}</p>
                {exp.description && (
                  <p className="text-gray-700">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {sections.skills && sections.skills.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: colors.primary }}
            >
              Skills
            </h2>
            {sections.skills.map((skill, index) => (
              <div key={index} className="mb-2">
                <strong>{skill.category || 'Category'}:</strong>{' '}
                <span>{skill.items?.join(', ') || ''}</span>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {sections.projects && sections.projects.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: colors.primary }}
            >
              Projects
            </h2>
            {sections.projects.map((proj, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-semibold">{proj.name || 'Project Name'}</h3>
                {proj.description && (
                  <p className="text-gray-700">{proj.description}</p>
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-gray-600">
                    Technologies: {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumePreview;

