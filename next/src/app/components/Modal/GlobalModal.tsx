'use client';

import React from 'react';
import { useModal } from './ModalContext';
import './GlobalModal.css';

const GlobalModal: React.FC = () => {
  const { isOpen, content, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>
  );
};

export default GlobalModal;
