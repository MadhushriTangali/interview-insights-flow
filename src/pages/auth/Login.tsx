
import { Link } from "react-router-dom";
import { AuthForm } from "@/components/auth/auth-form";
import { Calendar } from "lucide-react";

const Login = () => {
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
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">
              Log in to continue your journey to interview success. Track your job applications,
              prepare effectively, and improve your interview skills.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 2v4" />
                    <path d="M12 18v4" />
                    <path d="M4.93 4.93l2.83 2.83" />
                    <path d="M16.24 16.24l2.83 2.83" />
                    <path d="M2 12h4" />
                    <path d="M18 12h4" />
                    <path d="M4.93 19.07l2.83-2.83" />
                    <path d="M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Track Job Applications</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep all your job applications organized in one place
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Prepare Effectively</h3>
                  <p className="text-sm text-muted-foreground">
                    Access company-specific interview questions and sample answers
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5Z" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Improve with Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Rate your performance and get personalized improvement tips
                  </p>
                </div>
              </div>
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
              <h1 className="text-2xl font-bold">Sign in to your account</h1>
              <p className="text-muted-foreground mt-2">
                Enter your credentials to access your account
              </p>
            </div>
            
            <AuthForm type="login" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
