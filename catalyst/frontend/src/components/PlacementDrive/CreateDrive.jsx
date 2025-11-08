import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Toast from '../Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function CreateDrive() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    driveName: '',
    company: '',
    jobPostings: [],
    driveDate: '',
    registrationDeadline: '',
    venue: '',
    eligibilityCriteria: {
      departments: [],
      minCGPA: '',
      year: [],
      backlogsAllowed: 0
    }
  });

  useEffect(() => {
    fetchCompanies();
    fetchJobs();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-detail`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCompanies(response.data.companys || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('eligibility.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        eligibilityCriteria: {
          ...prev.eligibilityCriteria,
          [field]: field === 'departments' || field === 'year' 
            ? value.split(',').map(v => v.trim()).filter(v => v)
            : field === 'minCGPA' || field === 'backlogsAllowed'
            ? parseFloat(value) || 0
            : value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleJobSelection = (jobId) => {
    setFormData(prev => ({
      ...prev,
      jobPostings: prev.jobPostings.includes(jobId)
        ? prev.jobPostings.filter(id => id !== jobId)
        : [...prev.jobPostings, jobId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/placement-drive/create`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setToastMessage('Placement drive created successfully!');
      setShowToast(true);
      setTimeout(() => {
        navigate('/tpo/placement-drives');
      }, 2000);
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error creating drive');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Computer', 'Civil', 'ECS', 'AIDS', 'Mechanical'];
  const years = [1, 2, 3, 4];

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
        <h2 className="text-2xl font-bold mb-6">Create Placement Drive</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FloatingLabel label="Drive Name *">
              <Form.Control
                type="text"
                name="driveName"
                value={formData.driveName}
                onChange={handleChange}
                required
              />
            </FloatingLabel>

            <FloatingLabel label="Select Company *">
              <Form.Select
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              >
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company._id} value={company._id}>
                    {company.companyName}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel label="Drive Date *">
              <Form.Control
                type="datetime-local"
                name="driveDate"
                value={formData.driveDate}
                onChange={handleChange}
                required
              />
            </FloatingLabel>

            <FloatingLabel label="Registration Deadline *">
              <Form.Control
                type="datetime-local"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                required
              />
            </FloatingLabel>

            <FloatingLabel label="Venue">
              <Form.Control
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g., Main Auditorium"
              />
            </FloatingLabel>
          </div>

          {/* Eligibility Criteria */}
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-3">Eligibility Criteria</h3>
            
            <div className="mb-3">
              <label className="block mb-2">Departments (comma separated)</label>
              <Form.Control
                type="text"
                name="eligibility.departments"
                value={formData.eligibilityCriteria.departments.join(', ')}
                onChange={handleChange}
                placeholder="e.g., Computer, ECS, AIDS"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <FloatingLabel label="Minimum CGPA">
                <Form.Control
                  type="number"
                  step="0.01"
                  name="eligibility.minCGPA"
                  value={formData.eligibilityCriteria.minCGPA}
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel label="Backlogs Allowed">
                <Form.Control
                  type="number"
                  name="eligibility.backlogsAllowed"
                  value={formData.eligibilityCriteria.backlogsAllowed}
                  onChange={handleChange}
                />
              </FloatingLabel>
            </div>

            <div>
              <label className="block mb-2">Years (comma separated)</label>
              <Form.Control
                type="text"
                name="eligibility.year"
                value={formData.eligibilityCriteria.year.join(', ')}
                onChange={handleChange}
                placeholder="e.g., 3, 4"
              />
            </div>
          </div>

          {/* Job Postings */}
          <div className="mb-4">
            <h3 className="font-semibold mb-3">Select Job Postings</h3>
            <div className="max-h-48 overflow-y-auto border p-3 rounded">
              {jobs.length === 0 ? (
                <p className="text-gray-500">No jobs available</p>
              ) : (
                jobs.map(job => (
                  <Form.Check
                    key={job._id}
                    type="checkbox"
                    label={`${job.jobTitle} - ${job.company?.companyName || 'Unknown'}`}
                    checked={formData.jobPostings.includes(job._id)}
                    onChange={() => handleJobSelection(job._id)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Drive'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/tpo/placement-drives')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateDrive;

