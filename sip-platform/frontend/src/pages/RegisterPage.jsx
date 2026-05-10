import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Input from "../components/Input";
import Button from "../components/Button";

import {
  registerUser,
} from "../services/AuthService";

function RegisterPage() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleRegister =
    async () => {

      try {

        setError("");
        setMessage("");

        const data =
          await registerUser({
            email,
            password,
          });

        console.log(
          "Register Success:",
          data
        );

        setMessage(
          "Registration successful. Wait for admin approval."
        );

        setTimeout(() => {

          navigate(
            "/login"
          );

        }, 2000);

      } catch (error) {

        console.error(
          "Register Error:",
          error
        );

        setError(
          error.response?.data?.detail ||
          "Registration failed"
        );
      }
    };

  return (

    <MainLayout>

      <div className="min-h-[85vh] flex items-center justify-center px-6">

        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl">

          <h1 className="text-4xl font-bold mb-8 text-center">

            Register

          </h1>

          {message && (

            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-5">

              {message}

            </div>

          )}

          {error && (

            <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-5">

              {error}

            </div>

          )}

          <div className="space-y-5">

            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  handleRegister();
                }
              }}
            />

            <div className="pt-2">

              <Button
                onClick={
                  handleRegister
                }
              >

                Register

              </Button>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default RegisterPage;