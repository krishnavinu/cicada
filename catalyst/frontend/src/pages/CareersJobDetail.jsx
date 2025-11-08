import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function CareersJobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/public/job/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <i className="fa-solid fa-spinner fa-spin text-4xl"></i>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Job not found</p>
        <Link to="/careers" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">
          Back to Careers
        </Link>
      </div>
    );
  }

  const isLoggedIn = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/careers" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">
          <i className="fa-solid fa-arrow-left mr-2"></i>Back to Careers
        </Link>

        <Card className="mb-6">
          <Card.Body className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{job.jobTitle}</h1>
                <p className="text-xl text-gray-600">{job.company?.companyName || 'Company'}</p>
              </div>
              {job.salary && (
                <Badge bg="success" className="text-lg px-4 py-2">
                  {job.salary} LPA
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
              <div>
                <i className="fa-solid fa-calendar mr-2"></i>
                Posted: {new Date(job.postedAt).toLocaleDateString()}
              </div>
              {job.applicationDeadline && (
                <div>
                  <i className="fa-solid fa-clock mr-2"></i>
                  Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Job Description</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ 
                __html: job.jobDescription?.replace(/\n/g, '<br>') || 'No description available' 
              }} />
            </div>

            {job.eligibility && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Eligibility Criteria</h2>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ 
                  __html: job.eligibility.replace(/\n/g, '<br>') 
                }} />
              </div>
            )}

            {job.howToApply && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">How to Apply</h2>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ 
                  __html: job.howToApply.replace(/\n/g, '<br>') 
                }} />
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {isLoggedIn ? (
                <>
                  <Link to={`/student/resume-builder/${jobId}`}>
                    <Button variant="primary" size="lg">
                      <i className="fa-solid fa-file-alt mr-2"></i>
                      Apply with Resume Builder
                    </Button>
                  </Link>
                  <Link to={`/student/job/${jobId}`}>
                    <Button variant="outline-primary" size="lg">
                      View Full Details
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/student/signup">
                    <Button variant="primary" size="lg">
                      Sign Up to Apply
                    </Button>
                  </Link>
                  <Link to="/student/login">
                    <Button variant="outline-primary" size="lg">
                      Login to Apply
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default CareersJobDetail;

