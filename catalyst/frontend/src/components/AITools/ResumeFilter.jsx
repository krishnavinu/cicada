import { useState, useEffect } from 'react';
import axios from 'axios';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Toast from '../Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function ResumeFilter() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [filterResults, setFilterResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const response = await axios.get(`${BASE_URL}/tpo/jobs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Backend returns { data: jobs }, so use response.data.data
      const jobsData = response.data.data || response.data.jobs || [];
      console.log('Fetched jobs:', jobsData); // Debug log
      setJobs(jobsData);
      if (jobsData.length === 0) {
        setToastMessage('No jobs found. Please post a job first.');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error.response?.data || error);
      setToastMessage(error.response?.data?.msg || 'Error loading jobs. Please refresh the page.');
      setShowToast(true);
    } finally {
      setLoadingJobs(false);
    }
  };

  const filterResumes = async () => {
    if (!selectedJob) {
      setToastMessage('Please select a job');
      setShowToast(true);
      return;
    }

    setLoading(true);
    setFilterResults(null); // Clear previous results
    try {
      const response = await axios.post(
        `${BASE_URL}/ai/resume/filter`,
        { jobId: selectedJob },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.filteredResults && response.data.filteredResults.length > 0) {
        setFilterResults(response.data);
        setToastMessage('Resumes filtered successfully!');
      } else if (response.data.msg) {
        setToastMessage(response.data.msg);
        setFilterResults({
          totalApplicants: 0,
          filteredResults: [],
          shortlisted: 0,
          maybe: 0,
          rejected: 0
        });
      } else {
        setFilterResults(response.data);
        setToastMessage('Resumes filtered successfully!');
      }
      setShowToast(true);
    } catch (error) {
      const errorMsg = error.response?.data?.msg || error.response?.data?.error || 'Error filtering resumes. Please try again.';
      setToastMessage(errorMsg);
      setShowToast(true);
      console.error('Error filtering resumes:', error.response?.data || error);
      setFilterResults(null);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationBadge = (recommendation) => {
    const badges = {
      shortlist: 'success',
      maybe: 'warning',
      reject: 'danger'
    };
    return (
      <Badge bg={badges[recommendation] || 'secondary'}>
        {recommendation}
      </Badge>
    );
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

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">AI Resume Filter</h2>

        <div className="mb-6">
          <FloatingLabel label="Select Job">
            <Form.Select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              disabled={loadingJobs}
            >
              <option value="">
                {loadingJobs ? 'Loading jobs...' : jobs.length === 0 ? 'No jobs available' : 'Select a job to filter resumes'}
              </option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>
                  {job.jobTitle} - {job.company?.companyName || job.company || 'Unknown'}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          {jobs.length === 0 && !loadingJobs && (
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
              No jobs found. Please post a job first in the Job Listings section.
            </p>
          )}
          <Button
            variant="primary"
            className="mt-4"
            onClick={filterResumes}
            disabled={loading || !selectedJob || loadingJobs}
          >
            {loading ? 'Filtering...' : 'Filter Resumes'}
          </Button>
        </div>

        {filterResults && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg text-center backdrop-blur-xl border-2" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                <h3 className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Applicants</h3>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{filterResults.totalApplicants}</p>
              </div>
              <div className="p-4 rounded-lg text-center backdrop-blur-xl border-2" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
                <h3 className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Shortlisted</h3>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>{filterResults.shortlisted}</p>
              </div>
              <div className="p-4 rounded-lg text-center backdrop-blur-xl border-2" style={{ background: 'rgba(234, 179, 8, 0.1)', borderColor: 'rgba(234, 179, 8, 0.2)' }}>
                <h3 className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Maybe</h3>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-warning)' }}>{filterResults.maybe}</p>
              </div>
              <div className="p-4 rounded-lg text-center backdrop-blur-xl border-2" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                <h3 className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Rejected</h3>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-error)' }}>{filterResults.rejected}</p>
              </div>
            </div>

            {/* Filtered Results Table */}
            <div className="overflow-x-auto">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>CGPA</th>
                    <th>Match Score</th>
                    <th>Recommendation</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filterResults.filteredResults.map((result, index) => (
                    <tr key={result.applicantId}>
                      <td>{index + 1}</td>
                      <td>{result.applicantName}</td>
                      <td>{result.email}</td>
                      <td>{result.department}</td>
                      <td>{result.year}</td>
                      <td>{result.cgpa}</td>
                      <td>
                        <Badge bg={result.matchScore >= 80 ? 'success' : result.matchScore >= 60 ? 'warning' : 'danger'}>
                          {result.matchScore}%
                        </Badge>
                      </td>
                      <td>{getRecommendationBadge(result.recommendation)}</td>
                      <td className="text-sm">{result.reason}</td>
                      <td>
                        {result.resume && (
                          <a
                            href={result.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <i className="fa-solid fa-file-pdf"></i> View Resume
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Matches and Gaps (expandable) */}
            {filterResults.filteredResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Detailed Analysis</h3>
                <div className="space-y-4">
                  {filterResults.filteredResults.map((result, index) => (
                    <div key={index} className="border rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{result.applicantName}</h4>
                        <Badge bg={result.matchScore >= 80 ? 'success' : result.matchScore >= 60 ? 'warning' : 'danger'}>
                          {result.matchScore}% Match
                        </Badge>
                      </div>
                      {result.matches && result.matches.length > 0 && (
                        <div className="mb-2">
                          <strong className="text-green-600">Matches:</strong>
                          <ul className="list-disc list-inside ml-4">
                            {result.matches.map((match, idx) => (
                              <li key={idx} className="text-sm">{match}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {result.gaps && result.gaps.length > 0 && (
                        <div>
                          <strong className="text-red-600">Gaps:</strong>
                          <ul className="list-disc list-inside ml-4">
                            {result.gaps.map((gap, idx) => (
                              <li key={idx} className="text-sm">{gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default ResumeFilter;

