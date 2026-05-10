import UploadCard from "../components/UploadCard";

function UploadPage() {

  return (

    <div>

      <div className="mb-10">

        <h1 className="text-5xl font-bold mb-3">
          Upload Center
        </h1>

        <p className="text-gray-600 text-lg">
          Upload and manage documents for AI analysis.
        </p>

      </div>

      <UploadCard />

    </div>
  );
}

export default UploadPage;