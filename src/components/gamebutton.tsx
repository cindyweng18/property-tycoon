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
      className={`px-4 py-2 rounded-md font-semibold text-white text-sm md:text-base
        transition-all duration-300 ease-in-out
        ${disabled
          ? 'bg-gray-400/70 cursor-not-allowed opacity-60 scale-100'
          : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.97] opacity-100 shadow-md hover:shadow-lg animate-fadeIn'
        }`}>
      {children}
    </button>
  );
};

export default GameButton;