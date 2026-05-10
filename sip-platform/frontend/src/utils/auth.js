export const getUserFromToken = () => {

  try {

    const token =
      localStorage.getItem("token");

    if (!token) {

      return null;
    }

    const payload =
      JSON.parse(
        atob(
          token.split(".")[1]
        )
      );

    return payload;

  } catch (error) {

    console.error(
      "Invalid token",
      error
    );

    return null;
  }
};