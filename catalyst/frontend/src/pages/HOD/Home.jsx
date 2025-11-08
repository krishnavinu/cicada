import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AnimatedBackground from '../../components/UI/AnimatedBackground';
import GlassCard from '../../components/UI/GlassCard';
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
      <div className="relative min-h-screen flex justify-center items-center">
        <AnimatedBackground intensity="low" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="relative min-h-screen flex justify-center items-center">
        <AnimatedBackground intensity="low" />
        <div className="relative z-10">
          <GlassCard className="p-8 text-center">
            <p className="text-red-500 text-lg">Error loading dashboard</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  const yearWiseData = Object.entries(stats.statistics.yearWise || {}).map(([year, data]) => ({
    year: `Year ${year}`,
    total: data.total,
    approved: data.approved,
    placed: data.placed
  }));

  return (
    <div className="relative min-h-screen p-6">
      <AnimatedBackground intensity="low" />
      <div className="relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-3 shadow-lg bounce-icon">
              <i className="fa-solid fa-chart-line text-white text-2xl"></i>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 gradient-text">
                {stats.department} Department Dashboard
              </h1>
              <p className="text-gray-600 font-medium">Head of Department Portal</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard hoverable={true} glow={true} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-3">
                <i className="fa-solid fa-users text-white text-xl"></i>
              </div>
            </div>
            <h6 className="text-sm font-medium text-gray-600 mb-2">Total Students</h6>
            <h2 className="text-4xl font-bold gradient-text">
              {stats.statistics.totalStudents}
            </h2>
          </GlassCard>
          
          <GlassCard hoverable={true} glow={true} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-3">
                <i className="fa-solid fa-check-circle text-white text-xl"></i>
              </div>
            </div>
            <h6 className="text-sm font-medium text-gray-600 mb-2">Approved Students</h6>
            <h2 className="text-4xl font-bold" style={{ color: 'var(--color-success)' }}>
              {stats.statistics.approvedStudents}
            </h2>
          </GlassCard>
          
          <GlassCard hoverable={true} glow={true} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-3">
                <i className="fa-solid fa-briefcase text-white text-xl"></i>
              </div>
            </div>
            <h6 className="text-sm font-medium text-gray-600 mb-2">Placed Students</h6>
            <h2 className="text-4xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {stats.statistics.placement.placed}
            </h2>
          </GlassCard>
          
          <GlassCard hoverable={true} glow={true} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-3">
                <i className="fa-solid fa-rupee-sign text-white text-xl"></i>
              </div>
            </div>
            <h6 className="text-sm font-medium text-gray-600 mb-2">Average Package</h6>
            <h2 className="text-4xl font-bold" style={{ color: 'var(--color-info)' }}>
              ₹{stats.statistics.averagePackage} LPA
            </h2>
          </GlassCard>
        </div>

        {/* Placement Statistics */}
        <GlassCard hoverable={true} glow={true} className="mb-8 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 shadow-lg">
              <i className="fa-solid fa-chart-pie text-white text-lg"></i>
            </div>
            <h3 className="text-2xl font-bold gradient-text">Placement Statistics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:shadow-lg transition-all duration-300">
              <Badge 
                className="text-lg px-6 py-3 w-full"
                style={{
                  background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none'
                }}
              >
                {stats.statistics.placement.placed} Placed
              </Badge>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:shadow-lg transition-all duration-300">
              <Badge 
                className="text-lg px-6 py-3 w-full"
                style={{
                  background: 'linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%)',
                  color: '#ffffff',
                  border: 'none'
                }}
              >
                {stats.statistics.placement.inProcess} In Process
              </Badge>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 hover:shadow-lg transition-all duration-300">
              <Badge 
                className="text-lg px-6 py-3 w-full"
                style={{
                  background: 'linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%)',
                  color: '#ffffff',
                  border: 'none'
                }}
              >
                {stats.statistics.placement.unplaced} Unplaced
              </Badge>
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
            <p className="text-lg font-semibold gradient-text">
              Placement Rate: {stats.statistics.placement.placementRate}%
            </p>
          </div>
        </GlassCard>

        {/* Year-wise Chart */}
        {yearWiseData.length > 0 && (
          <GlassCard hoverable={true} glow={true} className="mb-8 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 shadow-lg">
                <i className="fa-solid fa-chart-bar text-white text-lg"></i>
              </div>
              <h3 className="text-2xl font-bold gradient-text">Year-wise Statistics</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearWiseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="year" stroke="var(--color-text)" />
                <YAxis stroke="var(--color-text)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    borderRadius: '12px'
                  }}
                />
                <Legend wrapperStyle={{ color: 'var(--color-text)' }} />
                <Bar dataKey="total" fill="var(--color-primary)" name="Total" radius={[8, 8, 0, 0]} />
                <Bar dataKey="approved" fill="var(--color-success)" name="Approved" radius={[8, 8, 0, 0]} />
                <Bar dataKey="placed" fill="var(--color-warning)" name="Placed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        )}

        {/* Top Companies */}
        {stats.statistics.topCompanies && stats.statistics.topCompanies.length > 0 && (
          <GlassCard hoverable={true} glow={true} className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 shadow-lg">
                <i className="fa-solid fa-building text-white text-lg"></i>
              </div>
              <h3 className="text-2xl font-bold gradient-text">Top Recruiting Companies</h3>
            </div>
            <div className="space-y-3">
              {stats.statistics.topCompanies.map((company, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 rounded-xl border-2 border-blue-200/50 bg-white/50 backdrop-blur-sm hover:bg-white/70 hover:border-blue-300/70 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <span className="text-gray-800 font-medium">{company.name}</span>
                  <Badge 
                    className="px-4 py-2 text-sm"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                      color: '#ffffff',
                      border: 'none'
                    }}
                  >
                    {company.count} students
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

export default HODHome;

