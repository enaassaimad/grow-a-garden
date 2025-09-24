import React, { ReactNode, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const { t } = useLocalization();
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-[color:var(--card)] rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col border border-[color:var(--border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-[color:var(--card-foreground)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[color:var(--secondary)] transition-colors text-[color:var(--foreground)]"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;