import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-black text-white px-8 py-5 flex justify-between items-center shadow-lg">
      <Link to="/">
        <h1 className="text-3xl font-bold tracking-wide">
          SIP
        </h1>
      </Link>

      <div className="flex gap-8 text-lg">
        <Link
          to="/"
          className="hover:text-gray-300 transition"
        >
          Home
        </Link>

        <Link
          to="/login"
          className="hover:text-gray-300 transition"
        >
          Login
        </Link>

        <Link
          to="/upload"
          className="hover:text-gray-300 transition"
        >
          Upload
        </Link>
        
        <Link
          to="/dashboard"
          className="hover:text-gray-300 transition"
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;