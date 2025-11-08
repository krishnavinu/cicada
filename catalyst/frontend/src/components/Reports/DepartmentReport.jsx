import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from 'react-bootstrap/Button';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function DepartmentReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    year: '',
    department: ''
  });

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.year) params.append('year', filters.year);
      if (filters.department) params.append('department', filters.department);

      const response = await axios.get(
        `${BASE_URL}/reports/department?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data && response.data.report) {
        setReport(response.data.report);
      } else {
        setReport({ departments: {} });
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      setReport({ departments: {} });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const chartData = report?.departments ? Object.keys(report.departments).map(dept => {
    const deptData = report.departments[dept];
    return {
      department: dept,
      total: deptData?.total || 0,
      placed: deptData?.placed || 0,
      unplaced: deptData?.unplaced || 0
    };
  }) : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <i className="fa-solid fa-spinner fa-spin text-4xl"></i>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Department-wise Report</h2>
        <div className="flex gap-4">
          <select
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="px-4 py-2 border rounded transition-all"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = `0 0 0 2px rgba(var(--color-primary-rgb), 0.2)`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="px-4 py-2 border rounded transition-all"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = `0 0 0 2px rgba(var(--color-primary-rgb), 0.2)`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="">All Departments</option>
            <option value="Computer">Computer</option>
            <option value="Civil">Civil</option>
            <option value="ECS">ECS</option>
            <option value="AIDS">AIDS</option>
            <option value="Mechanical">Mechanical</option>
          </select>
          <Button variant="primary" onClick={fetchReport}>
            Apply Filters
          </Button>
          {report && (
            <>
              <Button 
                variant="success" 
                onClick={async () => {
                  try {
                    const params = new URLSearchParams();
                    if (filters.year) params.append('year', filters.year);
                    if (filters.department) params.append('department', filters.department);
                    
                    const response = await axios.get(
                      `${BASE_URL}/reports/department/export/excel?${params.toString()}`,
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('token')}`
                        },
                        responseType: 'blob'
                      }
                    );
                    
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `department-report-${Date.now()}.xlsx`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  } catch (error) {
                    console.error('Error exporting Excel:', error);
                    alert('Error exporting Excel file');
                  }
                }}
              >
                <i className="fa-solid fa-file-excel mr-2"></i>
                Export Excel
              </Button>
              <Button 
                variant="danger" 
                onClick={async () => {
                  try {
                    const params = new URLSearchParams();
                    if (filters.year) params.append('year', filters.year);
                    if (filters.department) params.append('department', filters.department);
                    
                    const response = await axios.get(
                      `${BASE_URL}/reports/department/export/pdf?${params.toString()}`,
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('token')}`
                        },
                        responseType: 'blob'
                      }
                    );
                    
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `department-report-${Date.now()}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  } catch (error) {
                    console.error('Error exporting PDF:', error);
                    alert('Error exporting PDF file');
                  }
                }}
              >
                <i className="fa-solid fa-file-pdf mr-2"></i>
                Export PDF
              </Button>
            </>
          )}
        </div>
      </div>

      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div 
              className="p-4 rounded-lg"
              style={{
                backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              <h3 className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Students</h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{report.totalStudents}</p>
            </div>
            <div 
              className="p-4 rounded-lg"
              style={{
                backgroundColor: 'rgba(var(--color-success-rgb, 5, 150, 105), 0.1)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              <h3 className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Placed</h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>{report.placementStats.placed}</p>
            </div>
            <div 
              className="p-4 rounded-lg"
              style={{
                backgroundColor: 'rgba(var(--color-warning-rgb, 245, 158, 11), 0.1)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              <h3 className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>In Process</h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-warning)' }}>{report.placementStats.inProcess}</p>
            </div>
            <div 
              className="p-4 rounded-lg"
              style={{
                backgroundColor: 'rgba(var(--color-error-rgb, 220, 38, 38), 0.1)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              <h3 className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Unplaced</h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-error)' }}>{report.placementStats.unplaced}</p>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div 
              className="p-6 rounded-lg shadow mb-6"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)'
              }}
            >
              <h3 className="text-xl font-semibold mb-4">Department Statistics</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" name="Total Students" />
                  <Bar dataKey="placed" fill="#82ca9d" name="Placed" />
                  <Bar dataKey="unplaced" fill="#ffc658" name="Unplaced" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Department Details Table */}
          <div 
            className="rounded-lg shadow overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)'
            }}
          >
            <table className="min-w-full" style={{ borderColor: 'var(--color-border)' }}>
              <thead style={{ 
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                color: '#ffffff'
              }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#ffffff' }}>Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#ffffff' }}>Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#ffffff' }}>Placed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#ffffff' }}>Unplaced</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#ffffff' }}>Avg Package (LPA)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#ffffff' }}>Placement %</th>
                </tr>
              </thead>
              <tbody style={{ 
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)'
              }}>
                {Object.keys(report.departments || {}).map((dept, index) => {
                  const deptData = report.departments[dept];
                  const placementRate = deptData.total > 0 
                    ? ((deptData.placed / deptData.total) * 100).toFixed(2) 
                    : 0;
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{dept}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{deptData.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">{deptData.placed}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-red-600">{deptData.unplaced}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {deptData.averagePackage > 0 ? `${deptData.averagePackage} LPA` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{placementRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default DepartmentReport;

