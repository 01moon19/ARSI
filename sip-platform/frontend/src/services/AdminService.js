import api from "../api/axios";

export const getUsers =
  async () => {

    const response =
      await api.get(
        "/admin/users"
      );

    return response.data;
  };

export const approveUser =
  async (userId) => {

    const response =
      await api.patch(
        `/admin/users/${userId}/approve`
      );

    return response.data;
  };

export const deleteUser =
  async (userId) => {

    const response =
      await api.delete(
        `/admin/users/${userId}`
      );

    return response.data;
  };