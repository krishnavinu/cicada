import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function DriveList() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, ongoing, completed

  useEffect(() => {
    fetchDrives();
  }, [filter]);

  const fetchDrives = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/placement-drive/all${filter !== 'all' ? `?status=${filter}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setDrives(response.data.drives || []);
    } catch (error) {
      console.error('Error fetching drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: 'primary',
      ongoing: 'success',
      completed: 'secondary',
      cancelled: 'danger'
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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Placement Drives</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="all">All Drives</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <Link
            to="/tpo/create-drive"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <i className="fa-solid fa-plus mr-2"></i>Create Drive
          </Link>
        </div>
      </div>

      {drives.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded">
          <p className="text-gray-500">No placement drives found</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Drive Name</th>
              <th>Company</th>
              <th>Drive Date</th>
              <th>Registration Deadline</th>
              <th>Registered</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drives.map((drive, index) => (
              <tr key={drive._id}>
                <td>{index + 1}</td>
                <td>{drive.driveName}</td>
                <td>{drive.company?.companyName || 'Unknown'}</td>
                <td>{new Date(drive.driveDate).toLocaleDateString()}</td>
                <td>{new Date(drive.registrationDeadline).toLocaleDateString()}</td>
                <td>{drive.registeredStudents?.length || 0}</td>
                <td>{getStatusBadge(drive.status)}</td>
                <td>
                  <Link
                    to={`/tpo/placement-drive/${drive._id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <i className="fa-solid fa-eye mr-2"></i>View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default DriveList;

