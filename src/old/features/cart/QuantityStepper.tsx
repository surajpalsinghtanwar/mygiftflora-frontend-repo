import React from 'react';

type StepperSize = 'md' | 'sm';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  size?: StepperSize; // Make size optional, default to 'md'
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  size = 'md', 
}) => {

  const styles = {
    md: {
      button: 'px-3 py-1 text-lg',
      display: 'w-12 px-2 py-1 text-base',
    },
    sm: {
      button: 'px-2 py-0 text-base',
      display: 'w-8 px-1 py-0 text-sm',
    },
  };

  const currentStyle = styles[size];

  return (
    <div className="flex items-center border border-gray-300 rounded-md bg-white">
      {/* Decrease Button */}
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`${currentStyle.button} font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Decrease quantity"
      >
        -
      </button>

      {/* Quantity Display */}
      <span
        className={`${currentStyle.display} text-center font-bold text-gray-800 border-l border-r border-gray-300`}
        aria-label="Current quantity"
      >
        {quantity}
      </span>

      {/* Increase Button */}
      <button
        onClick={onIncrease}
        className={`${currentStyle.button} font-semibold text-gray-700 hover:bg-gray-100 transition-colors`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};