import {
  useEffect,
  useState,
} from "react";

import {
  uploadDocument,
  getUploads,
} from "../services/UploadService";

function UploadCard() {

  const [file, setFile] =
    useState(null);

  const [uploads, setUploads] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    fetchUploads();

  }, []);

  const fetchUploads =
    async () => {

      try {

        const data =
          await getUploads();

        const latestUploads =
            Object.values(

            data.documents.reduce(
                (acc, doc) => {

                    acc[
                        doc.original_filename
                    ] = doc;

                    return acc;

                },
            {}));

        setUploads(
            latestUploads
        );

      } catch (error) {

        console.error(error);
      }
    };

  const handleUpload =
    async () => {

      if (!file) return;

      try {

        setLoading(true);

        const response =
          await uploadDocument(
            file
          );

        setMessage(
          response.message
        );

        setFile(null);

        fetchUploads();

      } catch (error) {

        console.error(error);

        setMessage(
          error.response?.data?.detail ||
          "Upload failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="space-y-8">

      {/* UPLOAD CARD */}

      <div className="bg-white rounded-3xl shadow-lg p-8">

        <h2 className="text-3xl font-bold mb-3">
          Upload Document
        </h2>

        <p className="text-gray-500 mb-8">
          Upload PDFs and spreadsheets
          into the AI knowledge base.
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10">

          <div className="flex flex-col items-center gap-5">

            <label className="cursor-pointer">

              <input
                type="file"
                accept=".pdf,.xlsx"
                onChange={(e) =>
                  setFile(
                    e.target.files[0]
                  )
                }
                className="hidden"
              />

              <div className="border border-gray-300 px-6 py-3 rounded-xl bg-white hover:bg-gray-50 transition">

                {file
                  ? file.name
                  : "Choose File"}

              </div>

            </label>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-black text-white px-8 py-4 rounded-2xl text-lg disabled:opacity-50 hover:opacity-90 transition"
            >

              {loading
                ? "Uploading..."
                : "Upload File"}

            </button>

            <p className="text-sm text-gray-500">

              Only .pdf and .xlsx files are accepted

            </p>

            {message && (

              <p className="text-sm text-gray-600">

                {message}

              </p>

            )}

          </div>

        </div>

      </div>

      {/* DOCUMENTS */}

      <div className="bg-white rounded-3xl shadow-lg p-8">

        <h2 className="text-3xl font-bold mb-6">
          Uploaded Documents
        </h2>

        <div className="space-y-4">

          {uploads.map((doc) => (

            <div
              key={doc.id}
              className="border rounded-2xl p-5 hover:shadow-md transition"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold text-lg">

                    {doc.original_filename}

                  </h3>

                  <div className="mt-2 text-sm text-gray-500 space-y-1">

                    <p>
                      Status:
                      {" "}
                      {doc.status}
                    </p>

                    <p>
                      Stage:
                      {" "}
                      {doc.stage}
                    </p>

                    <p>
                      Chunks:
                      {" "}
                      {doc.chunks_created}
                    </p>

                  </div>

                </div>

                <div>

                  {doc.status ===
                  "completed" && (

                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">

                      Ready

                    </div>

                  )}

                  {doc.status ===
                  "processing" && (

                    <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-sm font-medium">

                      Processing

                    </div>

                  )}

                  {doc.status ===
                  "failed" && (

                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-medium">

                      Failed

                    </div>

                  )}

                </div>

              </div>

              {doc.notification && (

                <p className="mt-4 text-green-600 text-sm">

                  {doc.notification}

                </p>

              )}

              {doc.error && (

                <p className="mt-4 text-red-600 text-sm">

                  {doc.error}

                </p>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default UploadCard;