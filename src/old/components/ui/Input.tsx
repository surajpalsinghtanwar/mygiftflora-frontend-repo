// --- FIX START ---
// Value imports: These exist at runtime.
import React, { forwardRef } from 'react';
// Type-only import: This is erased during compilation.
import type { InputHTMLAttributes } from 'react';
// --- FIX END ---

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          className={`peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-3 placeholder-transparent focus:border-gray-800 focus:outline-none focus:ring-0 ${
            error ? 'border-red-500' : ''
          }`}
          placeholder={label}
          {...props}
        />
        <label
          htmlFor={inputId}
          className="absolute left-2 -top-2.5 z-10 origin-[0] bg-white px-1 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-800"
        >
          {label}
        </label>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';