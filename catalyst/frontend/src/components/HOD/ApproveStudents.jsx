import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Toast from '../Toast';
import AnimatedBackground from '../UI/AnimatedBackground';
import GlassCard from '../UI/GlassCard';
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
      <div className="relative min-h-screen flex justify-center items-center">
        <AnimatedBackground intensity="low" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-gray-600 font-medium">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-6">
      <AnimatedBackground intensity="low" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <GlassCard hoverable={false} glow={true} className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 shadow-lg bounce-icon">
              <i className="fa-solid fa-user-check text-white text-lg"></i>
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-0">Approve Students</h3>
          </div>
          
          {students.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <i className="fa-solid fa-check-circle text-green-500 text-4xl"></i>
              </div>
              <p className="text-gray-600 text-lg font-medium">No unapproved students</p>
              <p className="text-gray-500 text-sm mt-2">All students have been processed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table striped bordered hover responsive className="table-hover">
                <thead>
                  <tr style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                    <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Department</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Year</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Roll Number</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr 
                      key={student._id}
                      className="hover:bg-blue-50/50 transition-colors duration-200"
                    >
                      <td className="px-4 py-3 text-gray-800">{`${student.first_name || ''} ${student.last_name || ''}`.trim() || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-700">{student.email}</td>
                      <td className="px-4 py-3 text-gray-700">{student.studentProfile?.department || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-700">{student.studentProfile?.year || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-700">{student.studentProfile?.rollNumber || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApprove(student._id)}
                            className="gradient-button"
                            style={{
                              background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
                              border: 'none',
                              color: '#ffffff'
                            }}
                          >
                            <i className="fa-solid fa-check mr-1"></i>
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(student._id)}
                            style={{
                              background: 'linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%)',
                              border: 'none',
                              color: '#ffffff'
                            }}
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
            </div>
          )}
        </GlassCard>
      </div>
      <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} />
    </div>
  );
}

export default ApproveStudents;

