import { useState } from "react";

import MainLayout from "../layouts/MainLayout";
import Input from "../components/Input";
import Button from "../components/Button";

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log({
      email,
      password,
    });
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        
        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl">
          
          <h1 className="text-4xl font-bold mb-8 text-center">
            Login
          </h1>

          <div className="space-y-5">
            
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="pt-2">
              <Button onClick={handleLogin}>
                Login
              </Button>
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default LoginPage;