import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(60, 47, 47, 0.8)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div 
          className="modal-content border-0 shadow"
          style={{ backgroundColor: '#fff4e6' }}
        >
          <div className="modal-header border-0">
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;