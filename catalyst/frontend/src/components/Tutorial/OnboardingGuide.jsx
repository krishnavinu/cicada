import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTimes, FaChevronRight, FaChevronLeft, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Tutorial content configuration for each role with routes
const tutorialSteps = {
  student: [
    {
      id: 'dashboard',
      title: 'Welcome to Your Dashboard! 🎉',
      content: 'This is your main dashboard where you can see notifications, job updates, and quick access to all features. Check here regularly for important updates.',
      route: '/student/dashboard',
      target: null,
      position: 'center'
    },
    {
      id: 'sidebar',
      title: 'Navigation Menu',
      content: 'Use the sidebar to navigate through all features. Each menu item has a specific purpose - we\'ll guide you through them!',
      route: '/student/dashboard',
      target: '[data-tutorial="sidebar"]',
      position: 'right'
    },
    {
      id: 'resume-builder',
      title: 'Resume Builder 📄',
      content: 'Create a professional, ATS-friendly resume with AI-powered suggestions. You can choose from multiple templates, drag-and-drop sections, and get instant feedback on your resume quality.',
      route: '/student/resume-builder',
      target: null,
      position: 'center'
    },
    {
      id: 'job-listings',
      title: 'Job Listings 💼',
      content: 'Browse all available job postings from companies. Filter by department, salary, location, and apply directly with your resume. Check the culture match score to find your perfect fit!',
      route: '/student/job-listings',
      target: null,
      position: 'center'
    },
    {
      id: 'placement-drives',
      title: 'Placement Drives 📅',
      content: 'View and register for upcoming placement drives organized by companies. Get notified about registration deadlines and drive schedules.',
      route: '/student/placement-drives',
      target: null,
      position: 'center'
    },
    {
      id: 'interview-simulator',
      title: 'AI Interview Simulator 🎤',
      content: 'Practice your interview skills with AI-powered mock interviews. Get real-time feedback on your answers, improve your communication, and boost your confidence before real interviews.',
      route: '/student/interview-simulator',
      target: null,
      position: 'center'
    },
    {
      id: 'prs-dashboard',
      title: 'PRS Dashboard 🚀',
      content: 'Track your Placement Readiness Score (PRS) - a composite metric based on your academics, resume quality, interview performance, and attendance. See what areas need improvement!',
      route: '/student/prs',
      target: null,
      position: 'center'
    },
    {
      id: 'prediction',
      title: 'Placement Prediction 📊',
      content: 'Get AI-powered predictions about your placement probability for specific jobs. Understand what factors influence your chances and get personalized recommendations.',
      route: '/student/prediction',
      target: null,
      position: 'center'
    },
    {
      id: 'career-dna',
      title: 'Career DNA Profiler 🧬',
      content: 'Discover your personality traits, work style, and values. This unique feature helps you find companies that match your culture and work preferences.',
      route: '/student/career-dna',
      target: null,
      position: 'center'
    },
    {
      id: 'interventions',
      title: 'Intervention Engine ⚙️',
      content: 'Get personalized recommendations to improve your placement readiness. See "what-if" scenarios and track how different actions can boost your PRS score.',
      route: '/student/interventions',
      target: null,
      position: 'center'
    }
  ],
  tpo_admin: [
    {
      id: 'dashboard',
      title: 'TPO Dashboard',
      content: 'Welcome to the TPO dashboard! Here you can manage placement drives, view student applications, and generate reports.',
      route: '/tpo/dashboard',
      target: null,
      position: 'center'
    },
    {
      id: 'sidebar',
      title: 'Navigation Menu',
      content: 'Use the sidebar to navigate through all features. Each menu item helps you manage different aspects of placements.',
      route: '/tpo/dashboard',
      target: '[data-tutorial="sidebar"]',
      position: 'right'
    },
    {
      id: 'post-job',
      title: 'Post Jobs',
      content: 'Create and manage job postings for companies. Add job details, requirements, and track applications from students.',
      route: '/tpo/post-job',
      target: null,
      position: 'center'
    },
    {
      id: 'placement-drives',
      title: 'Manage Placement Drives',
      content: 'Create and manage placement drives. Register students, track participation, and manage drive schedules.',
      route: '/tpo/create-drive',
      target: null,
      position: 'center'
    },
    {
      id: 'reports',
      title: 'Generate Reports',
      content: 'Generate comprehensive reports - department-wise, offer-wise, and student-wise. Export to Excel or PDF for official records.',
      route: '/tpo/reports/department',
      target: null,
      position: 'center'
    },
    {
      id: 'resume-filter',
      title: 'AI Resume Filter',
      content: 'Use AI to filter and rank student applications. Automatically extract candidate information and shortlist the best matches.',
      route: '/tpo/ai/resume-filter',
      target: null,
      position: 'center'
    }
  ],
  hod: [
    {
      id: 'dashboard',
      title: 'HOD Dashboard',
      content: 'Welcome to the HOD dashboard! Manage students in your department, approve registrations, and view department statistics.',
      route: '/hod/dashboard',
      target: null,
      position: 'center'
    },
    {
      id: 'sidebar',
      title: 'Navigation Menu',
      content: 'Use the sidebar to navigate through department management features.',
      route: '/hod/dashboard',
      target: '[data-tutorial="sidebar"]',
      position: 'right'
    },
    {
      id: 'approve-students',
      title: 'Approve Students',
      content: 'Review and approve student registrations in your department. Verify student information before approval.',
      route: '/hod/approve-students',
      target: null,
      position: 'center'
    },
    {
      id: 'department-students',
      title: 'Department Students',
      content: 'View all students in your department. Check their placement status, PRS scores, and performance metrics.',
      route: '/hod/students',
      target: null,
      position: 'center'
    },
    {
      id: 'reports',
      title: 'Department Reports',
      content: 'Generate and download department-wise placement reports. Export to Excel or PDF for official records.',
      route: '/hod/reports',
      target: null,
      position: 'center'
    }
  ],
  management_admin: [
    {
      id: 'dashboard',
      title: 'Management Dashboard',
      content: 'Welcome to the Management dashboard! Oversee all placement activities, manage users, and view overall statistics.',
      route: '/management/dashboard',
      target: null,
      position: 'center'
    },
    {
      id: 'sidebar',
      title: 'Navigation Menu',
      content: 'Use the sidebar to navigate through management features.',
      route: '/management/dashboard',
      target: '[data-tutorial="sidebar"]',
      position: 'right'
    },
    {
      id: 'add-users',
      title: 'Manage Users',
      content: 'Add new TPOs, HODs, and manage user roles. Control access and permissions across the system.',
      route: '/management/add-tpo-admin',
      target: null,
      position: 'center'
    },
    {
      id: 'reports',
      title: 'Generate Reports',
      content: 'Generate detailed reports across all departments and roles. Export data for analysis and decision-making. You can access reports through the TPO dashboard or request department-wise reports.',
      route: '/management/dashboard',
      target: null,
      position: 'center'
    }
  ]
};

