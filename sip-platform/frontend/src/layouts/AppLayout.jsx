import {
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { getUserFromToken } from "../utils/auth";

function AppLayout() {

  const navigate =
    useNavigate();

  const user =
    getUserFromToken();

  const role =
    user?.role || "user";

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    navigate("/login");
  };

  return (

    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}

      <div className="w-[260px] bg-black text-white flex flex-col">

        {/* LOGO */}

        <div className="p-6 border-b border-gray-800">

          <h1 className="text-4xl font-bold">
            SIP
          </h1>

        </div>

        {/* NAVIGATION */}

        <div className="flex-1 p-5 space-y-3">

          <Link
            to="/app/dashboard"
            className="block px-4 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Sales Intelligence
          </Link>

          <Link
            to="/app/chat"
            className="block px-4 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Chat
          </Link>

          {role === "admin" ? (

            <Link
              to="/app/upload"
              className="block px-4 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Knowledge Base
            </Link>

          ) : (

            <Link
              to="/app/documents"
              className="block px-4 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Documents
            </Link>

          )}

          {role === "admin" && (

            <Link
              to="/app/users"
              className="block px-4 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Users
            </Link>

          )}

        </div>

        {/* FOOTER */}

        <div className="p-5 border-t border-gray-800">

          <div className="mb-5">

            <p className="font-semibold text-lg">
              Logged in as
            </p>

            <p className="text-gray-400 capitalize">
              {role}
            </p>

          </div>

          <button
            onClick={logout}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold"
          >
            Logout
          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 overflow-y-auto p-10">

        <Outlet />

      </div>

    </div>
  );
}

export default AppLayout;