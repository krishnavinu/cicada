import React, { useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const CustomToast = ({ show, onClose, message, delay = 3000, position = 'bottom-end' }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [show, delay, onClose]);

  const positionMap = {
    'top-start': 'top-0 start-0',
    'top-center': 'top-0 start-50 translate-middle-x',
    'top-end': 'top-0 end-0',
    'bottom-start': 'bottom-0 start-0',
    'bottom-center': 'bottom-0 start-50 translate-middle-x',
    'bottom-end': 'bottom-0 end-0',
  };

  return (
    <ToastContainer 
      position={position} 
      className={`p-3 position-fixed ${positionMap[position]}`} 
      style={{ zIndex: 1050 }}
    >
      <Toast 
        onClose={onClose} 
        show={show} 
        delay={delay} 
        autohide
        className="shadow-2xl border-0 animate-fadeInDown"
      >
        <Toast.Header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <strong className="me-auto">Notification</strong>
          </div>
          <small className="text-white/80">Just now</small>
        </Toast.Header>
        <Toast.Body className="bg-white py-3 px-4">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-circle-check text-green-500 mt-1"></i>
            <span className="text-gray-700">{message}</span>
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CustomToast;