const OnboardingGuide = ({ userRole, userId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkTutorialStatus();
  }, [userId, userRole]);

  useEffect(() => {
    if (isVisible && steps.length > 0 && !isNavigating) {
      // Small delay to ensure DOM is ready after navigation
      const timer = setTimeout(() => {
        highlightCurrentStep();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isVisible, location.pathname, isNavigating]);

  const checkTutorialStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !userId || !userRole) {
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/user/detail`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const user = response.data;
      const tutorialCompleted = user.tutorialCompleted || false;

      if (!tutorialCompleted && userRole && tutorialSteps[userRole]) {
        const tutorialStepsList = tutorialSteps[userRole];
        setSteps(tutorialStepsList);
        setIsVisible(true);
        
        // Navigate to first step's route if it exists and we're not already there
        if (tutorialStepsList.length > 0 && tutorialStepsList[0].route) {
          const firstStepRoute = tutorialStepsList[0].route;
          if (location.pathname !== firstStepRoute) {
            setIsNavigating(true);
            navigate(firstStepRoute);
            setTimeout(() => {
              setIsNavigating(false);
            }, 500);
          }
        }
      } else {
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Error checking tutorial status:', error);
      setIsVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const highlightCurrentStep = () => {
    // Remove previous highlights
    document.querySelectorAll('[data-tutorial-highlight]').forEach(el => {
      el.removeAttribute('data-tutorial-highlight');
      el.style.zIndex = '';
      el.style.position = '';
      el.style.transition = '';
    });

    const step = steps[currentStep];
    if (step && step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        element.setAttribute('data-tutorial-highlight', 'true');
        element.style.zIndex = '9998';
        element.style.position = 'relative';
        element.style.transition = 'all 0.3s ease';
        
        // Scroll into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const nextStep = async () => {
    const step = steps[currentStep];
    const nextStepIndex = currentStep + 1;
    
    // If we're on the last step, complete the tutorial
    if (nextStepIndex >= steps.length) {
      completeTutorial();
      return;
    }
    
    const nextStep = steps[nextStepIndex];
    
    // Navigate to next step's route if it exists and is different from current
    if (nextStep.route && location.pathname !== nextStep.route) {
      setIsNavigating(true);
      navigate(nextStep.route);
      
      // Wait for navigation, then update step
      setTimeout(() => {
        setIsNavigating(false);
        setCurrentStep(nextStepIndex);
      }, 500);
    } else {
      // No navigation needed, just move to next step
      setCurrentStep(nextStepIndex);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      const prevStep = steps[prevStepIndex];
      
      // Navigate to previous step's route if it exists and is different
      if (prevStep.route && location.pathname !== prevStep.route) {
        setIsNavigating(true);
        navigate(prevStep.route);
        setTimeout(() => {
          setIsNavigating(false);
          setCurrentStep(prevStepIndex);
        }, 500);
      } else {
        setCurrentStep(prevStepIndex);
      }
    }
  };

  const skipTutorial = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${BASE_URL}/user/tutorial/skip`,
        { skipped: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      cleanup();
      setIsVisible(false);
    } catch (error) {
      console.error('Error skipping tutorial:', error);
      cleanup();
      setIsVisible(false);
    }
  };

  const completeTutorial = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${BASE_URL}/user/tutorial/complete`,
        { 
          completedSteps: steps.map(s => s.id),
          completed: true 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      cleanup();
      setIsVisible(false);
    } catch (error) {
      console.error('Error completing tutorial:', error);
      cleanup();
      setIsVisible(false);
    }
  };

  const cleanup = () => {
    // Clean up highlights
    document.querySelectorAll('[data-tutorial-highlight]').forEach(el => {
      el.removeAttribute('data-tutorial-highlight');
      el.style.zIndex = '';
      el.style.position = '';
      el.style.transition = '';
    });
  };

  if (isLoading || !isVisible || steps.length === 0) {
    return null;
  }

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Calculate tooltip position
  const getTooltipStyle = () => {
    if (step.position === 'center') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        maxWidth: '500px'
      };
    }

    const element = step.target ? document.querySelector(step.target) : null;
    if (element) {
      const rect = element.getBoundingClientRect();
      if (step.position === 'right') {
        return {
          position: 'fixed',
          top: `${Math.max(20, rect.top + rect.height / 2 - 150)}px`,
          left: `${Math.min(window.innerWidth - 450, rect.right + 20)}px`,
          transform: 'translateY(-50%)',
          zIndex: 10000,
          maxWidth: '400px'
        };
      }
    }

    return {
      position: 'fixed',
      top: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10000,
      maxWidth: '500px'
    };
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] transition-opacity"
        style={{ pointerEvents: step.position === 'center' ? 'auto' : 'none' }}
      />

      {/* Tooltip */}
      <div
        className="bg-white rounded-lg shadow-2xl p-6 max-w-md z-[10000] animate-fadeIn border-2 border-blue-500"
        style={getTooltipStyle()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={skipTutorial}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close tutorial"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-700 mb-6 leading-relaxed">{step.content}</p>

        {/* Actions */}
        <div className="flex justify-between items-center gap-2">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              isFirstStep
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaChevronLeft className="inline" />
            Previous
          </button>

          <button
            onClick={skipTutorial}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Skip Tutorial
          </button>

          <button
            onClick={nextStep}
            disabled={isNavigating}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isNavigating ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Navigating...
              </>
            ) : isLastStep ? (
              <>
                Complete <FaCheckCircle />
              </>
            ) : (
              <>
                Next <FaChevronRight className="inline" />
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        [data-tutorial-highlight] {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5) !important;
          border-radius: 4px;
          background-color: rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
    </>
  );
};

export default OnboardingGuide;

