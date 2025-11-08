import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Toast from '../Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function DriveDetails() {
  const { driveId } = useParams();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchDrive();
  }, [driveId]);

  const fetchDrive = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/placement-drive/${driveId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDrive(response.data.drive);
    } catch (error) {
      setToastMessage('Error fetching drive details');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const registerForDrive = async () => {
    try {
      await axios.post(`${BASE_URL}/placement-drive/${driveId}/register`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setToastMessage('Registered successfully for placement drive!');
      setShowToast(true);
      fetchDrive();
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error registering');
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <i className="fa-solid fa-spinner fa-spin text-4xl"></i>
      </div>
    );
  }

  if (!drive) {
    return <div className="text-center py-12">Drive not found</div>;
  }

  const isRegistered = drive.registeredStudents?.some(
    student => student._id === localStorage.getItem('userId')
  );

  return (
    <>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{drive.driveName}</h2>
              <p className="text-gray-600">
                <strong>Company:</strong> {drive.company?.companyName || 'Unknown'}
              </p>
            </div>
            <Badge bg={drive.status === 'upcoming' ? 'primary' : drive.status === 'ongoing' ? 'success' : 'secondary'}>
              {drive.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <strong>Drive Date:</strong>{' '}
              {new Date(drive.driveDate).toLocaleString()}
            </div>
            <div>
              <strong>Registration Deadline:</strong>{' '}
              {new Date(drive.registrationDeadline).toLocaleString()}
            </div>
            {drive.venue && (
              <div>
                <strong>Venue:</strong> {drive.venue}
              </div>
            )}
            <div>
              <strong>Registered Students:</strong> {drive.registeredStudents?.length || 0}
            </div>
          </div>

          {/* Eligibility Criteria */}
          {drive.eligibilityCriteria && (
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Eligibility Criteria</h3>
              <ul className="list-disc list-inside">
                {drive.eligibilityCriteria.departments?.length > 0 && (
                  <li>Departments: {drive.eligibilityCriteria.departments.join(', ')}</li>
                )}
                {drive.eligibilityCriteria.minCGPA && (
                  <li>Minimum CGPA: {drive.eligibilityCriteria.minCGPA}</li>
                )}
                {drive.eligibilityCriteria.year?.length > 0 && (
                  <li>Years: {drive.eligibilityCriteria.year.join(', ')}</li>
                )}
                <li>Backlogs Allowed: {drive.eligibilityCriteria.backlogsAllowed || 0}</li>
              </ul>
            </div>
          )}

          {/* Register Button for Students */}
          {localStorage.getItem('role') === 'student' && (
            <div className="mb-4">
              {isRegistered ? (
                <Badge bg="success">You are registered for this drive</Badge>
              ) : (
                <Button variant="primary" onClick={registerForDrive}>
                  Register for Drive
                </Button>
              )}
            </div>
          )}

          {/* Job Postings */}
          {drive.jobPostings && drive.jobPostings.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Job Postings</h3>
              <ul className="list-disc list-inside">
                {drive.jobPostings.map((job, index) => (
                  <li key={index}>
                    {job.jobTitle} - {job.salary ? `${job.salary} LPA` : 'Salary not specified'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Registered Students (for TPO/Admin) */}
          {drive.registeredStudents && drive.registeredStudents.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Registered Students</h3>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {drive.registeredStudents.map((student, index) => (
                    <tr key={student._id}>
                      <td>{index + 1}</td>
                      <td>{student.first_name} {student.last_name}</td>
                      <td>{student.email}</td>
                      <td>{student.studentProfile?.department || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DriveDetails;

