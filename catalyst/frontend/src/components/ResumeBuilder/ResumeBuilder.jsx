import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TemplateSelector from './TemplateSelector';
import ResumeEditor from './ResumeEditor';
import ResumePreview from './ResumePreview';
import AISuggestions from './AISuggestions';
import Toast from '../Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function ResumeBuilder() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [resumeData, setResumeData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('template-1');
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview' | 'suggestions'
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load existing resume or create new
  useEffect(() => {
    loadResume();
  }, []);

  // Update styling when template changes
  useEffect(() => {
    if (resumeData && selectedTemplate) {
      // Update color scheme based on template
      let colorScheme = 'blue';
      if (selectedTemplate === 'template-2') colorScheme = 'black';
      if (selectedTemplate === 'template-3') colorScheme = 'purple';
      
      setResumeData(prev => ({
        ...prev,
        templateId: selectedTemplate,
        styling: {
          ...prev.styling,
          colorScheme: colorScheme
        }
      }));
    }
  }, [selectedTemplate]);

  const loadResume = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/resume/get`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.resume) {
        setResumeData(response.data.resume);
        setSelectedTemplate(response.data.resume.templateId || 'template-1');
      } else {
        initializeResume();
      }
    } catch (error) {
      initializeResume();
    } finally {
      setLoading(false);
    }
  };

  const initializeResume = () => {
    setResumeData({
      sections: {
        personalInfo: {},
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
  };

  const updateSection = (sectionName, data) => {
    setResumeData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionName]: data
      },
      updatedAt: new Date()
    }));
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      await axios.post(`${BASE_URL}/resume/save`, {
        templateId: selectedTemplate,
        ...resumeData
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setToastMessage('Resume saved successfully!');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Error saving resume');
      setShowToast(true);
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  };

  const getAISuggestions = async () => {
    if (!jobId) {
      setToastMessage('No job selected for suggestions');
      setShowToast(true);
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/resume/ai-suggestions`, {
        resumeData,
        jobId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAiSuggestions(response.data.suggestions);
      setMatchScore(response.data.matchScore);
      setToastMessage('AI suggestions generated!');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Error getting AI suggestions');
      setShowToast(true);
      console.error('Error getting suggestions:', error);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/resume/export-pdf`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setToastMessage('Resume downloaded successfully!');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Error downloading resume');
      setShowToast(true);
      console.error('Error downloading PDF:', error);
    }
  };

  const submitToJob = async () => {
    if (!jobId) {
      setToastMessage('No job selected');
      setShowToast(true);
      return;
    }
    try {
      await axios.post(`${BASE_URL}/resume/submit-to-job`, {
        jobId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setToastMessage('Resume submitted successfully!');
      setShowToast(true);
      setTimeout(() => {
        navigate(`/student/job/${jobId}`);
      }, 2000);
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error submitting resume');
      setShowToast(true);
      console.error('Error submitting resume:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl mb-4"></i>
          <p>Loading resume builder...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />
      
      <div 
        className="resume-builder-container p-4"
        style={{
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text)'
        }}
      >
        {/* Template Selector */}
        <div className="mb-4">
          <TemplateSelector 
            selected={selectedTemplate}
            onSelect={(templateId) => {
              setSelectedTemplate(templateId);
              // Update styling immediately
              if (resumeData) {
                let colorScheme = 'blue';
                if (templateId === 'template-2') colorScheme = 'black';
                if (templateId === 'template-3') colorScheme = 'purple';
                
                setResumeData(prev => ({
                  ...prev,
                  templateId: templateId,
                  styling: {
                    ...prev.styling,
                    colorScheme: colorScheme
                  }
                }));
              }
            }}
          />
        </div>

        {/* Tabs */}
        <div 
          className="flex border-b mb-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 transition-all duration-300 ${
              activeTab === 'editor' ? 'font-bold' : ''
            }`}
            style={{
              borderBottom: activeTab === 'editor' ? `2px solid var(--color-primary)` : 'none',
              color: activeTab === 'editor' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'editor') {
                e.currentTarget.style.color = 'var(--color-text)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'editor') {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }
            }}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 transition-all duration-300 ${
              activeTab === 'preview' ? 'font-bold' : ''
            }`}
            style={{
              borderBottom: activeTab === 'preview' ? `2px solid var(--color-primary)` : 'none',
              color: activeTab === 'preview' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'preview') {
                e.currentTarget.style.color = 'var(--color-text)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'preview') {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }
            }}
          >
            Preview
          </button>
          {jobId && (
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-4 py-2 transition-all duration-300 ${
                activeTab === 'suggestions' ? 'font-bold' : ''
              }`}
              style={{
                borderBottom: activeTab === 'suggestions' ? `2px solid var(--color-primary)` : 'none',
                color: activeTab === 'suggestions' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'suggestions') {
                  e.currentTarget.style.color = 'var(--color-text)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'suggestions') {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              AI Suggestions
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="builder-content min-h-[600px]">
          {activeTab === 'editor' && (
            <ResumeEditor 
              resumeData={resumeData}
              onUpdate={updateSection}
            />
          )}
          
          {activeTab === 'preview' && (
            <ResumePreview 
              resumeData={resumeData}
              template={selectedTemplate}
            />
          )}
          
          {activeTab === 'suggestions' && (
            <AISuggestions 
              suggestions={aiSuggestions}
              matchScore={matchScore}
              onGetSuggestions={getAISuggestions}
              resumeData={resumeData}
              jobId={jobId}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6 justify-end">
          <button
            onClick={saveResume}
            disabled={saving}
            className="px-6 py-2 text-white rounded transition-all duration-300 disabled:opacity-50"
            style={{
              background: saving 
                ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' 
                : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              opacity: saving ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(var(--color-primary-rgb), 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {saving ? 'Saving...' : 'Save Resume'}
          </button>
          <button
            onClick={downloadPDF}
            className="px-6 py-2 text-white rounded transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(var(--color-success-rgb, 52, 211, 153), 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Download PDF
          </button>
          {jobId && (
            <button
              onClick={submitToJob}
              className="px-6 py-2 text-white rounded transition-all duration-300"
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
              Submit to Job
            </button>
          )}
        </div>
      </div>
    </DndProvider>
  );
}

export default ResumeBuilder;

