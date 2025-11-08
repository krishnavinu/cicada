import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const UploadResume = ({ fetchCurrentUserData }) => {
  const [uploadStatus, setUploadStatus] = useState('');

  // useState for load data
  const [currentUser, setCurrentUser] = useState({
    id: '',
    role: '',
  });

  // checking for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          role: res.data.role,
        });
      })
      .catch(err => {
        console.log("UploadResume.jsx => ", err);
      });
  }, []);


  // Handle resume upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.files[0]) {
      setUploadStatus('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', e.target.files[0]);
    formData.append('userId', currentUser.id);

    try {
      const response = await axios.post(`${BASE_URL}/student/upload-resume`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      // console.log(response.data)
      // update userData in UpdatePlacementProfile
      if (fetchCurrentUserData) fetchCurrentUserData();
      setUploadStatus('Resume uploaded successfully');
    } catch (error) {
      console.error('Error uploading the resume', error);
      setUploadStatus('Error uploading the resume');
    }
  };

  return (
    <div className="w-full">
      <FloatingLabel controlId="floatingResume" label="Update Resume" className="mb-3">
        <Form.Control
          type="file"
          accept='.pdf, .doc, .docx'
          placeholder="Upload Resume"
          name='resume'
          onChange={handleSubmit}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm text-gray-800 transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 focus:bg-white focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </FloatingLabel>
      {uploadStatus && (
        <div className={`mt-2 px-4 py-2 rounded-lg border-2 flex items-center gap-2 animate-fadeInDown ${
          uploadStatus.includes('successfully') 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <i className={`fa-solid ${uploadStatus.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-circle'} text-sm`}></i>
          <p className='text-sm font-medium'>{uploadStatus}</p>
        </div>
      )}
    </div>
  );
};

export default UploadResume;
