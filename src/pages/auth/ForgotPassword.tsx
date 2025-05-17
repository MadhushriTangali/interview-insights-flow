
import { Link } from "react-router-dom";
import { AuthForm } from "@/components/auth/auth-form";
import { Calendar } from "lucide-react";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Left Panel (hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-primary/10 flex-col justify-center items-center p-10">
          <div className="max-w-md mx-auto space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="size-6 text-primary" />
              <span className="font-bold text-2xl">InterviewPro</span>
            </div>
            <h1 className="text-2xl font-bold">Password Recovery</h1>
            <p className="text-muted-foreground">
              No worries! It happens to the best of us. Enter your email address and we'll send you 
              a link to reset your password.
            </p>
            
            <div className="mt-8">
              <img 
                src="https://illustrations.popsy.co/amber/meditation.svg" 
                alt="Forgot Password Illustration" 
                className="max-w-[300px] mx-auto"
              />
            </div>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-10">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center md:justify-start mb-8">
              <Link to="/" className="md:hidden flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                <span className="font-bold text-xl">InterviewPro</span>
              </Link>
            </div>
            
            <div className="text-center md:text-left mb-8">
              <h1 className="text-2xl font-bold">Forgot your password?</h1>
              <p className="text-muted-foreground mt-2">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>
            
            <AuthForm type="forgot" />
            
            <div className="mt-8 text-center">
              <Link to="/login" className="text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
