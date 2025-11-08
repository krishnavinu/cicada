import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/analytics/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <i className="fa-solid fa-spinner fa-spin text-4xl"></i>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-12">No data available</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Total Students</h3>
          <p className="text-3xl font-bold">{stats.overview.totalStudents}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Placed Students</h3>
          <p className="text-3xl font-bold">{stats.overview.placedStudents}</p>
          <p className="text-sm text-gray-600 mt-1">
            {stats.overview.placementRate}% Placement Rate
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Total Jobs</h3>
          <p className="text-3xl font-bold">{stats.overview.totalJobs}</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Avg Package</h3>
          <p className="text-3xl font-bold">
            {stats.overview.averagePackage > 0 
              ? `${stats.overview.averagePackage} LPA` 
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Department Stats Chart */}
        {stats.departmentStats && stats.departmentStats.length > 0 && (
          <div 
            className="p-6 rounded-lg shadow"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)'
            }}
          >
            <h3 className="text-xl font-semibold mb-4">Department-wise Placement</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.departmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total" />
                <Bar dataKey="placed" fill="#82ca9d" name="Placed" />
                <Bar dataKey="unplaced" fill="#ffc658" name="Unplaced" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Year Stats Chart */}
        {stats.yearStats && stats.yearStats.length > 0 && (
          <div 
            className="p-6 rounded-lg shadow"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)'
            }}
          >
            <h3 className="text-xl font-semibold mb-4">Year-wise Placement</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.yearStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total" />
                <Bar dataKey="placed" fill="#82ca9d" name="Placed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Package Stats */}
      {stats.packageStats && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Package Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div 
              className="text-center p-4 rounded"
              style={{
                backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Average</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {stats.packageStats.average > 0 
                  ? `${stats.packageStats.average} LPA` 
                  : 'N/A'}
              </p>
            </div>
            <div 
              className="text-center p-4 rounded"
              style={{
                backgroundColor: 'rgba(var(--color-success-rgb, 5, 150, 105), 0.1)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Maximum</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>
                {stats.packageStats.max > 0 
                  ? `${stats.packageStats.max} LPA` 
                  : 'N/A'}
              </p>
            </div>
            <div 
              className="text-center p-4 rounded"
              style={{
                backgroundColor: 'rgba(var(--color-warning-rgb, 245, 158, 11), 0.1)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Minimum</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-warning)' }}>
                {stats.packageStats.min > 0 
                  ? `${stats.packageStats.min} LPA` 
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Jobs */}
        {stats.recentJobs && stats.recentJobs.length > 0 && (
          <div 
            className="p-6 rounded-lg shadow"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)'
            }}
          >
            <h3 className="text-xl font-semibold mb-4">Recent Job Postings</h3>
            <div className="space-y-3">
              {stats.recentJobs.map((job, index) => (
                <div key={index} className="border-b pb-3">
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(job.postedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Drives */}
        {stats.upcomingDrives && stats.upcomingDrives.length > 0 && (
          <div 
            className="p-6 rounded-lg shadow"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)'
            }}
          >
            <h3 className="text-xl font-semibold mb-4">Upcoming Placement Drives</h3>
            <div className="space-y-3">
              {stats.upcomingDrives.map((drive, index) => (
                <div 
                  key={index} 
                  className="pb-3"
                  style={{
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{drive.name}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{drive.company}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {new Date(drive.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

