import api from "../api/axios";

export const loginUser =
  async (
    email,
    password
  ) => {

    const formData =
      new URLSearchParams();

    formData.append(
      "username",
      email
    );

    formData.append(
      "password",
      password
    );

    const response =
      await api.post(
        "/auth/login",
        formData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

    return response.data;
  };

export const registerUser =
  async (data) => {

    const response =
      await api.post(
        "/auth/register",
        data
      );

    return response.data;
  };