
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, ClipboardCheck, Star, Clock } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import Header from "@/components/header";
import Footer from "@/components/footer";

const Index = () => {
  const navigate = useNavigate();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);
  
  return (
    <>
      <Header />
      
      <main className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background to-purple-50 dark:from-background dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-brand-darkPurple">
                    Track, Prepare, Succeed in Your Job Interviews
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Manage all your job applications, prepare for interviews with tailored questions, 
                    rate your performance, and improve your skills all in one place.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => navigate("/register")}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => navigate("/login")}
                  >
                    Log in
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 lg:flex lg:justify-center relative">
                <div className="w-full h-full max-w-[450px] rounded-lg overflow-hidden shadow-xl ring-1 ring-gray-200 dark:ring-gray-800">
                  <div className="bg-white dark:bg-gray-950 p-6 rounded-lg relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Interview Calendar</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-brand-softPurple/30 border border-brand-softPurple/60">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">Google</h4>
                            <p className="text-sm text-muted-foreground">Frontend Developer</p>
                            <div className="flex items-center mt-2">
                              <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">10:00 AM</span>
                            </div>
                          </div>
                          <Button size="sm" variant="secondary">Prepare</Button>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-border">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">Microsoft</h4>
                            <p className="text-sm text-muted-foreground">Software Engineer</p>
                            <div className="flex items-center mt-2">
                              <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">2:30 PM</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">Amazon</h4>
                            <p className="text-sm text-muted-foreground">Full Stack Developer</p>
                            <div className="flex items-center mt-2">
                              <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">11:00 AM</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-brand-darkPurple/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Key Features</h2>
              <p className="text-muted-foreground mx-auto max-w-[700px]">
                Everything you need to ace your next job interview
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Job Tracking</h3>
                <p className="text-muted-foreground">
                  Keep track of all your job applications in one place, including company name, role, salary, and interview schedule.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Interview Prep</h3>
                <p className="text-muted-foreground">
                  Access company-specific interview questions and sample answers to help you prepare effectively.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Self-Rating</h3>
                <p className="text-muted-foreground">
                  Rate your interview performance across multiple criteria and receive personalized feedback and improvement suggestions.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Performance Analytics</h3>
                <p className="text-muted-foreground">
                  Visualize your interview performance over time and identify areas for improvement with detailed analytics.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Reminders & Notifications</h3>
                <p className="text-muted-foreground">
                  Receive timely reminders about upcoming interviews and prompts to reflect on completed ones.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">News & Hiring Feed</h3>
                <p className="text-muted-foreground">
                  Stay updated with the latest job openings and hiring trends from top companies in your industry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="max-w-[900px] mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
              <p className="text-muted-foreground mb-8 max-w-[600px] mx-auto">
                Join thousands of job seekers who are using InterviewPro to prepare for interviews
                and land their dream jobs.
              </p>
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => navigate("/register")}
              >
                Get Started for Free
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Index;
