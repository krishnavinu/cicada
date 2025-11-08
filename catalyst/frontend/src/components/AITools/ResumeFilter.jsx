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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/jobs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const filterResumes = async () => {
    if (!selectedJob) {
      setToastMessage('Please select a job');
      setShowToast(true);
      return;
    }

    setLoading(true);
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
      setFilterResults(response.data);
      setToastMessage('Resumes filtered successfully!');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Error filtering resumes');
      setShowToast(true);
      console.error('Error filtering resumes:', error);
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
            >
              <option value="">Select a job to filter resumes</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>
                  {job.jobTitle} - {job.company?.companyName || 'Unknown'}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          <Button
            variant="primary"
            className="mt-4"
            onClick={filterResumes}
            disabled={loading || !selectedJob}
          >
            {loading ? 'Filtering...' : 'Filter Resumes'}
          </Button>
        </div>

        {filterResults && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-600">Total Applicants</h3>
                <p className="text-2xl font-bold">{filterResults.totalApplicants}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-600">Shortlisted</h3>
                <p className="text-2xl font-bold">{filterResults.shortlisted}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-600">Maybe</h3>
                <p className="text-2xl font-bold">{filterResults.maybe}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-600">Rejected</h3>
                <p className="text-2xl font-bold">{filterResults.rejected}</p>
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

