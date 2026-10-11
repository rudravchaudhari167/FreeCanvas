import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 84,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        backgroundColor: '#30312D',
        color: '#FFFEFA',
        padding: '8px 16px',
        borderRadius: 9999,
        fontSize: 12.5,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <CheckCircle2 size={15} color="#D8DAC7" />
      <span>{message}</span>
    </div>
  );
};
