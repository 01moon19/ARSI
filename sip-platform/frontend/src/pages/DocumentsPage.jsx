import { useEffect, useState } from "react";
import api from "../api/axios";
import { getUploads } from "../services/UploadService";
import { getUserFromToken } from "../utils/auth";

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = getUserFromToken();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const data = await getUploads();
      setDocuments(data.documents);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (documentId, filename) => {
    try {
      const response = await api.get(`/${documentId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto font-sans antialiased space-y-6">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-[#172B4D] tracking-tight">
          Document Repository
        </h1>
        <p className="text-[#5E6C84] text-sm mt-1">
          Browse and download ingested knowledge base files.
        </p>
      </div>

      {/* DATA TABLE CONTAINER */}
      <div className="bg-[#FFFFFF] border border-[#DFE1E6] rounded shadow-sm overflow-hidden">
        
        {/* Toolbar / Table Header Area */}
        <div className="px-5 py-4 border-b border-[#DFE1E6] bg-[#FAFBFC] flex items-center justify-between">
          <h2 className="text-[#172B4D] text-base font-semibold">
            Files
          </h2>
          <div className="text-xs font-medium text-[#5E6C84] bg-[#DFE1E6] px-2 py-0.5 rounded-full">
            {documents.length} Items
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DFE1E6]">
                <th className="px-5 py-3 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider w-2/3">
                  Document Name
                </th>
                <th className="px-5 py-3 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider w-1/6">
                  Status
                </th>
                {/* Only render Actions column header if user is NOT admin */}
                {!isAdmin && (
                  <th className="px-5 py-3 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider text-right w-1/6">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#DFE1E6]">
              {isLoading ? (
                <tr>
                  <td colSpan={isAdmin ? "2" : "3"} className="px-5 py-10 text-center text-[#5E6C84] text-sm">
                    <svg className="animate-spin h-5 w-5 text-[#0052CC] mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Loading repository...
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? "2" : "3"} className="px-5 py-10 text-center text-[#5E6C84] text-sm">
                    No documents available in the repository.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#FAFBFC] transition-colors group">
                    
                    {/* FILE INFO CELL */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="text-[#5E6C84] mt-0.5">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#172B4D] group-hover:text-[#0052CC] transition-colors cursor-pointer">
                            {doc.original_filename}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* STATUS LOZENGE CELL */}
                    <td className="px-5 py-3">
                      {doc.status === "completed" || doc.status === "ready" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#E3FCEF] text-[#006644]">
                          Ready
                        </span>
                      ) : doc.status === "processing" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#DEEBFF] text-[#0747A6]">
                          Processing
                        </span>
                      ) : doc.status === "failed" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FFEBE6] text-[#BF2600]">
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#DFE1E6] text-[#42526E]">
                          {doc.status || "Unknown"}
                        </span>
                      )}
                    </td>

                    {/* ACTIONS CELL (User Only) */}
                    {!isAdmin && (
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleDownload(doc.id, doc.original_filename)}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] border border-[#DFE1E6] text-[#42526E] text-xs font-semibold rounded hover:bg-[#F4F5F7] hover:text-[#172B4D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] active:bg-[#EBECF0]"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          Download
                        </button>
                      </td>
                    )}

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

export default DocumentsPage;