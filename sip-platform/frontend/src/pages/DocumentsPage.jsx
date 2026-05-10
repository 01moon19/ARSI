import {
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

import {
  getUploads,
} from "../services/uploadService";

import {
  getUserFromToken,
} from "../utils/auth";

function DocumentsPage() {

  const [documents, setDocuments] =
    useState([]);

  const user =
    getUserFromToken();

  const isAdmin =
    user?.role === "admin";

  useEffect(() => {

    fetchDocuments();

  }, []);

  const fetchDocuments =
    async () => {

      try {

        const data =
          await getUploads();

        setDocuments(
          data.documents
        );

      } catch (error) {

        console.error(
          "Failed to fetch documents",
          error
        );
      }
    };

  const handleDownload =
    async (
      documentId,
      filename
    ) => {

      try {

        const response =
          await api.get(
            `/${documentId}/download`,
            {
              responseType:
                "blob",
            }
          );

        const url =
          window.URL.createObjectURL(
            new Blob([
              response.data,
            ])
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.setAttribute(
          "download",
          filename
        );

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

      } catch (error) {

        console.error(
          "Download failed",
          error
        );
      }
    };

  return (

    <div>

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-5xl font-bold mb-3">

          Documents

        </h1>

        <p className="text-gray-600 text-lg">

          Browse uploaded knowledge base documents.

        </p>

      </div>

      {/* DOCUMENT LIST */}

      <div className="bg-white rounded-2xl shadow-md p-6">

        <div className="space-y-5">

          {documents.length === 0 && (

            <div className="text-center py-10 text-gray-500">

              No documents available.

            </div>

          )}

          {documents.map((doc) => (

            <div
              key={doc.id}
              className="border rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition"
            >

              {/* FILE INFO */}

              <div>

                <p className="text-xl font-semibold">

                  {doc.original_filename}

                </p>

                <p className="text-sm text-gray-500 mt-1 capitalize">

                  Status:
                  {" "}
                  {doc.status}

                </p>

              </div>

              {/* USER ONLY DOWNLOAD */}

              {!isAdmin && (

                <button
                  onClick={() =>
                    handleDownload(
                      doc.id,
                      doc.original_filename
                    )
                  }
                  className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
                >

                  Download

                </button>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default DocumentsPage;