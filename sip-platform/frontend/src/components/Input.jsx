import React from 'react';

function Input({ 
  type = "text", 
  placeholder, 
  value, 
  onChange,
  disabled = false,
  className = '',
  ...props 
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`
        w-full px-3 py-2 text-sm text-[#172B4D] font-sans
        bg-[#FAFBFC] border border-[#DFE1E6] rounded
        transition-colors duration-200
        placeholder-[#A5ADBA]
        hover:bg-[#EBECF0]
        focus:bg-[#FFFFFF] focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]
        disabled:bg-[#F4F5F7] disabled:border-[#DFE1E6] disabled:text-[#A5ADBA] disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  );
}

export default Input;