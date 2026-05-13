import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Input from "../components/Input";
import Button from "../components/Button";

import { registerUser } from "../services/AuthService";

function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    // Prevent default form submission
    if (e) e.preventDefault();

    if (!email || !password) {
      setError("Please provide both an email and a password.");
      return;
    }

    try {
      setError("");
      setMessage("");
      setIsLoading(true);

      const data = await registerUser({
        email,
        password,
      });

      console.log("Register Success:", data);

      setMessage("Registration successful. Waiting for admin approval...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error("Register Error:", error);
      setError(error.response?.data?.detail || "Registration failed. Please try again.");
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-[#172B4D] tracking-tight">
              Sign up for an account
            </h1>
            <p className="text-sm text-[#5E6C84] mt-1">
              Request access to the SIP Workspace
            </p>
          </div>

          {/* Success Banner */}
          {message && (
            <div className="bg-[#E3FCEF] text-[#006644] px-3 py-2.5 rounded text-sm font-medium mb-5 flex items-start gap-2">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              {message}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-[#FFEBE6] text-[#BF2600] px-3 py-2.5 rounded text-sm font-medium mb-5 flex items-start gap-2">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form className="space-y-5" onSubmit={handleRegister}>
            
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[#5E6C84]">
                Email address
              </label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || message !== ""}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[#5E6C84]">
                Create password
              </label>
              <Input
                type="password"
                placeholder="Enter a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || message !== ""}
              />
            </div>

            <div className="pt-2">
              <Button 
                type="submit"
                disabled={isLoading || message !== ""} 
                className="w-full flex justify-center py-2 text-sm"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  "Sign up"
                )}
              </Button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-6 border-t border-[#DFE1E6] text-center">
            <p className="text-sm text-[#5E6C84]">
              Already have an account?{" "}
              <span
                className="text-[#0052CC] hover:underline cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] rounded"
                tabIndex="0"
                onClick={() => navigate("/login")}
                onKeyDown={(e) => e.key === 'Enter' && navigate("/login")}
              >
                Log in
              </span>
            </p>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default RegisterPage;