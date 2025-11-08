import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit, FaFileAlt } from 'react-icons/fa';
import Toast from '../Toast';
import AnimatedBackground from '../UI/AnimatedBackground';
import GlassCard from '../UI/GlassCard';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Publications() {
  const [publications, setPublications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    journal: '',
    year: new Date().getFullYear(),
    authors: '',
    doi: '',
    link: '',
    weightage: 0
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/user/detail`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPublications(response.data.studentProfile?.publications || []);
    } catch (error) {
      console.error('Error fetching publications:', error);
      setToastMessage('Error loading publications');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const authorsArray = formData.authors.split(',').map(a => a.trim()).filter(a => a);
      const publicationData = {
        ...formData,
        authors: authorsArray
      };
      
      const updatedPublications = editingIndex >= 0
        ? publications.map((pub, idx) => idx === editingIndex ? publicationData : pub)
        : [...publications, publicationData];
      
      await axios.post(`${BASE_URL}/user/update-profile`, {
        'studentProfile.publications': updatedPublications
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setToastMessage('Publication saved successfully!');
      setShowToast(true);
      fetchPublications();
      resetForm();
    } catch (error) {
      setToastMessage('Error saving publication');
      setShowToast(true);
      console.error('Error saving publication:', error);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this publication?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const updatedPublications = publications.filter((_, idx) => idx !== index);
      
      await axios.post(`${BASE_URL}/user/update-profile`, {
        'studentProfile.publications': updatedPublications
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setToastMessage('Publication deleted!');
      setShowToast(true);
      fetchPublications();
    } catch (error) {
      setToastMessage('Error deleting publication');
      setShowToast(true);
      console.error('Error deleting publication:', error);
    }
  };

  const handleEdit = (index) => {
    const pub = publications[index];
    setFormData({
      title: pub.title || '',
      journal: pub.journal || '',
      year: pub.year || new Date().getFullYear(),
      authors: pub.authors?.join(', ') || '',
      doi: pub.doi || '',
      link: pub.link || '',
      weightage: pub.weightage || 0
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      journal: '',
      year: new Date().getFullYear(),
      authors: '',
      doi: '',
      link: '',
      weightage: 0
    });
    setShowForm(false);
    setEditingIndex(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-72">
        <div className="flex flex-col items-center gap-4">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-500 animate-pulse"></i>
          <p className="text-gray-600 font-medium">Loading publications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <AnimatedBackground variant="default" intensity="low" />
      
      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6">
        <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} delay={3000} position="bottom-end" />
        
        <GlassCard hoverable={false} glow={true} className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 shadow-lg bounce-icon">
                <FaFileAlt className="text-white text-lg" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Research Publications</h2>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="group gradient-button px-4 py-2 flex items-center gap-2"
            >
              <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
              <span>{showForm ? 'Cancel' : 'Add Publication'}</span>
            </button>
          </div>

          {showForm && (
            <GlassCard hoverable={false} glow={false} className="mb-6 p-6 border-2 border-blue-200/50">
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  placeholder="Publication Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 focus:bg-white focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300/70"
                  style={{
                    color: 'var(--color-text)'
                  }}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Journal/Conference</label>
                <input
                  type="text"
                  placeholder="Journal or Conference Name"
                  value={formData.journal}
                  onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                  className="w-full p-3 border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 focus:bg-white focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300/70"
                  style={{
                    color: 'var(--color-text)'
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <input
                  type="number"
                  placeholder="Publication Year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="w-full p-3 border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 focus:bg-white focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300/70"
                  style={{
                    color: 'var(--color-text)'
                  }}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Authors (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Author 1, Author 2, Author 3"
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  className="w-full p-3 border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 focus:bg-white focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300/70"
                  style={{
                    color: 'var(--color-text)'
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">DOI</label>
                <input
                  type="text"
                  placeholder="DOI (if available)"
                  value={formData.doi}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  className="w-full p-3 border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 focus:bg-white focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300/70"
                  style={{
                    color: 'var(--color-text)'
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Link</label>
                <input
                  type="url"
                  placeholder="Publication URL"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full p-3 border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 focus:bg-white focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300/70"
                  style={{
                    color: 'var(--color-text)'
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Weightage (0-100)</label>
                <input
                  type="number"
                  placeholder="Weightage"
                  min="0"
                  max="100"
                  value={formData.weightage}
                  onChange={(e) => setFormData({ ...formData, weightage: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 focus:bg-white focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300/70"
                  style={{
                    color: 'var(--color-text)'
                  }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>This adds weightage to your profile (0-100)</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button type="submit" className="group gradient-button px-6 py-2 flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                <span>{editingIndex >= 0 ? 'Update' : 'Add'} Publication</span>
              </button>
              <button 
                type="button" 
                onClick={resetForm} 
                className="px-6 py-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  border: '2px solid var(--color-border)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-error)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'var(--color-error)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                  e.currentTarget.style.color = 'var(--color-text)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                Cancel
              </button>
            </div>
            </form>
            </GlassCard>
          )}

          <div className="space-y-4 mt-6">
          {publications.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--color-text-secondary)' }}>
              <FaFileAlt className="text-5xl mx-auto mb-4 opacity-50" style={{ color: 'var(--color-text-secondary)' }} />
              <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>No publications added yet.</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Click "Add Publication" to get started.</p>
            </div>
          ) : (
            publications.map((pub, index) => (
              <GlassCard
                key={index}
                hoverable={true}
                glow={false}
                className="p-5 floating-card"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text)' }}>{pub.title}</h3>
                    {pub.journal && (
                      <p className="text-gray-600 mb-1">
                        <i className="fa-solid fa-book text-blue-500 mr-2"></i>
                        {pub.journal} {pub.year && `(${pub.year})`}
                      </p>
                    )}
                    {pub.authors && pub.authors.length > 0 && (
                      <p className="text-sm text-gray-500 mb-2">
                        <i className="fa-solid fa-users text-green-500 mr-2"></i>
                        {pub.authors.join(', ')}
                      </p>
                    )}
                    {pub.doi && (
                      <p className="text-sm text-gray-500 mb-1">
                        <i className="fa-solid fa-link text-purple-500 mr-2"></i>
                        DOI: {pub.doi}
                      </p>
                    )}
                    {pub.link && (
                      <a 
                        href={pub.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-700 inline-flex items-center gap-1"
                      >
                        <i className="fa-solid fa-external-link"></i>
                        View Publication
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {pub.weightage > 0 && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        Weightage: {pub.weightage}%
                      </span>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default Publications;
