import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function HODHome() {
  document.title = 'catalyst | HOD Dashboard';
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/hod/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  if (!stats) {
    return <div>Error loading dashboard</div>;
  }

  const yearWiseData = Object.entries(stats.statistics.yearWise || {}).map(([year, data]) => ({
    year: `Year ${year}`,
    total: data.total,
    approved: data.approved,
    placed: data.placed
  }));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: 'var(--color-text)' }}
        >
          {stats.department} Department Dashboard
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Head of Department Portal</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card 
          className="backdrop-blur-xl border-2 shadow-lg"
          style={{
            background: 'rgba(36, 30, 42, 0.7)',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Card.Body>
            <h6 
              className="mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Total Students
            </h6>
            <h2 
              className="text-3xl font-bold"
              style={{ color: 'var(--color-text)' }}
            >
              {stats.statistics.totalStudents}
            </h2>
          </Card.Body>
        </Card>
        <Card 
          className="backdrop-blur-xl border-2 shadow-lg"
          style={{
            background: 'rgba(36, 30, 42, 0.7)',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Card.Body>
            <h6 
              className="mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Approved Students
            </h6>
            <h2 
              className="text-3xl font-bold"
              style={{ color: 'var(--color-success)' }}
            >
              {stats.statistics.approvedStudents}
            </h2>
          </Card.Body>
        </Card>
        <Card 
          className="backdrop-blur-xl border-2 shadow-lg"
          style={{
            background: 'rgba(36, 30, 42, 0.7)',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Card.Body>
            <h6 
              className="mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Placed Students
            </h6>
            <h2 
              className="text-3xl font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              {stats.statistics.placement.placed}
            </h2>
          </Card.Body>
        </Card>
        <Card 
          className="backdrop-blur-xl border-2 shadow-lg"
          style={{
            background: 'rgba(36, 30, 42, 0.7)',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Card.Body>
            <h6 
              className="mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Average Package
            </h6>
            <h2 
              className="text-3xl font-bold"
              style={{ color: 'var(--color-info)' }}
            >
              ₹{stats.statistics.averagePackage} LPA
            </h2>
          </Card.Body>
        </Card>
      </div>

      {/* Placement Statistics */}
      <Card 
        className="mb-6 backdrop-blur-xl border-2 shadow-lg"
        style={{
          background: 'rgba(36, 30, 42, 0.7)',
          borderColor: 'rgba(139, 92, 246, 0.3)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <Card.Header
          style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            color: '#ffffff',
            border: 'none'
          }}
        >
          <h3>Placement Statistics</h3>
        </Card.Header>
        <Card.Body style={{ backgroundColor: 'transparent' }}>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Badge 
                className="text-lg px-4 py-2"
                style={{
                  background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
                  color: '#ffffff'
                }}
              >
                {stats.statistics.placement.placed} Placed
              </Badge>
            </div>
            <div className="text-center">
              <Badge 
                className="text-lg px-4 py-2"
                style={{
                  background: 'linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%)',
                  color: '#ffffff'
                }}
              >
                {stats.statistics.placement.inProcess} In Process
              </Badge>
            </div>
            <div className="text-center">
              <Badge 
                className="text-lg px-4 py-2"
                style={{
                  background: 'linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%)',
                  color: '#ffffff'
                }}
              >
                {stats.statistics.placement.unplaced} Unplaced
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <p 
              className="text-center"
              style={{ color: 'var(--color-text)' }}
            >
              <strong>Placement Rate:</strong> {stats.statistics.placement.placementRate}%
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Year-wise Chart */}
      {yearWiseData.length > 0 && (
        <Card 
          className="mb-6 backdrop-blur-xl border-2 shadow-lg"
          style={{
            background: 'rgba(36, 30, 42, 0.7)',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Card.Header
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              color: '#ffffff',
              border: 'none'
            }}
          >
            <h3>Year-wise Statistics</h3>
          </Card.Header>
          <Card.Body style={{ backgroundColor: 'transparent' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearWiseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="year" stroke="var(--color-text)" />
                <YAxis stroke="var(--color-text)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
                <Legend wrapperStyle={{ color: 'var(--color-text)' }} />
                <Bar dataKey="total" fill="var(--color-primary)" name="Total" />
                <Bar dataKey="approved" fill="var(--color-success)" name="Approved" />
                <Bar dataKey="placed" fill="var(--color-warning)" name="Placed" />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      )}

      {/* Top Companies */}
      {stats.statistics.topCompanies && stats.statistics.topCompanies.length > 0 && (
        <Card 
          className="backdrop-blur-xl border-2 shadow-lg"
          style={{
            background: 'rgba(36, 30, 42, 0.7)',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Card.Header
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              color: '#ffffff',
              border: 'none'
            }}
          >
            <h3>Top Recruiting Companies</h3>
          </Card.Header>
          <Card.Body style={{ backgroundColor: 'transparent' }}>
            <ul className="list-unstyled">
              {stats.statistics.topCompanies.map((company, i) => (
                <li 
                  key={i} 
                  className="mb-2 flex justify-between items-center p-2 rounded transition-all duration-300"
                  style={{
                    backgroundColor: i % 2 === 0 ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                    border: '1px solid var(--color-border)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';
                  }}
                >
                  <span style={{ color: 'var(--color-text)' }}>{company.name}</span>
                  <Badge 
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                      color: '#ffffff'
                    }}
                  >
                    {company.count} students
                  </Badge>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default HODHome;

