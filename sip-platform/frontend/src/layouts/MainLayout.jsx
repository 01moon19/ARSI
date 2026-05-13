import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FAFBFC] font-sans antialiased text-[#172B4D] flex flex-col">
      
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-8 md:px-8 md:py-10">
        {children}
      </main>

    </div>
  );
}

export default MainLayout;