import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Input from "../components/Input";
import Button from "../components/Button";

import { loginUser } from "../services/AuthService";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    // Prevent default form submission if triggered via Enter key
    if (e) e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      const data = await loginUser(email, password);

      localStorage.setItem("token", data.access_token);

      const payload = JSON.parse(atob(data.access_token.split(".")[1]));

      if (payload.role === "admin") {
        navigate("/app/users");
      } else {
        navigate("/app/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.response?.data?.detail || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 font-sans antialiased">
        
        {/* Auth Card Container */}
        <div className="w-full max-w-[400px] bg-[#FFFFFF] border border-[#DFE1E6] rounded shadow-sm p-8">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-10 h-10 bg-[#0052CC] rounded flex items-center justify-center text-white shadow-sm mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-[#172B4D] tracking-tight">
              Log in to your account
            </h1>
          </div>

          {/* Error Banner (Atlassian Style) */}
          {error && (
            <div className="bg-[#FFEBE6] text-[#BF2600] px-3 py-2.5 rounded text-sm font-medium mb-5 flex items-start gap-2">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[#5E6C84]">
                Email address
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[#5E6C84]">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="pt-2">
              <Button 
                type="submit"
                disabled={isLoading} 
                className="w-full flex justify-center py-2 text-sm"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-6 border-t border-[#DFE1E6] text-center">
            <p className="text-sm text-[#5E6C84]">
              Don't have an account?{" "}
              <span
                className="text-[#0052CC] hover:underline cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] rounded"
                tabIndex="0"
                onClick={() => navigate("/register")}
                onKeyDown={(e) => e.key === 'Enter' && navigate("/register")}
              >
                Sign up for an account
              </span>
            </p>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default LoginPage;