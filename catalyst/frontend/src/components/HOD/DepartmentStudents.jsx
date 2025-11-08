import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function DepartmentStudents() {
  document.title = 'catalyst | Department Students';
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: '',
    approved: ''
  });

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.year) params.append('year', filters.year);
      if (filters.approved !== '') params.append('approved', filters.approved);

      const response = await axios.get(
        `${BASE_URL}/hod/students?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
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

  return (
    <div className="p-6">
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <h3 className="mb-0">Department Students</h3>
            <div className="flex gap-2">
              <select
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                className="px-3 py-1 border rounded"
              >
                <option value="">All Years</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
              <select
                value={filters.approved}
                onChange={(e) => setFilters({ ...filters, approved: e.target.value })}
                className="px-3 py-1 border rounded"
              >
                <option value="">All</option>
                <option value="true">Approved</option>
                <option value="false">Not Approved</option>
              </select>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {students.length === 0 ? (
            <p className="text-center text-muted py-4">No students found</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Year</th>
                  <th>Roll Number</th>
                  <th>Status</th>
                  <th>Placement Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const placedJobs = student.studentProfile?.appliedJobs?.filter(j => j.status === 'hired') || [];
                  const placementStatus = placedJobs.length > 0 ? 'Placed' : 
                    (student.studentProfile?.appliedJobs?.some(j => j.status === 'interview' || j.status === 'applied') ? 'In Process' : 'Not Placed');
                  
                  return (
                    <tr key={student._id}>
                      <td>{`${student.first_name || ''} ${student.last_name || ''}`.trim() || 'N/A'}</td>
                      <td>{student.email}</td>
                      <td>{student.studentProfile?.year || 'N/A'}</td>
                      <td>{student.studentProfile?.rollNumber || 'N/A'}</td>
                      <td>
                        <Badge bg={student.studentProfile?.isApproved ? 'success' : 'warning'}>
                          {student.studentProfile?.isApproved ? 'Approved' : 'Pending'}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={placementStatus === 'Placed' ? 'success' : placementStatus === 'In Process' ? 'info' : 'secondary'}>
                          {placementStatus}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default DepartmentStudents;

