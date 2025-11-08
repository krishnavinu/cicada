import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalBox({ show, close, header, body, btn, confirmAction }) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  return (
    <>
      <Modal
        show={show}
        onHide={close}
        backdrop="static"
        keyboard={false}
        centered
        className="modal-fade"
        style={{ animation: show ? 'fadeIn 0.3s ease-out' : 'fadeOut 0.3s ease-out' }}
      >
        <Modal.Header 
          closeButton 
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0"
        >
          <Modal.Title className="flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-yellow-300 animate-pulse"></i>
            {header}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-6 px-6 bg-gray-50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-info text-blue-500"></i>
            </div>
            <p className="text-gray-700 leading-relaxed text-base">{body}</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-white border-t border-gray-200">
          <Button 
            variant="secondary" 
            onClick={close}
            className="px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <i className="fa-solid fa-times mr-2"></i>
            Close
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmAction}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <i className="fa-solid fa-check"></i>
              {btn}
            </span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalBox;