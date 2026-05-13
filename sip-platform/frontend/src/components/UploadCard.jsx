import { useEffect, useState } from "react";
import { uploadDocument, getUploads } from "../services/UploadService";

function UploadCard() {
  const [file, setFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const data = await getUploads();
      const latestUploads = Object.values(
        data.documents.reduce((acc, doc) => {
          acc[doc.original_filename] = doc;
          return acc;
        }, {})
      );
      setUploads(latestUploads);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setLoading(true);
      const response = await uploadDocument(file);
      setMessage(response.message);
      setFile(null);
      fetchUploads();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl font-sans antialiased">
      
      {/* UPLOAD CARD */}
      <div className="bg-[#FFFFFF] border border-[#DFE1E6] rounded shadow-sm">
        
        {/* Header */}
        <div className="border-b border-[#DFE1E6] px-6 py-4 flex items-center justify-between bg-[#FAFBFC] rounded-t">
          <div>
            <h2 className="text-[#172B4D] text-base font-semibold">
              Upload Knowledge Base Document
            </h2>
            <p className="text-[#5E6C84] text-xs mt-0.5">
              Ingest PDFs and spreadsheets into the SIP reasoning engine.
            </p>
          </div>
        </div>

        {/* Upload Dropzone Area */}
        <div className="p-6">
          <div className="border-2 border-dashed border-[#DFE1E6] bg-[#FAFBFC] hover:bg-[#F4F5F7] transition-colors rounded p-8 flex flex-col items-center justify-center gap-4 text-center">
            
            <div className="w-12 h-12 bg-[#E6EFFC] text-[#0052CC] rounded flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>

            <label className="cursor-pointer flex flex-col items-center">
              <input
                type="file"
                accept=".pdf,.xlsx"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setMessage(""); // clear previous messages on new file select
                }}
                className="hidden"
              />
              <span className="bg-[#FFFFFF] border border-[#DFE1E6] text-[#172B4D] px-4 py-1.5 rounded text-sm font-medium hover:bg-[#F4F5F7] transition shadow-sm mb-3">
                Browse Files
              </span>
              <span className="text-sm font-medium text-[#172B4D]">
                {file ? file.name : "Or drag and drop files here"}
              </span>
            </label>

            <p className="text-xs text-[#5E6C84]">
              Supported formats: .pdf, .xlsx
            </p>

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="mt-2 bg-[#0052CC] text-white px-5 py-2 rounded text-sm font-medium hover:bg-[#0065FF] active:bg-[#0747A6] disabled:bg-[#DFE1E6] disabled:text-[#A5ADBA] disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? "Processing Upload..." : "Start Upload"}
            </button>

            {message && (
              <div className={`mt-2 text-xs font-medium px-3 py-1.5 rounded ${message.toLowerCase().includes('failed') ? 'bg-[#FFEBE6] text-[#BF2600]' : 'bg-[#E3FCEF] text-[#006644]'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DOCUMENTS LIST */}
      <div className="bg-[#FFFFFF] border border-[#DFE1E6] rounded shadow-sm">
        
        {/* Header */}
        <div className="border-b border-[#DFE1E6] px-6 py-4 bg-[#FAFBFC] rounded-t flex items-center justify-between">
          <h2 className="text-[#172B4D] text-base font-semibold">
            Repository Documents
          </h2>
          <span className="bg-[#DFE1E6] text-[#172B4D] text-xs font-bold px-2 py-0.5 rounded-full">
            {uploads.length}
          </span>
        </div>

        {/* List Content */}
        <div className="divide-y divide-[#DFE1E6]">
          {uploads.length === 0 ? (
            <div className="p-8 text-center text-[#5E6C84] text-sm">
              No documents uploaded yet.
            </div>
          ) : (
            uploads.map((doc) => (
              <div key={doc.id} className="p-4 hover:bg-[#FAFBFC] transition-colors flex items-start justify-between group">
                
                <div className="flex gap-3 items-start">
                  {/* File Type Icon */}
                  <div className="mt-0.5 text-[#5E6C84]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-[#172B4D] text-sm group-hover:text-[#0052CC] transition-colors cursor-pointer">
                      {doc.original_filename}
                    </h3>
                    
                    {/* Metadata Row */}
                    <div className="mt-1.5 flex items-center gap-4 text-xs text-[#5E6C84]">
                      <span className="flex items-center gap-1">
                        <span className="font-semibold">Stage:</span> {doc.stage || "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-semibold">Chunks:</span> {doc.chunks_created || 0}
                      </span>
                    </div>

                    {/* Conditional Notifications */}
                    {doc.notification && <p className="mt-2 text-[#006644] text-xs font-medium">{doc.notification}</p>}
                    {doc.error && <p className="mt-2 text-[#BF2600] text-xs font-medium">{doc.error}</p>}
                  </div>
                </div>

                {/* Status Lozenges (Atlassian Style) */}
                <div className="flex-shrink-0 ml-4">
                  {doc.status === "completed" && (
                    <span className="bg-[#E3FCEF] text-[#006644] px-1.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                      Ready
                    </span>
                  )}
                  {doc.status === "processing" && (
                    <span className="bg-[#DEEBFF] text-[#0747A6] px-1.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Processing
                    </span>
                  )}
                  {doc.status === "failed" && (
                    <span className="bg-[#FFEBE6] text-[#BF2600] px-1.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                      Failed
                    </span>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default UploadCard;