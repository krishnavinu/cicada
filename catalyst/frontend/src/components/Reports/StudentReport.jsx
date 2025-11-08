import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function StudentReport() {
  const { studentId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (studentId) {
      fetchReport();
    }
  }, [studentId]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/reports/student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setReport(response.data.report);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      applied: 'primary',
      interview: 'warning',
      hired: 'success',
      rejected: 'danger'
    };
    return <Badge bg={badges[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <i className="fa-solid fa-spinner fa-spin text-4xl"></i>
      </div>
    );
  }

  if (!report) {
    return <div className="text-center py-12">Report not found</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Student Report</h2>

      {/* Student Info */}
      <div 
        className="rounded-lg shadow p-6 mb-6"
        style={{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)'
        }}
      >
        <h3 className="text-xl font-semibold mb-4">Student Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Name:</strong> {report.studentInfo.name}
          </div>
          <div>
            <strong>Email:</strong> {report.studentInfo.email}
          </div>
          <div>
            <strong>Department:</strong> {report.studentInfo.department}
          </div>
          <div>
            <strong>Year:</strong> {report.studentInfo.year}
          </div>
          <div>
            <strong>CGPA:</strong> {report.studentInfo.cgpa}
          </div>
          <div>
            <strong>Roll Number:</strong> {report.studentInfo.rollNumber}
          </div>
        </div>
      </div>

      {/* Application Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div 
          className="p-4 rounded-lg text-center"
          style={{
            backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)',
            color: 'var(--color-text)'
          }}
        >
          <h3 className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Applied</h3>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{report.applicationStats.totalApplied}</p>
        </div>
        <div 
          className="p-4 rounded-lg text-center"
          style={{
            backgroundColor: 'rgba(var(--color-warning-rgb, 245, 158, 11), 0.1)',
            color: 'var(--color-text)'
          }}
        >
          <h3 className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Interviews</h3>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-warning)' }}>{report.applicationStats.interviews}</p>
        </div>
        <div 
          className="p-4 rounded-lg text-center"
          style={{
            backgroundColor: 'rgba(var(--color-success-rgb, 5, 150, 105), 0.1)',
            color: 'var(--color-text)'
          }}
        >
          <h3 className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Hired</h3>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>{report.applicationStats.hired}</p>
        </div>
        <div 
          className="p-4 rounded-lg text-center"
          style={{
            backgroundColor: 'rgba(var(--color-error-rgb, 220, 38, 38), 0.1)',
            color: 'var(--color-text)'
          }}
        >
          <h3 className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Rejected</h3>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-error)' }}>{report.applicationStats.rejected}</p>
        </div>
        <div 
          className="p-4 rounded-lg text-center"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)'
          }}
        >
          <h3 className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Pending</h3>
          <p className="text-2xl font-bold">{report.applicationStats.pending}</p>
        </div>
      </div>

      {/* Applications Table */}
      <div 
        className="rounded-lg shadow"
        style={{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)'
        }}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Application History</h3>
          {report.applications && report.applications.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Package (LPA)</th>
                </tr>
              </thead>
              <tbody>
                {report.applications.map((app, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{app.company}</td>
                    <td>{app.position}</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                    <td>{app.package > 0 ? `${app.package} LPA` : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-8">No applications found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentReport;

