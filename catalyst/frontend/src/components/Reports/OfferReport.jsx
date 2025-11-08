import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function OfferReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/reports/offers`, {
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

  const packageData = report?.offersByPackage ? Object.keys(report.offersByPackage).map(range => ({
    name: `${range} LPA`,
    value: report.offersByPackage[range]
  })) : [];

  const companyData = report?.offersByCompany ? Object.entries(report.offersByCompany)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value })) : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <i className="fa-solid fa-spinner fa-spin text-4xl"></i>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Offer-wise Report</h2>

      {report && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600">Total Offers</h3>
              <p className="text-3xl font-bold">{report.totalOffers}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600">Companies</h3>
              <p className="text-3xl font-bold">{Object.keys(report.offersByCompany || {}).length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600">Departments</h3>
              <p className="text-3xl font-bold">{Object.keys(report.offersByDepartment || {}).length}</p>
            </div>
          </div>

          {/* Package Distribution Chart */}
          {packageData.length > 0 && (
            <div 
              className="p-6 rounded-lg shadow mb-6"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)'
              }}
            >
              <h3 className="text-xl font-semibold mb-4">Offers by Package Range</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={packageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {packageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Companies */}
          {companyData.length > 0 && (
            <div 
              className="rounded-lg shadow p-6 mb-6"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)'
              }}
            >
              <h3 className="text-xl font-semibold mb-4">Top Recruiting Companies</h3>
              <div className="space-y-2">
                {companyData.map((company, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-3 rounded"
                    style={{
                      backgroundColor: index % 2 === 0 ? 'var(--color-background)' : 'var(--color-surface)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <span className="font-medium" style={{ color: 'var(--color-text)' }}>{company.name}</span>
                    <span 
                      className="text-white px-3 py-1 rounded"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
                      }}
                    >
                      {company.value} offers
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Range Table */}
          <div 
            className="rounded-lg shadow p-6"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)'
            }}
          >
            <h3 className="text-xl font-semibold mb-4">Offers by Package Range</h3>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(report.offersByPackage || {}).map(([range, count]) => (
                <div 
                  key={range} 
                  className="text-center p-4 rounded"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                >
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{range} LPA</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OfferReport;

