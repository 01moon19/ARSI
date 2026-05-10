import {
  useEffect,
  useState,
} from "react";

import {
  getDashboardData,
} from "../services/dashboardService";

export default function DashboardPage() {

  const [dashboard, setDashboard] =
    useState(null);

  const [loaded, setLoaded] =
  useState(false);

  useEffect(() => {

    if (!loaded) {

      fetchDashboard();

      setLoaded(true);
    }

  }, [loaded]);

  const fetchDashboard =
    async () => {

      try {

        const data =
          await getDashboardData();

        setDashboard(data);

      } catch (error) {

        console.error(error);
      }
    };

  if (!dashboard) {

    return (

      <div className="space-y-6">

        <div className="h-20 bg-gray-200 rounded-3xl animate-pulse" />

        <div className="grid grid-cols-2 gap-6">

          <div className="h-52 bg-gray-200 rounded-2xl animate-pulse" />

          <div className="h-52 bg-gray-200 rounded-2xl animate-pulse" />

          <div className="h-52 bg-gray-200 rounded-2xl animate-pulse" />

          <div className="h-52 bg-gray-200 rounded-2xl animate-pulse" />

        </div>

      </div>
    );
  }

  const insights =
    dashboard.business_insights;

  const systemAnalytics =
    dashboard.system_analytics;

  const isAdmin =
    !!systemAnalytics;

  return (

    <div className="space-y-10">

      {/* HEADER */}

      <div>

        <h1 className="text-5xl font-bold mb-2">

          Dashboard

        </h1>

        <p className="text-gray-500 text-lg">

          AI-powered business intelligence insights

        </p>

      </div>

      {/* AI SUMMARY */}

      <div className="bg-black text-white rounded-3xl p-8 shadow-lg">

        <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">

          AI BUSINESS SUMMARY

        </p>

        <h2 className="text-3xl font-bold leading-relaxed">

          {insights.summary}

        </h2>

      </div>

      {/* INSIGHTS GRID */}

      <div className="grid grid-cols-2 gap-6">

        <InsightCard
          title="Growth Opportunities"
          content={
            insights.growth_opportunities
          }
        />

        <InsightCard
          title="Risk Analysis"
          content={
            insights.risk_analysis
          }
        />

        <InsightCard
          title="Top Products"
          content={
            insights.top_products
          }
        />

        <InsightCard
          title="Customer Trends"
          content={
            insights.customer_trends
          }
        />

      </div>

      {/* AI RECOMMENDATIONS */}

      <div className="bg-white rounded-2xl p-8 shadow-md">

        <h2 className="text-2xl font-bold mb-5">

          AI Recommendations

        </h2>

        <p className="text-gray-700 leading-relaxed">

          {insights.recommendations}

        </p>

      </div>

      {/* ADMIN ONLY */}

      {isAdmin && (

        <>

          {/* SYSTEM ANALYTICS */}

          <div>

            <h2 className="text-3xl font-bold mb-6">

              System Analytics

            </h2>

            <div className="grid grid-cols-5 gap-6">

              <StatCard
                title="Documents"
                value={
                  systemAnalytics.total_documents
                }
              />

              <StatCard
                title="Users"
                value={
                  systemAnalytics.total_users
                }
              />

              <StatCard
                title="Processed"
                value={
                  systemAnalytics.processed_documents
                }
              />

              <StatCard
                title="Failed"
                value={
                  systemAnalytics.failed_documents
                }
              />

              <StatCard
                title="Processing"
                value={
                  systemAnalytics.processing_documents
                }
              />

            </div>

          </div>

          {/* RECENT UPLOADS */}

          <div className="bg-white rounded-2xl p-6 shadow-md">

            <h2 className="text-2xl font-bold mb-6">

              Recent Uploads

            </h2>

            <table className="w-full">

              <thead>

                <tr className="border-b text-left">

                  <th className="py-3">
                    Document
                  </th>

                  <th>Status</th>

                  <th>Chunks</th>

                  <th>Uploaded</th>

                </tr>

              </thead>

              <tbody>

                {systemAnalytics.recent_uploads.map(
                  (upload) => (

                    <tr
                      key={upload.id}
                      className="border-b"
                    >

                      <td className="py-4">

                        {upload.filename}

                      </td>

                      <td>

                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm capitalize">

                          {upload.status}

                        </span>

                      </td>

                      <td>

                        {upload.chunks}

                      </td>

                      <td>

                        {new Date(
                          upload.uploaded_at
                        ).toLocaleDateString()}

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </>

      )}

    </div>
  );
}

function InsightCard({
  title,
  content,
}) {

  return (

    <div className="bg-white rounded-2xl p-6 shadow-md">

      <h3 className="text-xl font-semibold mb-4">

        {title}

      </h3>

      <p className="text-gray-600 leading-relaxed">

        {content}

      </p>

    </div>
  );
}

function StatCard({
  title,
  value,
}) {

  return (

    <div className="bg-white rounded-2xl p-6 shadow-md">

      <p className="text-gray-500 mb-2">

        {title}

      </p>

      <h2 className="text-4xl font-bold">

        {value}

      </h2>

    </div>
  );
}