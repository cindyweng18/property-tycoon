import React from 'react';

interface GameButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

const GameButton: React.FC<GameButtonProps> = ({ children, disabled = false, onClick }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded text-white font-semibold transition
        ${disabled
          ? 'bg-gray-400 cursor-not-allowed opacity-50'
          : 'bg-blue-600 hover:bg-blue-700'
        }`}
    >
      {children}
    </button>
  );
};

export default GameButton;