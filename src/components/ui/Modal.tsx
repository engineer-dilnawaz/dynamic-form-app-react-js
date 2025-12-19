import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={`modal ${isOpen ? 'modal-open' : ''} modal-bottom sm:modal-middle`}>
      <div className="modal-box !bg-brand-surface border border-brand-border shadow-2xl relative">
        <label onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
        <h3 className="font-bold text-lg text-white mb-4">{title}</h3>
        
        <div className="py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        <div className="modal-action">
             <Button onClick={onClose} variant="ghost">Close</Button>
        </div>
      </div>
       <form method="dialog" className="modal-backdrop">
             <button onClick={onClose}>close</button>
        </form>
    </div>,
    document.body
  );
}
