import React, { forwardRef, useId } from 'react';

export const Input = forwardRef(
  ({ label, type = "text", className = "", ...props }, ref) => {
    const id = useId();
    return (
      <>
      <div className='mt-2'>
        {label && <label htmlFor={id}>{label}</label>}
        <input
          ref={ref}
          id={id}
          type={type}
          className={`px-3 py-2 rounded-lg  text-black outline-none  duration-200 border border-gray-400 w-full ${className}`}
          {...props}
        />
      </div>
      </>
    );
  }
);
