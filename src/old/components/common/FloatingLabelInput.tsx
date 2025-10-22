import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form'; // Import FieldError for react-hook-form integration

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
  error?: FieldError; // It expects an error object from react-hook-form
}

export const FloatingLabelInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, ...props }, ref) => {
    // Automatically generate an ID from the label if one isn't provided
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="relative">
        {/* The Input Element - marked as a 'peer' */}
        <input
          id={inputId}
          ref={ref}
          // The placeholder is made transparent; we only use its "shown" state
          placeholder={label} 
          className={`
            peer block w-full appearance-none rounded-md border bg-transparent 
            px-3 py-3 placeholder-transparent 
            focus:outline-none focus:ring-0
            ${
              error 
                ? 'border-red-500 focus:border-red-500' // Error state
                : 'border-gray-300 focus:border-gray-800' // Default state
            }
          `}
          {...props}
        />

        {/* The Label Element - it watches its 'peer' (the input) */}
        <label
          htmlFor={inputId}
          className={`
            absolute left-2 -top-2.5 z-10 origin-[0] bg-white px-1 
            text-sm text-gray-500 transition-all duration-300 
            
            /* When the peer's placeholder is shown (input is empty), move label down */
            peer-placeholder-shown:top-3.5 
            peer-placeholder-shown:text-base 
            peer-placeholder-shown:text-gray-400 
            
            /* When the peer has focus, move label up */
            peer-focus:-top-2.5 
            peer-focus:text-sm 
            peer-focus:text-gray-800
          `}
        >
          {label}
        </label>

        {/* Display validation error message from react-hook-form */}
        {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
      </div>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';