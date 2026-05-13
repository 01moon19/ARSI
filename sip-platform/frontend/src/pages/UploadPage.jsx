import UploadCard from "../components/UploadCard";

function UploadPage() {
  return (
    <div className="w-full max-w-5xl mx-auto font-sans antialiased space-y-6">
      
      {/* PAGE HEADER */}
      <div className="border-b border-[#DFE1E6] pb-5">
        <h1 className="text-2xl font-semibold text-[#172B4D] tracking-tight">
          Knowledge Base Administration
        </h1>
        <p className="text-[#5E6C84] text-sm mt-1">
          Ingest, process, and manage data sources for the Sales Intelligence reasoning engine.
        </p>
      </div>

      {/* MAIN CONTENT (Upload Zone & Document Table) */}
      <UploadCard />

    </div>
  );
}

export default UploadPage;