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

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-white px-6 py-8">

      <div className="mx-auto max-w-[1520px] space-y-10">

        {/* HEADER */}

        <div className="space-y-3">

          
          <p className="text-sm uppercase tracking-[0.38em] text-slate-500">

            AI Sales Intelligence

          </p>
          
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900">

            Executive AI intelligence for sales leadership

          </h1>

          <p className="max-w-3xl text-lg leading-8 text-slate-600">

            A modern AI-native command center that surfaces concise sales intelligence, risk signals, and strategic recommendations based on analyzed documents.

          </p>

        </div>

        {/* AI SUMMARY */}

        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 shadow-[0_50px_120px_-60px_rgba(15,23,42,0.5)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-slate-800/40" />

          <div className="pointer-events-none absolute right-0 top-12 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="pointer-events-none absolute left-8 bottom-10 h-44 w-44 rounded-full bg-violet-400/10 blur-3xl" />

          <div className="relative space-y-8">

            <p className="text-sm uppercase tracking-[0.35em] text-slate-300 mb-6">

              AI BUSINESS SUMMARY

            </p>

            <h2 className="text-3xl font-semibold leading-relaxed text-slate-100 max-w-5xl">

              {insights.summary}

            </h2>

          </div>

        </section>

        {/* INSIGHTS GRID */}

        <div className="grid gap-6 sm:grid-cols-2">

          <InsightCard
            title="Growth Opportunities"
            content={insights.growth_opportunities}
            icon="🚀"
            source="Market intelligence"
            tag="Growth signal"
          />

          <InsightCard
            title="Risk Analysis"
            content={
              insights.risk_analysis
            }
            icon="⚠️"
            source="Risk assessment"
            tag="Risk indicator"
          />

          <InsightCard
            title="Top Products"
            content={
              insights.top_products
            }
            icon="🏆"
            source="Sales performance"
            tag="Top performer"
          />

          <InsightCard
            title="Customer Trends"
            content={
              insights.customer_trends
            }
            icon="📈"
            source="Customer behavior"
            tag="Trend indicator"
          />

        </div>

        {/* AI RECOMMENDATIONS */}

        <div className="rounded-[2rem] border border-slate-200/70 bg-white/85 p-7 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.2)]">

          <h2 className="text-sm uppercase tracking-[0.35em] text-slate-500">

            AI Recommendations

          </h2>

          <p className="mt-3 text-3xl font-semibold text-slate-900">

            {insights.recommendations}

          </p>

        </div>

        {/* ADMIN ONLY */}

        <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-8 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.25)]">    
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

        </section>
      </div>
    </div>
  );
}

function InsightCard({
  icon,
  title,
  content,
  source,
  tag,
}) {

  return (

    <div className="group rounded-[2rem] border border-slate-200/50 bg-white/85 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900/5 text-2xl">

            {icon}

          </span>

          <div>

            <h3 className="text-xl font-semibold text-slate-900">

              {title}

            </h3>

            <p className="text-sm text-slate-500">

              {tag}

            </p>

          </div>

        </div>

      </div>

      <p className="mt-5 text-slate-700 leading-7">

        {content}

      </p>

      <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">

        {source}

      </p>

    </div>
  );
}

function StatCard({
  title,
  value,
}) {

  return (

    <div className="rounded-3xl border border-slate-200/60 bg-white/90 p-5 shadow-sm">

      <p className="text-sm text-slate-500">

        {title}

      </p>

      <p className="mt-4 text-3xl font-semibold text-slate-900">

        {value}

      </p>

    </div>
  );
}

