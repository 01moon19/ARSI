import React from 'react';

function FeatureCard({ 
  title, 
  description, 
  icon, 
  onClick, 
  className = '' 
}) {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-[#FFFFFF] border border-[#DFE1E6] rounded p-5 transition-all duration-200 
        ${onClick ? 'cursor-pointer hover:border-[#C1C7D0] hover:shadow-sm hover:bg-[#FAFBFC]' : ''} 
        ${className}
      `}
    >
      {/* Optional Icon Placeholder */}
      {icon && (
        <div className="text-[#0052CC] mb-3 flex items-center justify-center w-8 h-8 bg-[#E6EFFC] rounded">
          {icon}
        </div>
      )}
      
      {/* Changed to h3 for standard enterprise hierarchy, smaller standard font-size */}
      <h3 className="text-[#172B4D] text-base font-semibold mb-1.5">
        {title}
      </h3>

      <p className="text-[#5E6C84] text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;