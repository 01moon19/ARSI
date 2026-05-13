import React from 'react';

function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className = '',
  type = 'button',
  ...props 
}) {
  // Base Jira/Confluence styles: 4px border radius, text-sm, font-medium, padding
  const baseStyles = "inline-flex items-center justify-center font-medium text-sm rounded px-3 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:ring-offset-1 disabled:cursor-not-allowed";
  
  // Exact Atlassian color hexes and interaction states
  const variants = {
    primary: "bg-[#0052CC] text-white hover:bg-[#0065FF] active:bg-[#0747A6] disabled:bg-[#DFE1E6] disabled:text-[#A5ADBA]",
    secondary: "bg-[#F4F5F7] text-[#172B4D] hover:bg-[#EBECF0] active:bg-[#DFE1E6] disabled:bg-[#F4F5F7] disabled:text-[#A5ADBA] border border-transparent",
    outline: "bg-transparent text-[#172B4D] border border-[#DFE1E6] hover:bg-[#F4F5F7] active:bg-[#EBECF0] disabled:text-[#A5ADBA] disabled:bg-transparent",
    danger: "bg-[#DE350B] text-white hover:bg-[#FF5630] active:bg-[#BF2600] disabled:bg-[#DFE1E6] disabled:text-[#A5ADBA]",
    ghost: "bg-transparent text-[#5E6C84] hover:bg-[#F4F5F7] hover:text-[#172B4D] active:bg-[#EBECF0] disabled:text-[#A5ADBA] disabled:bg-transparent"
  };

  // Fallback to primary if an invalid variant is passed
  const variantStyles = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;