
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Target, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { JobCard } from "@/components/job/job-card";
import { JobApplication } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useInterviewCleanup } from "@/hooks/useInterviewCleanup";
import { useAutoUpdateExpiredInterviews } from "@/hooks/useAutoUpdateExpiredInterviews";

const Tracker = () => {
  const navigate = useNavigate();
  const { user, session, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "rejected" | "succeeded">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchJobs = async () => {
    if (!user || !session) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform data to match JobApplication type
        const transformedData: JobApplication[] = data.map(job => ({
          id: job.id,
          userId: job.user_id,
          companyName: job.company_name,
          role: job.role,
          salaryLPA: job.salary_lpa,
          interviewDate: new Date(job.interview_date),
          interviewTime: job.interview_time,
          status: job.status as "upcoming" | "completed" | "rejected" | "succeeded",
          notes: job.notes || "",
          createdAt: new Date(job.created_at),
          updatedAt: new Date(job.updated_at)
        }));
        
        setJobs(transformedData);
      } else {
        setJobs([]);
      }
    } catch (error: any) {
      console.error("Error fetching job applications:", error);
      setError(error.message || "Failed to load your interviews");
      toast.error("Failed to load your interviews");
    } finally {
      setIsLoading(false);
    }
  };

  // Use the cleanup hook to refresh data when interviews are removed
  useInterviewCleanup(fetchJobs);
  
  // Use the auto-update hook to handle expired interviews
  useAutoUpdateExpiredInterviews(fetchJobs);
  
  useEffect(() => {
    // Wait for auth to load first
    if (authLoading) return;
    
    if (!user || !session) {
      toast.error("Please log in to view your interviews");
      navigate("/auth");
      return;
    }
    
    fetchJobs();
  }, [user, session, authLoading, navigate]);
  
  // Filter jobs based on status
  const filteredJobs = filter === "all" 
    ? jobs 
    : jobs.filter(job => job.status === filter);
  
  const handleDeleteJob = async (id: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setJobs(jobs.filter(job => job.id !== id));
      toast.success("Interview deleted successfully");
    } catch (error: any) {
      console.error("Error deleting job application:", error);
      toast.error("Failed to delete interview");
    }
  };

  // Get stats for display
  const stats = {
    total: jobs.length,
    upcoming: jobs.filter(job => job.status === "upcoming").length,
    completed: jobs.filter(job => job.status === "completed").length,
    rejected: jobs.filter(job => job.status === "rejected").length,
    succeeded: jobs.filter(job => job.status === "succeeded").length,
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 py-12 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 min-h-screen">
          <div className="container max-w-4xl">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gradient-to-r from-purple-600 to-blue-600 border-t-transparent"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      
      <main className="flex-1 py-12 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 min-h-screen">
        <div className="container px-4 md:px-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white shadow-xl">
                <Target className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Interview Tracker
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Manage and track all your interview applications with powerful insights and analytics to accelerate your career growth.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.total}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Total</div>
              </div>
            </div>
            
            <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.upcoming}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Upcoming</div>
              </div>
            </div>
            
            <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.completed}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Completed</div>
              </div>
            </div>
            
            <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.succeeded}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Succeeded</div>
              </div>
            </div>
            
            <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Rejected</div>
              </div>
            </div>
          </div>

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Your Interviews</h2>
              <p className="text-lg text-muted-foreground">
                Track your progress and stay organized
              </p>
            </div>
            <Button 
              onClick={() => navigate("/scheduler")}
              className="sm:w-auto w-full flex items-center gap-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3 text-lg font-semibold"
            >
              <Plus className="h-5 w-5" />
              Add New Interview
            </Button>
          </div>
          
          {/* Filter Tabs */}
          <div className="mb-8">
            <Tabs defaultValue="all" className="w-full"
              onValueChange={(value) => setFilter(value as any)}>
              <TabsList className="grid grid-cols-5 md:w-[600px] h-14 p-1 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 shadow-lg">
                <TabsTrigger value="all" className="text-base font-semibold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                  All ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="text-base font-semibold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
                  Upcoming ({stats.upcoming})
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-base font-semibold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-gray-700 data-[state=active]:text-white">
                  Completed ({stats.completed})
                </TabsTrigger>
                <TabsTrigger value="succeeded" className="text-base font-semibold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
                  Succeeded ({stats.succeeded})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="text-base font-semibold rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                  Rejected ({stats.rejected})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Job List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-purple-600 to-blue-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-8 mb-6">
                <XCircle className="text-red-500 h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">Error Loading Interviews</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl"
              >
                Try Again
              </Button>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onDelete={handleDeleteJob} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full p-8 mb-6">
                <Target className="text-purple-600 dark:text-purple-400 h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                {filter === "all" ? "No interviews found" : `No ${filter} interviews`}
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
                {filter === "all" 
                  ? "You haven't added any interviews yet. Start tracking your career journey by scheduling your first interview."
                  : `You don't have any ${filter} interviews at the moment.`}
              </p>
              <Button 
                onClick={() => navigate("/scheduler")}
                className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Schedule Your First Interview
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Tracker;
