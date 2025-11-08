import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Toast from '../../components/Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function HODLogin() {
  document.title = 'catalyst | HOD Login';
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${BASE_URL}/hod/login`, {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/hod/dashboard');
      }
    } catch (error) {
      setToastMessage(error.response?.data?.msg || 'Login failed');
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">HOD Login</h1>
          <p className="text-gray-600">Head of Department Portal</p>
        </div>
        
        <Form onSubmit={handleSubmit}>
          <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FloatingLabel>
          
          <FloatingLabel controlId="floatingPassword" label="Password" className="mb-4">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FloatingLabel>
          
          <Button variant="primary" type="submit" className="w-full mb-3" size="lg">
            Login
          </Button>
        </Form>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-home"></i>
            Back to Home
          </button>
        </div>
      </div>
      <Toast show={showToast} onClose={() => setShowToast(false)} message={toastMessage} />
    </div>
  );
}

export default HODLogin;

