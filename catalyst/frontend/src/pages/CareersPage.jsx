import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    search: '',
    department: '',
    salary: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Public endpoint - no auth required
      const response = await axios.get(`${BASE_URL}/public/jobs`);
      setJobs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !filter.search || 
      job.jobTitle.toLowerCase().includes(filter.search.toLowerCase()) ||
      job.jobDescription?.toLowerCase().includes(filter.search.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <i className="fa-solid fa-spinner fa-spin text-4xl"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Career Opportunities</h1>
          <p className="text-xl mb-8">Find your dream job with top companies</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search jobs by title or description..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full px-6 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </div>

      {/* Jobs Listing */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Available Positions ({filteredJobs.length})
          </h2>
          <p className="text-gray-600">Browse through our current job openings</p>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No jobs available at the moment</p>
            <p className="text-gray-400 mt-2">Check back later for new opportunities</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job._id} className="hover:shadow-lg transition-shadow">
                <Card.Body>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Card.Title className="text-xl font-bold">
                        {job.jobTitle}
                      </Card.Title>
                      <p className="text-gray-600 text-sm">
                        {job.company?.companyName || 'Company'}
                      </p>
                    </div>
                    {job.salary && (
                      <Badge bg="success" className="text-lg">
                        {job.salary} LPA
                      </Badge>
                    )}
                  </div>
                  
                  <Card.Text className="text-gray-700 mb-4 line-clamp-3">
                    {job.jobDescription?.substring(0, 150)}...
                  </Card.Text>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Posted: {new Date(job.postedAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Link to={`/careers/job/${job._id}`}>
                        <Button variant="outline-primary" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Link to={`/student/resume-builder/${job._id}`}>
                        <Button variant="primary" size="sm">
                          Apply Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Career?</h2>
          <p className="text-xl mb-6">Create your professional resume and start applying</p>
          <Link to="/student/resume-builder">
            <Button variant="light" size="lg" className="px-8">
              Create Resume
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CareersPage;

