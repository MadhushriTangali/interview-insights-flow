
import { Link } from "react-router-dom";
import { AuthForm } from "@/components/auth/auth-form";
import { Calendar } from "lucide-react";

const Register = () => {
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
            <h1 className="text-2xl font-bold">Start your journey to interview success</h1>
            <p className="text-muted-foreground">
              Create an account to track job applications, prepare for interviews, and improve your skills with personalized feedback.
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
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h.01" />
                    <path d="M17 7h.01" />
                    <path d="M7 12h.01" />
                    <path d="M17 12h.01" />
                    <path d="M7 17h.01" />
                    <path d="M17 17h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Free to Get Started</h3>
                  <p className="text-sm text-muted-foreground">
                    Create your account in minutes, no credit card required
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
                    <path d="M2.5 18.5A9 9 0 1 1 16.2 7.8" />
                    <path d="m14 8-4.5 4.5" />
                    <path d="M14 12V8h-4" />
                    <path d="M3.23 10.7c-.4.16-.78.34-1.13.54" />
                    <path d="M7.5 2.07c-.17.39-.33.77-.47 1.17" />
                    <path d="M2.05 5.77c.28.3.55.6.8.92" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Intelligent Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Track your progress and identify areas for improvement
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
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="m9 14 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Personalized Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    Get tailored questions and tips based on your target companies
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
              <h1 className="text-2xl font-bold">Create an account</h1>
              <p className="text-muted-foreground mt-2">
                Enter your details to create your account
              </p>
            </div>
            
            <AuthForm type="register" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
