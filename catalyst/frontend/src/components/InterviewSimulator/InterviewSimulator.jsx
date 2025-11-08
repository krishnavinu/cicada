import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Badge from 'react-bootstrap/Badge';
import Toast from '../Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function InterviewSimulator() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [roundType, setRoundType] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    document.title = 'catalyst | AI Interview Simulator';
  }, []);

  const startInterview = async (selectedRoundType) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/ai/interview/start`, {
        jobId: jobId && jobId !== 'undefined' ? jobId : undefined,
        roundType: selectedRoundType
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Transform questions array (strings) into objects with question property
      const questionsWithStructure = response.data.questions.map(q => ({
        question: typeof q === 'string' ? q : q.question || q,
        userAnswer: '',
        aiFeedback: null
      }));
      
      setSession({
        ...response.data,
        questions: questionsWithStructure
      });
      setRoundType(selectedRoundType);
      setCurrentQuestion(0);
      setAnswer('');
      setFeedback(null);
      setCompleted(false);
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error starting interview');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setToastMessage('Please enter an answer');
      setShowToast(true);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/ai/interview/answer`, {
        sessionId: session.sessionId,
        questionIndex: currentQuestion,
        answer
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setFeedback(response.data.feedback);
      
      // Update the question in session with the answer and feedback
      const updatedQuestions = [...session.questions];
      updatedQuestions[currentQuestion] = {
        ...updatedQuestions[currentQuestion],
        userAnswer: answer,
        aiFeedback: response.data.feedback
      };
      setSession({
        ...session,
        questions: updatedQuestions
      });
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error submitting answer');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < session.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setFeedback(null);
      setAnswer('');
    }
  };

  const completeInterview = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/ai/interview/complete`, {
        sessionId: session.sessionId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setResults(response.data);
      setCompleted(true);
      setToastMessage('Interview completed! Check your performance analysis.');
      setShowToast(true);
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error completing interview');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const startNewInterview = () => {
    setSession(null);
    setRoundType(null);
    setCurrentQuestion(0);
    setAnswer('');
    setFeedback(null);
    setCompleted(false);
    setResults(null);
  };

  if (!session && !completed) {
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
            <div className="mb-6">
              <i 
                className="fa-solid fa-microphone text-6xl mb-4"
                style={{ color: 'var(--color-primary)' }}
              ></i>
              <h2 
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--color-text)' }}
              >
                AI Interview Simulator
              </h2>
              <p 
                className="text-lg"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Practice interviews with AI and get real-time feedback to improve your performance
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {['Technical Interview', 'HR Interview', 'Aptitude Test', 'Group Discussion'].map(round => (
                <Button
                  key={round}
                  variant="primary"
                  size="lg"
                  onClick={() => startInterview(round)}
                  disabled={loading}
                  className="p-4 h-20 flex items-center justify-center"
                >
                  <i className="fa-solid fa-comments mr-2"></i>
                  {round}
                </Button>
              ))}
            </div>
            {loading && (
              <div className="mt-4">
                <i 
                  className="fa-solid fa-spinner fa-spin text-2xl"
                  style={{ color: 'var(--color-primary)' }}
                ></i>
                <p 
                  className="mt-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  Preparing your interview...
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (completed && results) {
    const { session: sessionData, analysis } = results;
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
              background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none'
            }}
          >
            <h3 className="mb-0">
              <i className="fa-solid fa-check-circle mr-2"></i>
              Interview Completed!
            </h3>
          </Card.Header>
          <Card.Body style={{ backgroundColor: 'transparent' }}>
            <div className="text-center mb-6">
              <h1 
                className="text-5xl font-bold mb-2"
                style={{ color: 'var(--color-primary)' }}
              >
                {sessionData.overallScore}/100
              </h1>
              <p 
                className="text-xl"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Overall Score
              </p>
              <ProgressBar 
                now={sessionData.overallScore} 
                variant={sessionData.overallScore >= 80 ? 'success' : sessionData.overallScore >= 60 ? 'warning' : 'danger'}
                style={{ height: '30px' }}
                className="mt-3"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  border: '2px solid'
                }}
              >
                <Card.Body className="text-center" style={{ backgroundColor: 'transparent' }}>
                  <h6 style={{ color: 'var(--color-text-secondary)' }}>Communication</h6>
                  <h4 style={{ color: 'var(--color-text)' }}>{sessionData.performanceMetrics.communicationScore}/100</h4>
                </Card.Body>
              </Card>
              <Card
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  border: '2px solid'
                }}
              >
                <Card.Body className="text-center" style={{ backgroundColor: 'transparent' }}>
                  <h6 style={{ color: 'var(--color-text-secondary)' }}>Technical</h6>
                  <h4 style={{ color: 'var(--color-text)' }}>{sessionData.performanceMetrics.technicalScore}/100</h4>
                </Card.Body>
              </Card>
              <Card
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  border: '2px solid'
                }}
              >
                <Card.Body className="text-center" style={{ backgroundColor: 'transparent' }}>
                  <h6 style={{ color: 'var(--color-text-secondary)' }}>Confidence</h6>
                  <h4 style={{ color: 'var(--color-text)' }}>{sessionData.performanceMetrics.confidenceScore}/100</h4>
                </Card.Body>
              </Card>
              <Card
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  border: '2px solid'
                }}
              >
                <Card.Body className="text-center" style={{ backgroundColor: 'transparent' }}>
                  <h6 style={{ color: 'var(--color-text-secondary)' }}>Time Management</h6>
                  <h4 style={{ color: 'var(--color-text)' }}>{sessionData.performanceMetrics.timeManagement}/100</h4>
                </Card.Body>
              </Card>
            </div>

            {analysis.overallAnalysis && (
              <Card 
                className="mb-4"
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  border: '2px solid'
                }}
              >
                <Card.Body style={{ backgroundColor: 'transparent' }}>
                  <h5 
                    className="mb-3"
                    style={{ color: 'var(--color-text)' }}
                  >
                    Overall Analysis
                  </h5>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{analysis.overallAnalysis}</p>
                </Card.Body>
              </Card>
            )}

            <Card 
              className="mb-4 backdrop-blur-xl border-2"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              <Card.Header
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                  color: '#ffffff',
                  border: 'none'
                }}
              >
                <h5 className="mb-0">Recommendations</h5>
              </Card.Header>
              <Card.Body style={{ backgroundColor: 'transparent' }}>
                <ul className="list-unstyled">
                  {sessionData.aiRecommendations?.map((rec, i) => (
                    <li key={i} className="mb-2" style={{ color: 'var(--color-text)' }}>
                      <i 
                        className="fa-solid fa-arrow-right mr-2"
                        style={{ color: 'var(--color-primary)' }}
                      ></i>
                      {rec}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>

            <div className="flex gap-2 justify-center">
              <Button variant="primary" onClick={startNewInterview}>
                <i className="fa-solid fa-redo mr-2"></i>
                Practice Again
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/student/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </Card.Body>
        </Card>
        <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} />
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / session.questions.length) * 100;
  const question = session.questions[currentQuestion];
  const questionText = typeof question === 'string' ? question : (question?.question || question);
  const hasAnswered = question?.userAnswer && question.userAnswer.trim() !== '';

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
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            color: '#ffffff',
            border: 'none'
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="mb-0">{roundType}</h3>
              <small>Question {currentQuestion + 1} of {session.questions.length}</small>
            </div>
            <Badge 
              className="text-lg px-3 py-2"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff'
              }}
            >
              {Math.round(progress)}%
            </Badge>
          </div>
          <ProgressBar 
            now={progress} 
            variant="info"
            className="mt-2"
            style={{ height: '8px' }}
          />
        </Card.Header>
        <Card.Body style={{ backgroundColor: 'transparent' }}>
          <div className="mb-4">
            <h4 
              className="mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              {questionText}
            </h4>
            <textarea
              className="form-control"
              rows="8"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here... Be detailed and specific."
              disabled={hasAnswered && feedback}
            />
            {hasAnswered && !feedback && (
              <small 
                className="mt-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <i className="fa-solid fa-info-circle mr-1"></i>
                Submitting answer for AI feedback...
              </small>
            )}
          </div>

          {feedback && (
            <Card 
              className="mb-4 border-2"
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                borderColor: 'var(--color-primary)'
              }}
            >
              <Card.Header
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                  color: '#ffffff',
                  border: 'none'
                }}
              >
                <h5 className="mb-0">
                  <i className="fa-solid fa-robot mr-2"></i>
                  AI Feedback
                </h5>
              </Card.Header>
              <Card.Body style={{ backgroundColor: 'transparent' }}>
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <strong>Score:</strong>
                    <Badge bg={feedback.score >= 80 ? 'success' : feedback.score >= 60 ? 'warning' : 'danger'} className="text-lg px-3">
                      {feedback.score}/100
                    </Badge>
                  </div>
                  <ProgressBar 
                    now={feedback.score} 
                    variant={feedback.score >= 80 ? 'success' : feedback.score >= 60 ? 'warning' : 'danger'}
                  />
                </div>

                <div className="mb-3">
                  <strong className="text-success">
                    <i className="fa-solid fa-check-circle mr-2"></i>
                    Strengths:
                  </strong>
                  <ul className="mt-2">
                    {feedback.strengths?.map((s, i) => (
                      <li key={i} className="text-success">{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <strong className="text-warning">
                    <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                    Areas for Improvement:
                  </strong>
                  <ul className="mt-2">
                    {feedback.improvements?.map((i, idx) => (
                      <li key={idx} className="text-warning">{i}</li>
                    ))}
                  </ul>
                </div>

                {feedback.suggestedAnswer && (
                  <div 
                    className="p-3 rounded"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    <strong style={{ color: 'var(--color-primary)' }}>
                      <i className="fa-solid fa-lightbulb mr-2"></i>
                      Suggested Answer:
                    </strong>
                    <p 
                      className="mt-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {feedback.suggestedAnswer}
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          <div className="flex gap-2 flex-wrap">
            {!hasAnswered && (
              <Button
                variant="primary"
                size="lg"
                onClick={submitAnswer}
                disabled={loading || !answer.trim()}
              >
                <i className="fa-solid fa-paper-plane mr-2"></i>
                Submit Answer
              </Button>
            )}
            {feedback && currentQuestion < session.questions.length - 1 && (
              <Button variant="success" size="lg" onClick={nextQuestion}>
                <i className="fa-solid fa-arrow-right mr-2"></i>
                Next Question
              </Button>
            )}
            {feedback && currentQuestion === session.questions.length - 1 && (
              <Button variant="success" size="lg" onClick={completeInterview} disabled={loading}>
                <i className="fa-solid fa-check-circle mr-2"></i>
                Complete Interview
              </Button>
            )}
            {loading && (
              <span className="d-flex align-items-center">
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                Processing...
              </span>
            )}
          </div>
        </Card.Body>
      </Card>
      <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} />
    </div>
  );
}

export default InterviewSimulator;

