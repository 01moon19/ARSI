import Navbar from "../components/Navbar";

function MainLayout({
  children,
}) {

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <main>

        {children}

      </main>

    </div>
  );
}

export default MainLayout;