import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <div className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Track Your</span>
                <span className="block text-blue-600 dark:text-blue-400">Interview Journey</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Organize your job applications, prepare for interviews, and land your dream job with our comprehensive interview tracking platform.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Button
                    onClick={() => navigate("/auth")}
                    size="lg"
                    className="w-full flex items-center justify-center px-8 py-3 text-base font-medium"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/auth")}
                    size="lg"
                    className="w-full flex items-center justify-center px-8 py-3 text-base font-medium"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-700 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <p className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Features</p>
              <h2 className="mt-2 text-3xl leading-8 font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                Everything you need to succeed
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
                Our platform is designed to help you stay organized, prepared, and confident throughout your interview process.
              </p>
            </div>

            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Track Applications</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                    Easily log and monitor your job applications, from submission to offer.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 4.75 7.5 4.75a4.5 4.5 0 00-4.5 4.5c0 1.789 2.913 3.93 6.75 3.93zm4.5 5.814v-1.122c0-.414-.895-.75-2-1.122M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Interview Preparation</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                    Access resources and tips to help you prepare for technical and behavioral questions.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.002 0M3 15l3-1.5m0 0l-3-6a5.002 5.002 0 006.002 0M6 7.5l12 2.25M6 16.5l12-2.25M18 7.5l-6 2.25m6 6l-6-2.25" />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Real-time Feedback</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                    Get insights into your performance with tools for self-evaluation and feedback collection.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Notes and Insights</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                    Keep detailed notes on each interview, track key insights, and refine your strategy.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
