import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Toast from '../Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function CareerDNADashboard() {
  const [careerDNA, setCareerDNA] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    document.title = 'catalyst | Career DNA Profile';
    fetchCareerDNA();
  }, []);

  const fetchCareerDNA = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/ai/career-dna`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCareerDNA(response.data.careerDNA);
    } catch (error) {
      if (error.response?.status === 404) {
        // Career DNA not generated yet
        setCareerDNA(null);
      } else {
        setToastMessage(error.response?.data?.msg || 'Error fetching Career DNA');
        setShowToast(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const analyzeCareerDNA = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/ai/career-dna/analyze`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCareerDNA(response.data.careerDNA);
      setToastMessage('Career DNA analyzed successfully!');
      setShowToast(true);
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error analyzing Career DNA');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !careerDNA) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card 
          className="shadow-lg backdrop-blur-xl border-2"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Card.Body className="text-center p-8" style={{ backgroundColor: 'transparent' }}>
            <i 
              className="fa-solid fa-spinner fa-spin text-4xl mb-3"
              style={{ color: 'var(--color-primary)' }}
            ></i>
            <p 
              className="text-lg"
              style={{ color: 'var(--color-text)' }}
            >
              Analyzing your Career DNA...
            </p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (!careerDNA) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card 
          className="shadow-lg backdrop-blur-xl border-2"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Card.Body className="text-center p-8" style={{ backgroundColor: 'transparent' }}>
            <div className="mb-6">
              <i 
                className="fa-solid fa-dna text-6xl mb-4"
                style={{ color: 'var(--color-primary)' }}
              ></i>
              <h2 
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--color-text)' }}
              >
                Career DNA Profiler
              </h2>
              <p 
                className="text-lg"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Discover your unique career profile based on your personality, work style, and values
              </p>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={analyzeCareerDNA} 
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                border: 'none'
              }}
            >
              <i className="fa-solid fa-flask mr-2"></i>
              Analyze My Career DNA
            </Button>
            <p 
              className="text-sm mt-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              This will analyze your resume, interview responses, and profile to generate your Career DNA
            </p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const getPersonalityLabel = (trait, value) => {
    if (trait === 'neuroticism') {
      return value < 30 ? 'Very Calm' : value < 50 ? 'Calm' : value < 70 ? 'Moderate' : 'Stressed';
    }
    return value < 30 ? 'Low' : value < 50 ? 'Moderate' : value < 70 ? 'High' : 'Very High';
  };

  const getWorkStyleLabel = (style) => {
    const labels = {
      'startup': 'Startup Environment',
      'mid-size': 'Mid-Size Company',
      'enterprise': 'Enterprise',
      'flexible': 'Flexible',
      'highly-collaborative': 'Highly Collaborative',
      'moderate': 'Moderate Collaboration',
      'independent': 'Independent Work',
      'fast-paced': 'Fast-Paced',
      'steady': 'Steady Pace',
      'remote': 'Remote Work',
      'hybrid': 'Hybrid',
      'office': 'Office Based'
    };
    return labels[style] || style;
  };

  return (
    <>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <Card 
          className="shadow-lg mb-6 backdrop-blur-xl border-2"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Card.Body className="p-6" style={{ backgroundColor: 'transparent' }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 
                  className="text-3xl font-bold mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  <i className="fa-solid fa-dna mr-2" style={{ color: 'var(--color-primary)' }}></i>
                  Your Career DNA
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Last analyzed: {new Date(careerDNA.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <Button 
                variant="outline-primary" 
                onClick={analyzeCareerDNA} 
                disabled={loading}
                style={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)'
                }}
              >
                <i className="fa-solid fa-refresh mr-2"></i>
                Re-analyze
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Personality Traits */}
        {careerDNA.personality && (
          <Card 
            className="shadow-lg mb-6 backdrop-blur-xl border-2"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Card.Header
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                color: '#ffffff',
                border: 'none'
              }}
            >
              <h3 className="text-xl font-bold mb-0">
                <i className="fa-solid fa-user mr-2"></i>
                Personality Traits
              </h3>
            </Card.Header>
            <Card.Body style={{ backgroundColor: 'transparent' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(careerDNA.personality).map(([trait, value]) => (
                  <div key={trait}>
                    <div className="flex justify-between mb-2">
                      <span 
                        className="font-semibold capitalize"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {trait === 'neuroticism' ? 'Stress Resilience' : trait}
                      </span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        {value}/100 - {getPersonalityLabel(trait, value)}
                      </span>
                    </div>
                    <ProgressBar 
                      now={value} 
                      variant={trait === 'neuroticism' ? (value < 50 ? 'success' : 'warning') : 'primary'}
                      className="h-3"
                    />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Work Style */}
        {careerDNA.workStyle && (
          <Card 
            className="shadow-lg mb-6 backdrop-blur-xl border-2"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Card.Header
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                color: '#ffffff',
                border: 'none'
              }}
            >
              <h3 className="text-xl font-bold mb-0">
                <i className="fa-solid fa-briefcase mr-2"></i>
                Work Style Preferences
              </h3>
            </Card.Header>
            <Card.Body style={{ backgroundColor: 'transparent' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  className="text-center p-4 rounded-lg border-2"
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderColor: 'rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <div 
                    className="text-sm mb-2"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Environment
                  </div>
                  <Badge 
                    className="text-lg px-3 py-2"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                      color: '#ffffff'
                    }}
                  >
                    {getWorkStyleLabel(careerDNA.workStyle.preferredEnvironment)}
                  </Badge>
                </div>
                <div 
                  className="text-center p-4 rounded-lg border-2"
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderColor: 'rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <div 
                    className="text-sm mb-2"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Collaboration
                  </div>
                  <Badge 
                    className="text-lg px-3 py-2"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
                      color: '#ffffff'
                    }}
                  >
                    {getWorkStyleLabel(careerDNA.workStyle.collaborationPreference)}
                  </Badge>
                </div>
                <div 
                  className="text-center p-4 rounded-lg border-2"
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderColor: 'rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <div 
                    className="text-sm mb-2"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Pace
                  </div>
                  <Badge 
                    className="text-lg px-3 py-2"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%)',
                      color: '#ffffff'
                    }}
                  >
                    {getWorkStyleLabel(careerDNA.workStyle.pacePreference)}
                  </Badge>
                </div>
                <div 
                  className="text-center p-4 rounded-lg border-2"
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderColor: 'rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <div 
                    className="text-sm mb-2"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Location
                  </div>
                  <Badge 
                    className="text-lg px-3 py-2"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-info) 0%, #0284c7 100%)',
                      color: '#ffffff'
                    }}
                  >
                    {getWorkStyleLabel(careerDNA.workStyle.workLocationPreference)}
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Values */}
        {careerDNA.values && (
          <Card 
            className="shadow-lg mb-6 backdrop-blur-xl border-2"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Card.Header
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                color: '#ffffff',
                border: 'none'
              }}
            >
              <h3 className="text-xl font-bold mb-0">
                <i className="fa-solid fa-heart mr-2"></i>
                Core Values & Priorities
              </h3>
            </Card.Header>
            <Card.Body style={{ backgroundColor: 'transparent' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(careerDNA.values)
                  .sort((a, b) => b[1] - a[1])
                  .map(([value, score]) => (
                    <div key={value}>
                      <div className="flex justify-between mb-2">
                        <span 
                          className="font-semibold capitalize"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {value.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span style={{ color: 'var(--color-text-secondary)' }}>{score}/100</span>
                      </div>
                      <ProgressBar now={score} variant="success" className="h-2" />
                    </div>
                  ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Career Trajectory */}
        {careerDNA.careerTrajectory?.predictedPaths && careerDNA.careerTrajectory.predictedPaths.length > 0 && (
          <Card 
            className="shadow-lg mb-6 backdrop-blur-xl border-2"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Card.Header
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                color: '#ffffff',
                border: 'none'
              }}
            >
              <h3 className="text-xl font-bold mb-0">
                <i className="fa-solid fa-route mr-2"></i>
                Predicted Career Trajectory
              </h3>
            </Card.Header>
            <Card.Body style={{ backgroundColor: 'transparent' }}>
              <div className="space-y-3">
                {careerDNA.careerTrajectory.predictedPaths.map((path, index) => (
                  <div 
                    key={index} 
                    className="pl-4 py-2 rounded"
                    style={{
                      borderLeft: '4px solid var(--color-primary)',
                      background: 'rgba(139, 92, 246, 0.1)'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span 
                        className="font-semibold text-lg"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {path.path}
                      </span>
                      <Badge 
                        style={{
                          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                          color: '#ffffff'
                        }}
                      >
                        {path.probability}% match
                      </Badge>
                    </div>
                    <ProgressBar now={path.probability} variant="primary" className="mt-2" />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Key Insights */}
        {careerDNA.insights && careerDNA.insights.length > 0 && (
          <Card 
            className="shadow-lg backdrop-blur-xl border-2"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Card.Header
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                color: '#ffffff',
                border: 'none'
              }}
            >
              <h3 className="text-xl font-bold mb-0">
                <i className="fa-solid fa-lightbulb mr-2" style={{ color: 'var(--color-warning)' }}></i>
                Key Insights
              </h3>
            </Card.Header>
            <Card.Body style={{ backgroundColor: 'transparent' }}>
              <div className="space-y-3">
                {careerDNA.insights.map((insight, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg border-2"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderColor: 'rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge 
                        style={{
                          background: 'linear-gradient(135deg, var(--color-info) 0%, #0284c7 100%)',
                          color: '#ffffff'
                        }}
                      >
                        {insight.category}
                      </Badge>
                      <span 
                        className="text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {insight.confidence}% confidence
                      </span>
                    </div>
                    <p style={{ color: 'var(--color-text)' }}>{insight.insight}</p>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </>
  );
}

export default CareerDNADashboard;

