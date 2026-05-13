import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-[#FFFFFF] border-b border-[#DFE1E6] h-14 px-6 flex justify-between items-center text-sm font-sans">
      
      {/* Brand / Logo Section */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] rounded">
        <div className="w-7 h-7 bg-[#0052CC] rounded flex items-center justify-center text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-[#172B4D] tracking-tight">
          SIP
        </h1>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-1">
        <Link
          to="/"
          className="text-[#42526E] font-medium px-3 py-1.5 rounded hover:bg-[#F4F5F7] hover:text-[#172B4D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4C9AFF]"
        >
          Home
        </Link>

        <Link
          to="/about"
          className="text-[#42526E] font-medium px-3 py-1.5 rounded hover:bg-[#F4F5F7] hover:text-[#172B4D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4C9AFF]"
        >
          About
        </Link>

        {/* Login styled as a primary action button */}
        <Link
          to="/login"
          className="ml-3 bg-[#0052CC] text-white px-4 py-1.5 rounded font-medium hover:bg-[#0065FF] active:bg-[#0747A6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:ring-offset-1"
        >
          Login
        </Link>
      </div>
      
    </nav>
  );
}

export default Navbar;