import { useEffect, useState } from "react";
import { getDashboardData } from "../services/DashboardService";

export default function DashboardPage() {

  const [dashboard, setDashboard] =
    useState(null);

  useEffect(() => {

    const cachedDashboard =
      sessionStorage.getItem(
        "dashboardData"
      );

    if (cachedDashboard) {

      setDashboard(
        JSON.parse(cachedDashboard)
      );

      return;
    }

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      const data =
        await getDashboardData();

      setDashboard(data);

      sessionStorage.setItem(
        "dashboardData",
        JSON.stringify(data)
      );

    } catch (error) {

      console.error(error);
    }
  };

  if (!dashboard) {
    return (
      <div className="space-y-6 w-full max-w-[1280px] mx-auto font-sans">
        <div className="h-20 bg-[#FAFBFC] border border-[#DFE1E6] rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-40 bg-[#FAFBFC] border border-[#DFE1E6] rounded animate-pulse" />
          <div className="h-40 bg-[#FAFBFC] border border-[#DFE1E6] rounded animate-pulse" />
          <div className="h-40 bg-[#FAFBFC] border border-[#DFE1E6] rounded animate-pulse" />
          <div className="h-40 bg-[#FAFBFC] border border-[#DFE1E6] rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const insights = dashboard.business_insights;
  const systemAnalytics = dashboard.system_analytics;
  const isAdmin = !!systemAnalytics;

  return (
    <div className="w-full max-w-[1280px] mx-auto font-sans antialiased space-y-8">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-1 border-b border-[#DFE1E6] pb-6">
        <div className="flex items-center gap-2 text-[#5E6C84] text-sm mb-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
          <span>Dashboards / AI Sales Intelligence</span>
        </div>
        <h1 className="text-2xl font-semibold text-[#172B4D] tracking-tight">
          Executive Command Center
        </h1>
        <p className="text-[#5E6C84] text-sm">
          A dynamic workspace surfacing concise sales intelligence, risk signals, and strategic recommendations derived from ingested data.
        </p>
      </div>

      {/* AI BUSINESS SUMMARY (Jira Info Banner Style) */}
      <section className="bg-[#E6EFFC] border border-[#B3D4FF] rounded-md p-6 flex gap-4 items-start shadow-sm">
        <div className="mt-1 text-[#0052CC] shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
        <div>
          <h2 className="text-[11px] font-bold text-[#0052CC] uppercase tracking-wider mb-2">
            AI Executive Summary
          </h2>
          <p className="text-base text-[#172B4D] leading-relaxed font-medium">
            {insights.summary}
          </p>
        </div>
      </section>

      {/* INSIGHTS GRID */}
      <div className="grid gap-6 sm:grid-cols-2">
        <InsightCard
          title="Growth Opportunities"
          content={insights.growth_opportunities}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          }
          iconColor="text-[#006644]"
          iconBg="bg-[#E3FCEF]"
          source="Market intelligence"
          tag="Growth Signal"
        />

        <InsightCard
          title="Risk Analysis"
          content={insights.risk_analysis}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          }
          iconColor="text-[#BF2600]"
          iconBg="bg-[#FFEBE6]"
          source="Risk assessment"
          tag="Risk Indicator"
        />

        <InsightCard
          title="Top Products"
          content={insights.top_products}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          }
          iconColor="text-[#FF8B00]"
          iconBg="bg-[#FFFAE6]"
          source="Sales performance"
          tag="Top Performer"
        />

        <InsightCard
          title="Customer Trends"
          content={insights.customer_trends}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          }
          iconColor="text-[#0052CC]"
          iconBg="bg-[#DEEBFF]"
          source="Customer behavior"
          tag="Trend Indicator"
        />
      </div>

      {/* AI RECOMMENDATIONS */}
      <div className="bg-[#FFFFFF] border border-[#DFE1E6] rounded shadow-sm p-6 border-l-4 border-l-[#36B37E]">
        <h2 className="text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider mb-2">
          Strategic Recommendations
        </h2>
        <p className="text-[#172B4D] text-base leading-relaxed font-medium">
          {insights.recommendations}
        </p>
      </div>

      {/* ADMIN ONLY SECTION */}
      {isAdmin && (
        <section className="space-y-8 pt-8 border-t border-[#DFE1E6]">
          
          {/* SYSTEM ANALYTICS */}
          <div>
            <h2 className="text-xl font-semibold text-[#172B4D] mb-4">
              System Analytics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard title="Total Documents" value={systemAnalytics.total_documents} />
              <StatCard title="Active Users" value={systemAnalytics.total_users} />
              <StatCard title="Processed Docs" value={systemAnalytics.processed_documents} />
              <StatCard title="Failed Ingestions" value={systemAnalytics.failed_documents} alert={systemAnalytics.failed_documents > 0} />
              <StatCard title="Processing Queue" value={systemAnalytics.processing_documents} />
            </div>
          </div>

          {/* RECENT UPLOADS TABLE */}
          <div className="bg-[#FFFFFF] border border-[#DFE1E6] rounded shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#DFE1E6] bg-[#FAFBFC]">
              <h2 className="text-[#172B4D] text-base font-semibold">
                Recent Ingestion Activity
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#DFE1E6] bg-[#FFFFFF]">
                    <th className="px-5 py-3 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider">Document Name</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider">Vector Chunks</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider text-right">Upload Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFE1E6]">
                  {systemAnalytics.recent_uploads.map((upload) => (
                    <tr key={upload.id} className="hover:bg-[#FAFBFC] transition-colors group">
                      <td className="px-5 py-3 text-sm font-medium text-[#0052CC] cursor-pointer hover:underline">
                        {upload.filename}
                      </td>
                      <td className="px-5 py-3">
                        {upload.status === "completed" && (
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#E3FCEF] text-[#006644]">
                             Completed
                           </span>
                        )}
                        {upload.status === "processing" && (
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#DEEBFF] text-[#0747A6]">
                             Processing
                           </span>
                        )}
                        {upload.status === "failed" && (
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FFEBE6] text-[#BF2600]">
                             Failed
                           </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm text-[#172B4D]">
                        {upload.chunks}
                      </td>
                      <td className="px-5 py-3 text-sm text-[#5E6C84] text-right">
                        {new Date(upload.uploaded_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {systemAnalytics.recent_uploads.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-5 py-8 text-center text-[#5E6C84] text-sm">
                        No recent upload activity found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Reusable Sub-components

function InsightCard({ icon, iconColor, iconBg, title, content, source, tag }) {
  return (
    <div className="bg-[#FFFFFF] border border-[#DFE1E6] rounded shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center ${iconBg} ${iconColor}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-[#172B4D] font-semibold text-base leading-tight">
              {title}
            </h3>
            <p className="text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider mt-0.5">
              {tag}
            </p>
          </div>
        </div>
      </div>
      <p className="text-[#172B4D] text-sm leading-relaxed mb-4">
        {content}
      </p>
      <div className="text-xs text-[#5E6C84] flex items-center gap-1.5 border-t border-[#DFE1E6] pt-3">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        Source: {source}
      </div>
    </div>
  );
}

function StatCard({ title, value, alert = false }) {
  return (
    <div className={`bg-[#FFFFFF] border rounded p-4 shadow-sm flex flex-col justify-center ${alert ? 'border-[#DE350B]' : 'border-[#DFE1E6]'}`}>
      <p className="text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider mb-1 truncate">
        {title}
      </p>
      <p className={`text-2xl font-semibold ${alert ? 'text-[#DE350B]' : 'text-[#172B4D]'}`}>
        {value}
      </p>
    </div>
  );
}