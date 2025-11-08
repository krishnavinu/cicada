import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Toast from '../Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function CultureMatch() {
  const { jobId } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    document.title = 'catalyst | Culture Match';
    if (jobId && jobId !== 'undefined') {
      fetchCultureMatch();
    }
  }, [jobId]);

  const fetchCultureMatch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/ai/career-dna/match/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMatchData(response.data);
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error fetching culture match');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const getCompatibilityColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getCompatibilityLabel = (score) => {
    if (score >= 80) return 'Excellent Fit';
    if (score >= 60) return 'Good Fit';
    if (score >= 40) return 'Moderate Fit';
    return 'Low Fit';
  };

  if (loading && !matchData) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card className="shadow-lg">
          <Card.Body className="text-center p-8">
            <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-3"></i>
            <p className="text-lg">Analyzing culture compatibility...</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card className="shadow-lg">
          <Card.Body className="text-center p-8">
            <p className="text-gray-600">Select a job to view culture compatibility</p>
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
        {/* Compatibility Score */}
        <Card className="shadow-lg mb-6">
          <Card.Body className="p-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-2">
                Culture Compatibility
              </h2>
              <p className="text-gray-600">
                {matchData.job.jobTitle} at {matchData.job.company}
              </p>
            </div>
            <div className="text-center">
              <div className={`text-7xl font-bold mb-2 text-${getCompatibilityColor(matchData.compatibility.overallScore)}`}>
                {matchData.compatibility.overallScore}%
              </div>
              <Badge bg={getCompatibilityColor(matchData.compatibility.overallScore)} className="text-lg px-4 py-2">
                {getCompatibilityLabel(matchData.compatibility.overallScore)}
              </Badge>
            </div>
            <ProgressBar 
              now={matchData.compatibility.overallScore} 
              variant={getCompatibilityColor(matchData.compatibility.overallScore)}
              className="h-4 mt-4"
            />
          </Card.Body>
        </Card>

        {/* Compatibility Breakdown */}
        <Card className="shadow-lg mb-6">
          <Card.Header>
            <h3 className="text-xl font-bold mb-0">Compatibility Breakdown</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Work Style Match</span>
                  <span>{matchData.compatibility.breakdown.workStyle.toFixed(0)}%</span>
                </div>
                <ProgressBar now={matchData.compatibility.breakdown.workStyle} variant="primary" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Values Alignment</span>
                  <span>{matchData.compatibility.breakdown.values.toFixed(0)}%</span>
                </div>
                <ProgressBar now={matchData.compatibility.breakdown.values} variant="success" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Personality Fit</span>
                  <span>{matchData.compatibility.breakdown.personality.toFixed(0)}%</span>
                </div>
                <ProgressBar now={matchData.compatibility.breakdown.personality} variant="info" />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Company Culture Profile */}
        {matchData.companyCulture && (
          <Card className="shadow-lg mb-6">
            <Card.Header>
              <h3 className="text-xl font-bold mb-0">Company Culture Profile</h3>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="text-sm text-gray-600 mb-1">Environment</div>
                  <Badge bg="primary">
                    {matchData.companyCulture.companyCultureProfile?.environment || 'Unknown'}
                  </Badge>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-sm text-gray-600 mb-1">Collaboration</div>
                  <Badge bg="success">
                    {matchData.companyCulture.companyCultureProfile?.collaborationLevel || 'Unknown'}
                  </Badge>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded">
                  <div className="text-sm text-gray-600 mb-1">Pace</div>
                  <Badge bg="warning">
                    {matchData.companyCulture.companyCultureProfile?.pace || 'Unknown'}
                  </Badge>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="text-sm text-gray-600 mb-1">Location</div>
                  <Badge bg="info">
                    {matchData.companyCulture.companyCultureProfile?.workLocation || 'Unknown'}
                  </Badge>
                </div>
              </div>

              {/* Culture Signals */}
              {matchData.companyCulture.cultureSignals && (
                <div className="mt-4">
                  {matchData.companyCulture.cultureSignals.positiveSignals && 
                   matchData.companyCulture.cultureSignals.positiveSignals.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-semibold text-green-700 mb-2">
                        <i className="fa-solid fa-check-circle mr-2"></i>
                        Positive Signals
                      </h5>
                      <ul className="list-disc list-inside space-y-1">
                        {matchData.companyCulture.cultureSignals.positiveSignals.map((signal, idx) => (
                          <li key={idx} className="text-green-700">{signal}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {matchData.companyCulture.cultureSignals.potentialConcerns && 
                   matchData.companyCulture.cultureSignals.potentialConcerns.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-yellow-700 mb-2">
                        <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                        Potential Concerns
                      </h5>
                      <ul className="list-disc list-inside space-y-1">
                        {matchData.companyCulture.cultureSignals.potentialConcerns.map((concern, idx) => (
                          <li key={idx} className="text-yellow-700">{concern}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Recommendations */}
        {matchData.recommendations && matchData.recommendations.length > 0 && (
          <Card className="shadow-lg">
            <Card.Header>
              <h3 className="text-xl font-bold mb-0">
                <i className="fa-solid fa-lightbulb mr-2"></i>
                Recommendations
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {matchData.recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${
                      rec.type === 'positive' ? 'bg-green-50 border-l-4 border-green-500' :
                      rec.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                      'bg-blue-50 border-l-4 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start">
                      <i className={`fa-solid ${
                        rec.type === 'positive' ? 'fa-check-circle text-green-600' :
                        rec.type === 'warning' ? 'fa-exclamation-triangle text-yellow-600' :
                        'fa-info-circle text-blue-600'
                      } mr-3 mt-1`}></i>
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{rec.message}</p>
                        <span className="text-xs text-gray-500">
                          Confidence: {rec.confidence}
                        </span>
                      </div>
                    </div>
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

export default CultureMatch;

