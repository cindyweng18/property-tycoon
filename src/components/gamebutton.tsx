import React from 'react';

interface GameButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  tooltip?: string; 
}

const GameButton: React.FC<GameButtonProps> = ({
  children,
  disabled = false,
  onClick,
  tooltip,
}) => {
  return (
    <div className="relative group inline-block">
      <button
        disabled={disabled}
        onClick={onClick}
        className={`px-4 py-2 rounded-md font-semibold text-white text-sm md:text-base
          transition-all duration-300 ease-in-out
          ${disabled
            ? 'bg-gray-400 cursor-not-allowed opacity-60 scale-100'
            : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.97] opacity-100 shadow-md hover:shadow-lg animate-fadeIn'
          }`} >
        {children}
      </button>

      {tooltip && (
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded-md
            whitespace-nowrap z-20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity
            ${disabled ? 'bg-gray-700 text-gray-200' : 'bg-zinc-800 text-white'}
          `} >
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default GameButton;