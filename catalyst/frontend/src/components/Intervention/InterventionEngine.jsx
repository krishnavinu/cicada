import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Toast from '../Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function InterventionEngine() {
  const [recommendations, setRecommendations] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedInterventions, setSelectedInterventions] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    document.title = 'catalyst | Intervention Engine';
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/ai/interventions/recommendations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRecommendations(response.data);
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error fetching recommendations');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInterventionToggle = (interventionType) => {
    setSelectedInterventions(prev => {
      if (prev.includes(interventionType)) {
        return prev.filter(i => i !== interventionType);
      } else {
        return [...prev, interventionType];
      }
    });
  };

  const simulateInterventions = async () => {
    if (selectedInterventions.length === 0) {
      setToastMessage('Please select at least one intervention');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/ai/interventions/simulate`, {
        interventionTypes: selectedInterventions
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSimulation(response.data);
      setToastMessage('Simulation completed!');
      setShowToast(true);
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error simulating interventions');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const createIntervention = async (interventionType, description) => {
    try {
      await axios.post(`${BASE_URL}/ai/interventions`, {
        interventionType,
        description
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setToastMessage('Intervention created successfully!');
      setShowToast(true);
      fetchRecommendations();
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error creating intervention');
      setShowToast(true);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  if (loading && !recommendations) {
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
              Analyzing your profile...
            </p>
          </Card.Body>
        </Card>
      </div>
    );
  }

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
        {/* Current PRS */}
        {recommendations && (
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
            <Card.Body style={{ backgroundColor: 'transparent' }}>
              <h2 
                className="text-2xl font-bold mb-4"
                style={{ color: 'var(--color-text)' }}
              >
                Current Placement Readiness Score
              </h2>
              <div 
                className="text-5xl font-bold mb-2"
                style={{ color: 'var(--color-primary)' }}
              >
                {recommendations.currentPRS}
              </div>
              <p style={{ color: 'var(--color-text-secondary)' }}>Out of 100</p>
            </Card.Body>
          </Card>
        )}

        {/* Recommended Interventions */}
        {recommendations && recommendations.recommendations && (
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
                <i className="fa-solid fa-lightbulb mr-2" style={{ color: 'var(--color-warning)' }}></i>
                Recommended Interventions
              </h3>
            </Card.Header>
            <Card.Body style={{ backgroundColor: 'transparent' }}>
              <div className="space-y-4">
                {recommendations.recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="rounded p-4 border-2"
                    style={{
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      background: 'rgba(139, 92, 246, 0.1)'
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 
                            className="font-semibold text-lg"
                            style={{ color: 'var(--color-text)' }}
                          >
                            {rec.description}
                          </h4>
                          <Badge 
                            style={{
                              background: getPriorityColor(rec.priority) === 'danger' 
                                ? 'linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%)' :
                                getPriorityColor(rec.priority) === 'warning'
                                ? 'linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%)' :
                                'linear-gradient(135deg, var(--color-info) 0%, #0284c7 100%)',
                              color: '#ffffff'
                            }}
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                        <p 
                          className="text-sm mb-2"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Current Score: {rec.currentScore}/100
                        </p>
                        <p 
                          className="text-sm mb-2"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Estimated Time: {rec.estimatedTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <div 
                          className="text-2xl font-bold"
                          style={{ color: 'var(--color-success)' }}
                        >
                          +{rec.prsDelta}
                        </div>
                        <div 
                          className="text-sm"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          PRS Increase
                        </div>
                        <div 
                          className="text-lg font-semibold mt-1"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          → {rec.projectedPRS}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleInterventionToggle(rec.interventionType)}
                      >
                        {selectedInterventions.includes(rec.interventionType) ? '✓ Selected' : 'Select for Simulation'}
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => createIntervention(rec.interventionType, rec.description)}
                      >
                        Start Intervention
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* What-If Simulation */}
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
              <i className="fa-solid fa-flask mr-2"></i>
              What-If Simulation
            </h3>
          </Card.Header>
          <Card.Body style={{ backgroundColor: 'transparent' }}>
            {selectedInterventions.length > 0 ? (
              <div className="mb-4">
                <p 
                  className="mb-3"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Selected {selectedInterventions.length} intervention(s) for simulation
                </p>
                <Button 
                  variant="primary" 
                  onClick={simulateInterventions} 
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    border: 'none'
                  }}
                >
                  {loading ? 'Simulating...' : 'Run Simulation'}
                </Button>
              </div>
            ) : (
              <p 
                className="mb-3"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Select interventions above to simulate their impact on your PRS
              </p>
            )}

            {simulation && (
              <div 
                className="mt-6 p-4 rounded-lg border-2"
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderColor: 'rgba(139, 92, 246, 0.3)'
                }}
              >
                <h4 
                  className="font-bold text-lg mb-4"
                  style={{ color: 'var(--color-text)' }}
                >
                  Simulation Results
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div 
                      className="text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Current PRS
                    </div>
                    <div 
                      className="text-3xl font-bold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {simulation.currentPRS}
                    </div>
                  </div>
                  <div>
                    <div 
                      className="text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Projected PRS
                    </div>
                    <div 
                      className="text-3xl font-bold"
                      style={{ color: 'var(--color-success)' }}
                    >
                      {simulation.projectedPRS} 
                      <span 
                        className="text-lg ml-2"
                        style={{ color: 'var(--color-success)' }}
                      >
                        (+{simulation.prsIncrease})
                      </span>
                    </div>
                  </div>
                </div>

                {simulation.interventionDeltas && simulation.interventionDeltas.length > 0 && (
                  <div className="mb-4">
                    <h5 
                      className="font-semibold mb-2"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Intervention Breakdown:
                    </h5>
                    <ul className="list-disc list-inside space-y-1">
                      {simulation.interventionDeltas.map((delta, index) => (
                        <li 
                          key={index} 
                          className="text-sm"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {delta.description}: <strong style={{ color: 'var(--color-text)' }}>+{delta.prsDelta} points</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {simulation.projectedTop3Factors && (
                  <div>
                    <h5 
                      className="font-semibold mb-2"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Projected Top 3 Factors:
                    </h5>
                    <ol className="list-decimal list-inside space-y-1">
                      {simulation.projectedTop3Factors.map((factor, index) => (
                        <li 
                          key={index} 
                          className="text-sm"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {factor.factor} - Impact: {factor.impact.toFixed(1)}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default InterventionEngine;

