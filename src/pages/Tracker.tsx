
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { JobCard } from "@/components/job/job-card";
import { JobApplication } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/auth";

const Tracker = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "rejected">("all");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchJobs = async () => {
      const user = getCurrentUser();
      
      if (!user) {
        toast.error("Please log in to view your interviews");
        navigate("/login");
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Transform data to match JobApplication type
        const transformedData: JobApplication[] = data.map(job => ({
          id: job.id,
          userId: job.user_id || "",
          companyName: job.company_name,
          role: job.role,
          salaryLPA: job.salary_lpa,
          interviewDate: new Date(job.interview_date),
          status: job.status as "upcoming" | "completed" | "rejected",
          notes: job.notes || "",
          createdAt: new Date(job.created_at),
          updatedAt: new Date(job.updated_at)
        }));
        
        setJobs(transformedData);
      } catch (error) {
        console.error("Error fetching job applications:", error);
        toast.error("Failed to load your interviews");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, [navigate]);
  
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
    } catch (error) {
      console.error("Error deleting job application:", error);
      toast.error("Failed to delete interview");
    }
  };
  
  return (
    <>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Interview Tracker</h1>
              <p className="text-muted-foreground">
                Manage and track all your interview applications
              </p>
            </div>
            <Button 
              onClick={() => navigate("/scheduler")}
              className="sm:w-auto w-full flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Interview
            </Button>
          </div>
          
          {/* Filter Tabs */}
          <Tabs defaultValue="all" className="mb-6"
            onValueChange={(value) => setFilter(value as any)}>
            <TabsList className="grid grid-cols-4 md:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Job List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onDelete={handleDeleteJob} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted/50 rounded-full p-6 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground h-12 w-12"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                  <path d="M8 14h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 18h.01" />
                  <path d="M12 18h.01" />
                  <path d="M16 18h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No interviews found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {filter === "all" 
                  ? "You haven't added any interviews yet. Add your first one to start tracking."
                  : `You don't have any ${filter} interviews.`}
              </p>
              <Button onClick={() => navigate("/scheduler")}>
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
