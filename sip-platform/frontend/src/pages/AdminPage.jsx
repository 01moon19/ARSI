import {
  useEffect,
  useState,
} from "react";

import {
  getUsers,
  approveUser,
  deleteUser,
} from "../services/AdminService";

function AdminPage() {

  const [users, setUsers] =
    useState([]);

  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers =
    async () => {

      try {

        const data =
          await getUsers();

        setUsers(data);

      } catch (error) {

        console.error(error);
      }
    };

  const handleApprove =
    async (userId) => {

      try {

        await approveUser(
          userId
        );

        fetchUsers();

      } catch (error) {

        console.error(error);
      }
    };

  const handleDelete =
    async (userId) => {

      try {

        await deleteUser(
          userId
        );

        fetchUsers();

      } catch (error) {

        console.error(error);
      }
    };

  return (

    <div>

      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Users
        </h2>

        <div className="space-y-4">

          {users.map((user) => (

            <div
              key={user.id}
              className="border rounded-xl p-5 flex items-center justify-between"
            >

              <div>

                <p className="font-semibold">
                  {user.email}
                </p>

                <p className="text-sm text-gray-500">

                  Active:
                  {" "}
                  {user.is_active
                    ? "Yes"
                    : "No"}

                </p>

                <p className="text-sm text-gray-500">

                  Role:
                  {" "}
                  {user.role}

                </p>

              </div>

              <div className="flex gap-3">

                {!user.is_active && (

                  <button
                    onClick={() =>
                      handleApprove(
                        user.id
                      )
                    }
                    className="bg-green-500 text-white px-4 py-2 rounded-xl"
                  >
                    Approve
                  </button>

                )}

                <button
                  onClick={() =>
                    handleDelete(
                      user.id
                    )
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default AdminPage;