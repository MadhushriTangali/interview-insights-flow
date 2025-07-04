
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Star, Zap, TrendingUp } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { StatCard } from "@/components/dashboard/stat-card";
import { UpcomingInterviews } from "@/components/dashboard/upcoming-interviews";
import { JobApplication } from "@/types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useInterviewCleanup } from "@/hooks/useInterviewCleanup";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, session, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasRatings, setHasRatings] = useState(false);

  const fetchInterviews = async () => {
    if (!user || !session) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Filter out past interviews (older than 24 hours)
        const now = new Date();
        const cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        const transformedData: JobApplication[] = data
          .filter(job => new Date(job.interview_date) > cutoffTime)
          .map(job => ({
            id: job.id,
            userId: job.user_id,
            companyName: job.company_name,
            role: job.role,
            salaryLPA: job.salary_lpa,
            interviewDate: new Date(job.interview_date),
            interviewTime: job.interview_time,
            status: job.status as "upcoming" | "completed" | "rejected",
            notes: job.notes || "",
            createdAt: new Date(job.created_at),
            updatedAt: new Date(job.updated_at)
          }));
        
        setJobs(transformedData);
      } else {
        setJobs([]);
      }
    } catch (error: any) {
      console.error("Error fetching interviews:", error);
      toast.error("Failed to load your interviews");
    } finally {
      setLoading(false);
    }
  };

  // Use the cleanup hook to refresh data when interviews are removed
  useInterviewCleanup(fetchInterviews);

  useEffect(() => {
    // Wait for auth to load first
    if (authLoading) return;
    
    // Redirect if not authenticated
    if (!user || !session) {
      navigate("/auth");
      return;
    }
    
    fetchInterviews();
    
    // For demo purposes, we're setting hasRatings to false initially
    // In a real app, this would be fetched from a ratings table
    setHasRatings(false);
  }, [user, session, authLoading, navigate]);

  if (authLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 py-12 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <div className="container max-w-4xl">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const upcomingInterviews = jobs.filter((job) => job.status === "upcoming");
  const completedInterviews = jobs.filter((job) => job.status === "completed");

  // Check if there are any updates to show
  const hasUpdates = jobs.length > 0;

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  // Get next interview or show "None" if no upcoming interviews
  const getNextInterviewDisplay = () => {
    if (upcomingInterviews.length === 0) {
      return { date: "None", company: "No upcoming interviews" };
    }
    
    const nextInterview = upcomingInterviews[0];
    return {
      date: new Date(nextInterview.interviewDate).toLocaleDateString(),
      company: nextInterview.companyName
    };
  };

  const nextInterview = getNextInterviewDisplay();

  return (
    <>
      <Header />
      
      <main className="flex-1 py-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container px-4 md:px-6">
          {/* Welcome Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Welcome back, {userName}! 🚀
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your job applications and prepare for upcoming interviews with confidence
            </p>
          </div>
          
          {/* Quick Stats - Only show counts if there are interviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {!loading && (
              <>
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Upcoming Interviews</p>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{upcomingInterviews.length}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">Scheduled interviews</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed Interviews</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300">{completedInterviews.length}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-green-500 dark:text-green-400 mt-2">Past interviews</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-yellow-200 dark:border-yellow-800 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Performance Rating</p>
                      <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                        {hasRatings ? "N/A" : "N/A"}
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-2">
                    {hasRatings ? "Based on self-evaluations" : "No ratings yet"}
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Next Interview</p>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {nextInterview.date}
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-purple-500 dark:text-purple-400 mt-2">
                    {nextInterview.company}
                  </p>
                </div>
              </>
            )}
            {loading && (
              <div className="col-span-4 flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  className="h-auto py-6 justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate("/scheduler")}
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-white/20 mr-4">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">Schedule Interview</div>
                      <div className="text-sm text-white/80">Add your next opportunity</div>
                    </div>
                  </div>
                </Button>

                <Button 
                  className="h-auto py-6 justify-start bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate("/prep")}
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-white/20 mr-4">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">Prepare</div>
                      <div className="text-sm text-white/80">Practice and improve</div>
                    </div>
                  </div>
                </Button>
              </div>
              
              {/* Latest Updates - Only if there are any updates */}
              {hasUpdates && (
                <div className="rounded-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg">
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Latest Updates
                    </h2>
                    
                    <div className="space-y-4">
                      {jobs.length > 0 && jobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border border-purple-200 dark:border-purple-800">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center shadow-md ${
                            job.status === 'upcoming' 
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                              : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          }`}>
                            {job.status === 'upcoming' ? <Calendar className="h-6 w-6" /> : <CheckCircle className="h-6 w-6" />}
                          </div>
                          <div>
                            <p className="font-medium text-lg">{job.companyName} interview {job.status === 'upcoming' ? 'scheduled' : 'completed'}</p>
                            <p className="text-sm text-muted-foreground">
                              {job.status === 'upcoming' 
                                ? `You have an ${job.status} interview with ${job.companyName} for ${job.role} role.`
                                : `You ${job.status} your interview with ${job.companyName} for ${job.role} role.`
                              }
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(job.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {!hasUpdates && !loading && (
                <div className="rounded-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg p-8 text-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Ready to Get Started?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Schedule your first interview and begin your journey to success!
                  </p>
                  <Button 
                    onClick={() => navigate("/scheduler")}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Schedule Interview
                  </Button>
                </div>
              )}
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              {/* Upcoming Interviews - Only show if there are upcoming interviews */}
              {upcomingInterviews.length > 0 && (
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border-0">
                  <UpcomingInterviews interviews={upcomingInterviews} onRefresh={fetchInterviews} />
                </div>
              )}
              
              {upcomingInterviews.length === 0 && !loading && (
                <div className="rounded-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Upcoming Interviews
                  </h2>
                  <div className="flex flex-col items-center justify-center min-h-[150px] text-center">
                    <div className="p-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 mb-4">
                      <Calendar className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      You don't have any upcoming interviews scheduled
                    </p>
                    <Button 
                      onClick={() => navigate("/scheduler")}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
                    >
                      Schedule Your First Interview
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Dashboard;
