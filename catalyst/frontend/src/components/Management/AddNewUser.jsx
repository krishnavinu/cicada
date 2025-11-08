import React, { useState } from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import { GrFormAdd } from 'react-icons/gr';
import axios from 'axios';
import Toast from '../Toast';
import ModalBox from '../Modal';
import AnimatedBackground from '../UI/AnimatedBackground';
import GlassCard from '../UI/GlassCard';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { useLocation } from 'react-router-dom';

function AddNewUser() {
  document.title = 'catalyst | Add new user';

  const location = useLocation();
  // filter management or tpo or student to add
  const userToAdd = location.pathname.split('/').filter(link => link !== '' && link !== 'admin' && link !== 'management')[0].split('-').filter(link => link !== 'add' && link !== 'admin')[0];


  const [data, setData] = useState({
    first_name: "",
    email: "",
    number: ""
  });

  // for error message
  const [error, setError] = useState({});

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);

  const handleDataChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleModalSubmit = (e) => {
    e.preventDefault();

    let newError = {};

    if (!data?.first_name) newError.first_name = 'Name Required!';
    if (!data?.email) newError.email = 'Email Required!';
    if (!data?.number) newError.number = 'Number Required!';

    // If any errors were found, set them and return early to prevent the modal from opening
    if (Object.keys(newError).length > 0) return setError(newError);

    setShowModal(true);
  };

  const handleSubmitManagement = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/management/add-management`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      if (response?.data) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);

        setData({
          first_name: "",
          email: "",
          number: ""
        });
      }
    } catch (error) {
      console.log("handleSubmit => AddManagement.jsx ==> ", error);
    }
    setShowModal(false);
  }

  const handleSubmitTPO = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/management/addtpo`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      if (response?.data) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);

        setData({
          first_name: "",
          email: "",
          number: ""
        });
      }
    } catch (error) {
      console.log("handleSubmit => AddTPO.jsx ==> ", error);
    }
    setShowModal(false);
  }

  const handleSubmitStudent = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/management/add-student`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      if (response?.data) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);

        setData({
          first_name: "",
          email: "",
          number: ""
        });
      }
    } catch (error) {
      console.log("handleSubmit => AddStudent.jsx ==> ", error);
    }
    setShowModal(false);
  }

  return (
    <>
      {/*  Toast Message */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="top-center"
      />

      <div className="relative min-h-screen">
        <AnimatedBackground intensity="low" />
        <div className="relative z-10 flex justify-center items-center p-6">
          <div className="w-full max-w-2xl">
            <Form onSubmit={handleModalSubmit}>
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 shadow-lg bounce-icon">
                    <i className="fa-solid fa-user-plus text-white text-lg"></i>
                  </div>
                  <h2 className="text-3xl font-bold gradient-text">
                    Add New {userToAdd === 'management' ? 'Management' : userToAdd === 'tpo' ? 'TPO' : 'Student'} User
                  </h2>
                </div>
              </div>

              {/* Form Card */}
              <GlassCard hoverable={false} glow={true} className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="space-y-4">
                    <div>
                      <FloatingLabel label={
                        <>
                          <span>Name <span className='text-red-500'>*</span></span>
                        </>
                      }>
                        <Form.Control
                          type="text"
                          autoComplete="name"
                          placeholder="Name"
                          name='first_name'
                          value={data.first_name || ''}
                          onChange={handleDataChange}
                        />
                      </FloatingLabel>
                      {error?.first_name && (
                        <span className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                          <i className="fa-solid fa-exclamation-circle"></i>
                          {error.first_name}
                        </span>
                      )}
                    </div>
                    <div>
                      <FloatingLabel label={
                        <>
                          <span>Email <span className='text-red-500'>*</span></span>
                        </>
                      }>
                        <Form.Control
                          type="email"
                          autoComplete="email"
                          placeholder="Email"
                          name='email'
                          value={data.email || ''}
                          onChange={handleDataChange}
                        />
                      </FloatingLabel>
                      {error?.email && (
                        <span className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                          <i className="fa-solid fa-exclamation-circle"></i>
                          {error.email}
                        </span>
                      )}
                    </div>
                    <div>
                      <FloatingLabel label={
                        <>
                          <span>Phone Number <span className='text-red-500'>*</span></span>
                        </>
                      }>
                        <Form.Control
                          type="number"
                          autoComplete="tel"
                          placeholder="Phone Number"
                          name='number'
                          value={data.number || ''}
                          onInput={(e) => {
                            if (e.target.value.length > 10) {
                              e.target.value = e.target.value.slice(0, 10);
                            }
                          }}
                          onChange={handleDataChange}
                        />
                      </FloatingLabel>
                      {error?.number && (
                        <span className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                          <i className="fa-solid fa-exclamation-circle"></i>
                          {error.number}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className='text-sm text-gray-700 flex items-center gap-2'>
                      <i className="fa-solid fa-info-circle text-blue-500"></i>
                      <span>
                        <span className="font-semibold text-blue-600">Note: </span>
                        Password will be randomly generated & sent to user via email.
                      </span>
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <button 
                  type="submit" 
                  className="gradient-button px-8 py-3 text-lg font-semibold text-white rounded-xl flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    border: 'none'
                  }}
                >
                  <i className="fa-solid fa-user-plus"></i>
                  Create New User
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>

      {/* ModalBox Component */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Do you want to create new user and send email to ${data?.email} about creation of user?`}
        btn={"Create"}
        confirmAction={
          userToAdd === 'management'
            ? handleSubmitManagement
            : userToAdd === 'tpo'
              ? handleSubmitTPO
              : userToAdd === 'student'
                ? handleSubmitStudent
                : ''
        }
      />
    </>
  );
}

export default AddNewUser;
