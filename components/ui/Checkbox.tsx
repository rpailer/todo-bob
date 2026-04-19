// Reusable Checkbox component

import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export default function Checkbox({
  label,
  className = '',
  ...props
}: CheckboxProps) {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        className={`w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer ${className}`}
        {...props}
      />
      {label && (
        <span className="ml-2 text-gray-700">{label}</span>
      )}
    </label>
  );
}

// Made with Bob
