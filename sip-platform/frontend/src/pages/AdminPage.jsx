import { useEffect, useState } from "react";

import {
  getUsers,
  approveUser,
  deleteUser,
} from "../services/AdminService";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveUser(userId);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto font-sans antialiased space-y-6">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-[#172B4D] tracking-tight">
          User Management
        </h1>
        <p className="text-[#5E6C84] text-sm mt-1">
          Approve access requests and manage permissions for the SIP Workspace.
        </p>
      </div>

      {/* DATA TABLE CONTAINER */}
      <div className="bg-[#FFFFFF] border border-[#DFE1E6] rounded shadow-sm overflow-hidden">
        
        {/* Toolbar / Table Header Area */}
        <div className="px-5 py-4 border-b border-[#DFE1E6] bg-[#FAFBFC] flex items-center justify-between">
          <h2 className="text-[#172B4D] text-base font-semibold">
            Directory
          </h2>
          <div className="text-xs font-medium text-[#5E6C84] bg-[#DFE1E6] px-2 py-0.5 rounded-full">
            {users.length} Users
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DFE1E6]">
                <th className="px-5 py-3 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider w-1/3">
                  Account Details
                </th>
                <th className="px-5 py-3 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider w-1/4">
                  System Role
                </th>
                <th className="px-5 py-3 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider w-1/4">
                  Status
                </th>
                <th className="px-5 py-3 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider text-right w-32">
                  Actions
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#DFE1E6]">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center text-[#5E6C84] text-sm">
                    <svg className="animate-spin h-5 w-5 text-[#0052CC] mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Loading directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center text-[#5E6C84] text-sm">
                    No users found in the system.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#FAFBFC] transition-colors group">
                    
                    {/* EMAIL / AVATAR CELL */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E6EFFC] text-[#0052CC] flex items-center justify-center text-xs font-bold shrink-0 uppercase">
                          {user.email.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#172B4D]">
                            {user.email}
                          </p>
                          <p className="text-xs text-[#5E6C84]">
                            ID: {String(user.id).substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ROLE CELL */}
                    <td className="px-5 py-3">
                      <span className="text-sm text-[#172B4D] capitalize flex items-center gap-1.5">
                        {user.role === 'admin' ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF8B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5E6C84" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        )}
                        {user.role}
                      </span>
                    </td>

                    {/* STATUS LOZENGE CELL */}
                    <td className="px-5 py-3">
                      {user.is_active ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#E3FCEF] text-[#006644]">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FFFAE6] text-[#FF8B00]">
                          Pending Approval
                        </span>
                      )}
                    </td>

                    {/* ACTIONS CELL */}
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        
                        {!user.is_active && (
                          <button
                            onClick={() => handleApprove(user.id)}
                            title="Approve User"
                            className="p-1.5 text-[#5E6C84] hover:text-[#0052CC] hover:bg-[#DEEBFF] rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#4C9AFF]"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(user.id)}
                          title="Remove User"
                          className="p-1.5 text-[#5E6C84] hover:text-[#DE350B] hover:bg-[#FFEBE6] rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5630]"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;