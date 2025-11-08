import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Badge from 'react-bootstrap/Badge';
import Toast from '../Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function PRSDashboard() {
  const [prsData, setPrsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    document.title = 'catalyst | Placement Readiness Score';
    fetchPRS();
  }, []);

  const fetchPRS = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/ai/prs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPrsData(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        // PRS not calculated yet, calculate it
        calculatePRS();
      } else {
        setToastMessage(error.response?.data?.msg || 'Error fetching PRS');
        setShowToast(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculatePRS = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/ai/prs/calculate`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPrsData(response.data);
      setToastMessage('PRS calculated successfully!');
      setShowToast(true);
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error calculating PRS');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !prsData) {
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
            <p className="text-lg" style={{ color: 'var(--color-text)' }}>Calculating your Placement Readiness Score...</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (!prsData) {
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
                className="fa-solid fa-chart-bar text-6xl mb-4"
                style={{ color: 'var(--color-primary)' }}
              ></i>
              <h2 
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--color-text)' }}
              >
                Placement Readiness Score
              </h2>
              <p 
                className="text-lg"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Calculate your PRS to see how ready you are for placements
              </p>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={calculatePRS} 
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                border: 'none'
              }}
            >
              <i className="fa-solid fa-calculator mr-2"></i>
              Calculate PRS
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const getPRSColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getPRSLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
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
        {/* PRS Score Card */}
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
              <h2 
                className="text-2xl font-bold"
                style={{ color: 'var(--color-text)' }}
              >
                Placement Readiness Score
              </h2>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={calculatePRS}
                style={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
              >
                <i className="fa-solid fa-refresh mr-2"></i>
                Recalculate
              </Button>
            </div>
            
            <div className="text-center mb-6">
              <div 
                className="text-7xl font-bold mb-2"
                style={{ 
                  color: getPRSColor(prsData.prs) === 'success' ? 'var(--color-success)' :
                         getPRSColor(prsData.prs) === 'warning' ? 'var(--color-warning)' :
                         'var(--color-error)'
                }}
              >
                {prsData.prs}
              </div>
              <Badge 
                className="text-lg px-4 py-2"
                style={{
                  background: getPRSColor(prsData.prs) === 'success' 
                    ? 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)' :
                    getPRSColor(prsData.prs) === 'warning'
                    ? 'linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%)' :
                    'linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%)',
                  color: '#ffffff'
                }}
              >
                {getPRSLabel(prsData.prs)}
              </Badge>
              <p 
                className="mt-3"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Out of 100
              </p>
            </div>

            <ProgressBar 
              now={prsData.prs} 
              variant={getPRSColor(prsData.prs)}
              className="h-3"
            />
          </Card.Body>
        </Card>

        {/* Top 3 Contributing Factors */}
        {prsData.top3ContributingFactors && prsData.top3ContributingFactors.length > 0 && (
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
                <i className="fa-solid fa-star mr-2" style={{ color: 'var(--color-warning)' }}></i>
                Top 3 Contributing Factors
              </h3>
            </Card.Header>
            <Card.Body style={{ backgroundColor: 'transparent' }}>
              <div className="space-y-4">
                {prsData.top3ContributingFactors.map((factor, index) => (
                  <div 
                    key={index} 
                    className="pl-4 py-2 rounded"
                    style={{
                      borderLeft: '4px solid var(--color-primary)',
                      backgroundColor: 'rgba(139, 92, 246, 0.05)'
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 
                        className="font-semibold text-lg"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {index + 1}. {factor.factor}
                      </h4>
                      <Badge 
                        style={{
                          background: 'linear-gradient(135deg, var(--color-info) 0%, #0284c7 100%)',
                          color: '#ffffff'
                        }}
                      >
                        {factor.score}/100
                      </Badge>
                    </div>
                    <p 
                      className="text-sm mb-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {factor.details}
                    </p>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-xs"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        Impact:
                      </span>
                      <ProgressBar 
                        now={factor.impact} 
                        variant="info"
                        className="flex-1 h-2"
                        style={{ maxWidth: '200px' }}
                      />
                      <span 
                        className="text-xs"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {factor.impact.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Breakdown */}
        {prsData.breakdown && (
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
                <i className="fa-solid fa-chart-pie mr-2"></i>
                Score Breakdown
              </h3>
            </Card.Header>
            <Card.Body style={{ backgroundColor: 'transparent' }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span 
                      className="font-semibold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Academic Performance
                    </span>
                    <span style={{ color: 'var(--color-text)' }}>{prsData.breakdown.academic}/100</span>
                  </div>
                  <ProgressBar now={prsData.breakdown.academic} variant="primary" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span 
                      className="font-semibold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Resume Quality
                    </span>
                    <span style={{ color: 'var(--color-text)' }}>{prsData.breakdown.resume}/100</span>
                  </div>
                  <ProgressBar now={prsData.breakdown.resume} variant="success" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span 
                      className="font-semibold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Mock Interview
                    </span>
                    <span style={{ color: 'var(--color-text)' }}>{prsData.breakdown.interview}/100</span>
                  </div>
                  <ProgressBar now={prsData.breakdown.interview} variant="warning" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span 
                      className="font-semibold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Attendance
                    </span>
                    <span style={{ color: 'var(--color-text)' }}>{prsData.breakdown.attendance}/100</span>
                  </div>
                  <ProgressBar now={prsData.breakdown.attendance} variant="info" />
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </>
  );
}

export default PRSDashboard;

