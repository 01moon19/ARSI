import { Link, Outlet, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

function AppLayout() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const role = user?.role || "user";

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Shared Nav Link Style (Atlassian Sidebar Pattern)
  const navLinkStyle = "flex items-center gap-3 mx-2 px-3 py-2 mt-0.5 text-sm font-medium text-[#42526E] rounded hover:bg-[#EBECF0] hover:text-[#172B4D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4C9AFF]";

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#FFFFFF] font-sans antialiased text-[#172B4D]">
      
      {/* SIDEBAR */}
      <div className="w-[240px] flex-shrink-0 bg-[#FAFBFC] border-r border-[#DFE1E6] flex flex-col z-20">
        
        {/* LOGO / APP HEADER */}
        <div className="h-14 px-4 border-b border-[#DFE1E6] flex items-center shrink-0">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] rounded px-1">
            <div className="w-6 h-6 bg-[#0052CC] rounded flex items-center justify-center text-white shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h1 className="text-base font-bold text-[#172B4D] tracking-tight">
              SIP Workspace
            </h1>
          </Link>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex-1 py-3 overflow-y-auto custom-scrollbar">
          
          <div className="px-4 mb-2">
            <span className="text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider">Dashboards</span>
          </div>

          <Link to="/app/dashboard" className={navLinkStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            Sales Intelligence
          </Link>

          <Link to="/app/chat" className={navLinkStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Chat Console
          </Link>

          <div className="px-4 mt-6 mb-2">
            <span className="text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider">Repository</span>
          </div>

          {role === "admin" ? (
            <Link to="/app/upload" className={navLinkStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Knowledge Base
            </Link>
          ) : (
            <Link to="/app/documents" className={navLinkStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Documents
            </Link>
          )}

          {role === "admin" && (
            <>
              <div className="px-4 mt-6 mb-2">
                <span className="text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider">Administration</span>
              </div>
              <Link to="/app/users" className={navLinkStyle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                User Management
              </Link>
            </>
          )}

        </div>

        {/* FOOTER / USER PROFILE */}
        <div className="p-4 border-t border-[#DFE1E6] shrink-0 bg-[#FAFBFC]">
          
          {/* User Info Block */}
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-[#5E6C84] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {role === "admin" ? "AD" : "US"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#172B4D] truncate">
                Current User
              </p>
              <p className="text-xs text-[#5E6C84] capitalize truncate">
                {role} Account
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-[#F4F5F7] hover:bg-[#EBECF0] text-[#172B4D] border border-[#DFE1E6] py-1.5 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#4C9AFF]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sign Out
          </button>
        </div>

      </div>

      {/* MAIN CONTENT CANVAS */}
      <div className="flex-1 overflow-y-auto bg-[#FFFFFF] relative custom-scrollbar">
        {/* We use a max-width container inside the outlet pages typically, but padding the canvas globally is fine too. 
            I've adjusted the padding to p-8 to match standard Jira canvas margins. */}
        <div className="p-8 h-full">
          <Outlet />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #DFE1E6;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #C1C7D0;
        }
      `}} />

    </div>
  );
}

export default AppLayout;