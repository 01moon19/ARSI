import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";

function HomePage() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="flex flex-col font-sans antialiased selection:bg-[#DEEBFF] selection:text-[#0747A6]">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-24">
          
          {/* Status/Version Lozenge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DEEBFF] text-[#0747A6] text-xs font-bold uppercase tracking-wider rounded mb-8">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            SIP Workspace v2.0
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#172B4D] tracking-tight leading-tight">
            Sales Intelligence <br />
            <span className="text-[#0052CC]">Powered by AI</span>
          </h1>

          <p className="text-lg text-[#5E6C84] max-w-2xl mb-10 leading-relaxed">
            An Agentic RAG-based platform that helps businesses analyze ingested data, 
            generate strategic insights, and automate intelligent workflows from a centralized command center.
          </p>

          <div className="flex items-center gap-4">
            <Button 
              variant="primary" 
              onClick={() => navigate("/register")}
              className="px-6 py-2.5 text-base"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/about")}
              className="px-6 py-2.5 text-base flex items-center gap-2"
            >
              View Architecture
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Button>
          </div>

        </section>

        {/* FEATURES SECTION */}
        <section className="pt-20 pb-24 border-t border-[#DFE1E6]">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-[#172B4D] mb-3">
              Platform Capabilities
            </h2>
            <p className="text-[#5E6C84] text-base max-w-xl mx-auto">
              Everything your team needs to turn raw CRM data and external web intelligence into closed deals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              title="AI Search & Retrieval"
              description="Retrieve intelligent business insights using RAG-powered contextual search against your secure vector databases."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              }
            />

            <FeatureCard
              title="Executive Analytics"
              description="Visualize customer trends, market movements, and pipeline performance with real-time dashboards."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
              }
            />

            <FeatureCard
              title="Agentic Automation"
              description="Automate repetitive business workflows and multi-step research tasks using intelligent autonomous AI agents."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              }
            />
          </div>

        </section>

      </div>
    </MainLayout>
  );
}

export default HomePage;