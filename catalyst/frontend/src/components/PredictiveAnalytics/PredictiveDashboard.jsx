import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Badge from 'react-bootstrap/Badge';
import Toast from '../Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function PredictiveDashboard() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    document.title = 'catalyst | Placement Prediction';
    if (jobId && jobId !== 'undefined') {
      // Try to load existing prediction first
      loadExistingPrediction();
    } else {
      // Load all predictions and available jobs
      loadAllPredictions();
      loadAvailableJobs();
    }
  }, [jobId]);

  const loadExistingPrediction = async () => {
    if (!jobId || jobId === 'undefined') {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // First try to get existing prediction
      const existingResponse = await axios.get(`${BASE_URL}/ai/predict/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (existingResponse.data.prediction) {
        setPrediction(existingResponse.data.prediction);
      }
    } catch (error) {
      // If not found (404), that's okay - we'll show generate button
      if (error.response?.status === 404) {
        // Prediction doesn't exist yet, that's fine
        setPrediction(null);
      } else {
        console.error('Error loading prediction:', error);
        setToastMessage(error.response?.data?.msg || 'Error loading prediction');
        setShowToast(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPrediction = async (selectedJobId = jobId) => {
    if (!selectedJobId || selectedJobId === 'undefined') {
      setToastMessage('Please select a job first');
      setShowToast(true);
      return;
    }

    setLoading(true);
    setPrediction(null); // Clear existing prediction
    try {
      const response = await axios.post(`${BASE_URL}/ai/predict`, {
        jobId: selectedJobId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPrediction(response.data.prediction);
      setToastMessage('Prediction generated successfully!');
      setShowToast(true);
      // Refresh predictions list
      loadAllPredictions();
      // Navigate to show the prediction
      if (!jobId || jobId === 'undefined') {
        navigate(`/student/prediction/${selectedJobId}`);
      }
    } catch (error) {
      console.error('Prediction error:', error);
      const errorMsg = error.response?.data?.msg || error.message || 'Error generating prediction';
      setToastMessage(errorMsg);
      setShowToast(true);
      // If it's a network error or API issue, show helpful message
      if (error.code === 'ERR_NETWORK') {
        setToastMessage('Unable to connect to server. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAllPredictions = async () => {
    setLoadingPredictions(true);
    try {
      const response = await axios.get(`${BASE_URL}/ai/predictions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPredictions(response.data.predictions || []);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoadingPredictions(false);
    }
  };

  const loadAvailableJobs = async () => {
    try {
      // Try public route first
      const response = await axios.get(`${BASE_URL}/public/jobs`);
      // Handle both { data: jobs } and { jobs } formats
      setJobs(response.data.data || response.data.jobs || []);
    } catch (error) {
      // If public route doesn't work, try with auth
      try {
        const response = await axios.get(`${BASE_URL}/public/jobs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setJobs(response.data.data || response.data.jobs || []);
      } catch (err) {
        console.error('Error loading jobs:', err);
        setJobs([]);
      }
    }
  };

  if (loading && !prediction) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
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
              Analyzing your profile and generating prediction...
            </p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (!prediction && !loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card 
          className="shadow-lg mb-4 backdrop-blur-xl border-2"
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
            <h2 className="text-2xl font-bold mb-0">
              <i className="fa-solid fa-chart-line mr-2"></i>
              Placement Probability Predictor
            </h2>
          </Card.Header>
          <Card.Body style={{ backgroundColor: 'transparent' }}>
            <p 
              className="mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Get AI-powered predictions about your placement chances based on your profile. Select a job or view existing predictions.
            </p>
          </Card.Body>
        </Card>

        {/* Existing Predictions */}
        {predictions.length > 0 && (
          <Card 
            className="shadow-lg mb-4 backdrop-blur-xl border-2"
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
                <i className="fa-solid fa-history mr-2"></i>
                Your Previous Predictions
              </h3>
            </Card.Header>
            <Card.Body style={{ backgroundColor: 'transparent' }}>
              <div className="row g-3">
                {predictions.map((pred) => (
                  <div key={pred._id} className="col-md-6">
                    <Card 
                      className="h-100 border-2"
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderColor: 'rgba(139, 92, 246, 0.3)'
                      }}
                    >
                      <Card.Body style={{ backgroundColor: 'transparent' }}>
                        <h5 
                          className="card-title"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {pred.jobId?.jobTitle || 'Job Title'}
                        </h5>
                        <p 
                          className="mb-2"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {pred.jobId?.company?.companyName || 'Company'}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Badge 
                              style={{
                                background: pred.placementProbability >= 70 
                                  ? 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)' :
                                  pred.placementProbability >= 50
                                  ? 'linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%)' :
                                  'linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%)',
                                color: '#ffffff'
                              }}
                            >
                              {pred.placementProbability}% Chance
                            </Badge>
                            <div className="mt-2">
                              <small style={{ color: 'var(--color-text-secondary)' }}>Predicted: ₹{pred.predictedPackage?.toFixed(1)} LPA</small>
                            </div>
                          </div>
                          {pred.jobId && (
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => navigate(`/student/prediction/${pred.jobId._id || pred.jobId}`)}
                              style={{
                                borderColor: 'var(--color-primary)',
                                color: 'var(--color-primary)'
                              }}
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Available Jobs */}
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
              <i className="fa-solid fa-briefcase mr-2"></i>
              Available Jobs for Prediction
            </h3>
          </Card.Header>
          <Card.Body style={{ backgroundColor: 'transparent' }}>
            {jobs.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Salary (LPA)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => {
                      const jobIdStr = job._id?.toString();
                      const hasPrediction = predictions.find(p => {
                        const predJobId = p.jobId?._id?.toString() || p.jobId?.toString();
                        return predJobId === jobIdStr;
                      });
                      return (
                        <tr key={job._id}>
                          <td style={{ color: 'var(--color-text)' }}>{job.jobTitle}</td>
                          <td style={{ color: 'var(--color-text)' }}>{job.company?.companyName || job.company || 'N/A'}</td>
                          <td style={{ color: 'var(--color-text)' }}>₹{job.salary || 'N/A'}</td>
                          <td>
                            {hasPrediction ? (
                              <Button 
                                variant="outline-info" 
                                size="sm"
                                onClick={() => navigate(`/student/prediction/${job._id}`)}
                                style={{
                                  borderColor: 'var(--color-info)',
                                  color: 'var(--color-info)'
                                }}
                              >
                                View Prediction
                              </Button>
                            ) : (
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => getPrediction(job._id)}
                                disabled={loading}
                                style={{
                                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                                  border: 'none'
                                }}
                              >
                                {loading ? 'Generating...' : 'Generate Prediction'}
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-4">
                <p 
                  className="mb-3"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  No jobs available. Check job listings to see available positions.
                </p>
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/student/job-listings')}
                  style={{
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-primary)'
                  }}
                >
                  Browse Job Listings
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>

        <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} />
      </div>
    );
  }

  // If we have a jobId but no prediction yet, show generate button
  if (jobId && jobId !== 'undefined' && !prediction && !loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
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
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%)',
              color: '#ffffff',
              border: 'none'
            }}
          >
            <h3 className="mb-0">
              <i className="fa-solid fa-chart-pie mr-2"></i>
              Placement Probability Predictor
            </h3>
          </Card.Header>
          <Card.Body className="text-center p-8" style={{ backgroundColor: 'transparent' }}>
            <div className="mb-6">
              <i 
                className="fa-solid fa-magic text-6xl mb-4"
                style={{ color: 'var(--color-primary)' }}
              ></i>
              <h2 
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--color-text)' }}
              >
                Generate Prediction
              </h2>
              <p 
                className="text-lg mb-4"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Get AI-powered predictions about your placement chances for this job
              </p>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => getPrediction(jobId)} 
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                border: 'none'
              }}
            >
              <i className="fa-solid fa-magic mr-2"></i>
              {loading ? 'Generating Prediction...' : 'Generate Prediction'}
            </Button>
          </Card.Body>
        </Card>
        <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} />
      </div>
    );
  }

  if (!prediction) {
    return null; // This case is handled above
  }

  const probability = prediction.placementProbability || 0;
  const getVariant = (score) => {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
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
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%)',
            color: '#ffffff',
            border: 'none'
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="mb-0">
                <i className="fa-solid fa-chart-pie mr-2"></i>
                Placement Probability
              </h3>
              <small>AI-Powered Prediction</small>
            </div>
            {jobId && jobId !== 'undefined' && (
              <Button 
                variant="light" 
                size="sm"
                onClick={() => getPrediction(jobId)}
                disabled={loading}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#ffffff'
                }}
              >
                <i className="fa-solid fa-sync-alt mr-2"></i>
                Refresh
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Body style={{ backgroundColor: 'transparent' }}>
          <div className="text-center mb-6">
            <div className="mb-4">
              <h1 
                className="text-7xl font-bold mb-2"
                style={{
                  color: getVariant(probability) === 'success' ? 'var(--color-success)' :
                         getVariant(probability) === 'warning' ? 'var(--color-warning)' :
                         'var(--color-error)'
                }}
              >
                {probability}%
              </h1>
              <p 
                className="text-xl mb-3"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Chance of Getting Placed
              </p>
              <ProgressBar 
                now={probability} 
                variant={getVariant(probability)}
                style={{ height: '40px', fontSize: '18px' }}
                className="fw-bold"
                label={`${probability}%`}
              />
            </div>
          </div>

          <div className="row g-3 mb-6">
            <div className="col-md-6">
              <Card 
                className="h-100 border-2"
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderColor: 'rgba(139, 92, 246, 0.3)'
                }}
              >
                <Card.Body style={{ backgroundColor: 'transparent' }}>
                  <h6 
                    className="mb-2"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Predicted Package
                  </h6>
                  <h3 
                    className="mb-0"
                    style={{ color: 'var(--color-success)' }}
                  >
                    ₹{prediction.predictedPackage?.toFixed(1) || 'N/A'} LPA
                  </h3>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6">
              <Card 
                className="h-100 border-2"
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderColor: 'rgba(139, 92, 246, 0.3)'
                }}
              >
                <Card.Body style={{ backgroundColor: 'transparent' }}>
                  <h6 
                    className="mb-2"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Confidence Level
                  </h6>
                  <h3 
                    className="mb-0"
                    style={{ color: 'var(--color-info)' }}
                  >
                    {prediction.confidenceLevel || 75}%
                  </h3>
                </Card.Body>
              </Card>
            </div>
          </div>

          <div className="mb-6">
            <h5 
              className="mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              <i className="fa-solid fa-chart-bar mr-2"></i>
              Performance Factors
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(prediction.factors || {}).map(([key, value]) => (
                <Card 
                  key={key} 
                  className="h-100 border-2"
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderColor: 'rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <Card.Body style={{ backgroundColor: 'transparent' }}>
                    <div className="flex justify-between items-center mb-2">
                      <h6 
                        className="mb-0 text-capitalize"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h6>
                      <Badge 
                        className="text-lg px-3"
                        style={{
                          background: getVariant(value) === 'success' 
                            ? 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)' :
                            getVariant(value) === 'warning'
                            ? 'linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%)' :
                            'linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%)',
                          color: '#ffffff'
                        }}
                      >
                        {Math.round(value)}%
                      </Badge>
                    </div>
                    <ProgressBar 
                      now={value} 
                      variant={getVariant(value)}
                      style={{ height: '20px' }}
                    />
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>

          {prediction.recommendations && prediction.recommendations.length > 0 && (
            <Card 
              className="mb-4 border-2"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-warning)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              <Card.Header
                style={{
                  background: 'linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%)',
                  color: '#000000',
                  border: 'none'
                }}
              >
                <h5 className="mb-0">
                  <i className="fa-solid fa-lightbulb mr-2"></i>
                  Recommendations to Improve Your Chances
                </h5>
              </Card.Header>
              <Card.Body style={{ backgroundColor: 'transparent' }}>
                <ul className="list-unstyled mb-0">
                  {prediction.recommendations.map((rec, i) => (
                    <li 
                      key={i} 
                      className="mb-3 p-3 rounded"
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)'
                      }}
                    >
                      <div className="flex items-start">
                        <Badge 
                          className="me-3 mt-1" 
                          style={{ 
                            minWidth: '30px',
                            background: 'linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%)',
                            color: '#000000'
                          }}
                        >
                          {i + 1}
                        </Badge>
                        <span 
                          className="flex-1"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {rec}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          )}

          <div className="flex gap-2 justify-center">
            {jobId && jobId !== 'undefined' && (
              <Button 
                variant="primary" 
                onClick={() => navigate('/student/interview-simulator/' + jobId)}
              >
                <i className="fa-solid fa-microphone mr-2"></i>
                Practice Interview
              </Button>
            )}
            <Button variant="outline-secondary" onClick={() => navigate('/student/dashboard')}>
              Back to Dashboard
            </Button>
            <Button variant="outline-primary" onClick={() => navigate('/student/prediction')}>
              View All Predictions
            </Button>
          </div>
        </Card.Body>
      </Card>
      <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} />
    </div>
  );
}

export default PredictiveDashboard;

