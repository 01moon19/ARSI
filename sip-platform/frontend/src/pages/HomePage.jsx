import MainLayout from "../layouts/MainLayout";

import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";

function HomePage() {

  return (

    <MainLayout>

      <div className="min-h-screen bg-gray-100">

        {/* HERO SECTION */}

        <section className="flex flex-col items-center justify-center text-center px-6 py-28">

          <h1 className="text-7xl font-extrabold mb-6 leading-tight">

            Sales Intelligence

            <br />

            Powered by AI

          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mb-10">

            An Agentic RAG based platform that helps businesses analyze data,
            generate insights, and automate intelligent workflows.

          </p>

          <div className="flex gap-6">

            <Button>

              Get Started

            </Button>

            <button className="border border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition">

              Learn More

            </button>

          </div>

        </section>

        {/* FEATURES */}

        <section className="px-10 pb-20">

          <h2 className="text-5xl font-bold text-center mb-14">

            Features

          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <FeatureCard
              title="AI Search"
              description="Retrieve intelligent business insights using RAG-powered contextual search."
            />

            <FeatureCard
              title="Analytics"
              description="Visualize customer and sales data with real-time dashboards."
            />

            <FeatureCard
              title="Automation"
              description="Automate repetitive business workflows using intelligent AI agents."
            />

          </div>

        </section>

      </div>

    </MainLayout>
  );
}

export default HomePage;