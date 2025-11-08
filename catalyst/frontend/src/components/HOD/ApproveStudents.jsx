import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Toast from '../Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function ApproveStudents() {
  document.title = 'catalyst | Approve Students';
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchUnapprovedStudents();
  }, []);

  const fetchUnapprovedStudents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/hod/students/unapproved`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setToastMessage('Error loading students');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId) => {
    try {
      await axios.post(
        `${BASE_URL}/hod/students/approve`,
        { studentId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setToastMessage('Student approved successfully');
      setShowToast(true);
      fetchUnapprovedStudents();
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error approving student');
      setShowToast(true);
    }
  };

  const handleReject = async (studentId) => {
    try {
      await axios.post(
        `${BASE_URL}/hod/students/reject`,
        { studentId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setToastMessage('Student rejected');
      setShowToast(true);
      fetchUnapprovedStudents();
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Error rejecting student');
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

  return (
    <div className="p-6">
      <Card>
        <Card.Header>
          <h3 className="mb-0">Approve Students</h3>
        </Card.Header>
        <Card.Body>
          {students.length === 0 ? (
            <p className="text-center text-muted py-4">No unapproved students</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Roll Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{`${student.first_name || ''} ${student.last_name || ''}`.trim() || 'N/A'}</td>
                    <td>{student.email}</td>
                    <td>{student.studentProfile?.department || 'N/A'}</td>
                    <td>{student.studentProfile?.year || 'N/A'}</td>
                    <td>{student.studentProfile?.rollNumber || 'N/A'}</td>
                    <td>
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(student._id)}
                        >
                          <i className="fa-solid fa-check mr-1"></i>
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(student._id)}
                        >
                          <i className="fa-solid fa-times mr-1"></i>
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} />
    </div>
  );
}

export default ApproveStudents;

