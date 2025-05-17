
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { JobCard } from "@/components/job/job-card";
import { dummyJobs, JobApplication } from "@/types";
import { toast } from "sonner";

const Tracker = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobApplication[]>(dummyJobs);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "rejected">("all");
  
  // Filter jobs based on status
  const filteredJobs = filter === "all" 
    ? jobs 
    : jobs.filter(job => job.status === filter);
  
  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
    toast.success("Job application deleted successfully");
  };
  
  return (
    <>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Job Tracker</h1>
              <p className="text-muted-foreground">
                Manage and track all your job applications
              </p>
            </div>
            <Button 
              onClick={() => navigate("/scheduler")}
              className="sm:w-auto w-full flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Job
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
          {filteredJobs.length > 0 ? (
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
              <h3 className="text-xl font-semibold mb-2">No job applications found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {filter === "all" 
                  ? "You haven't added any job applications yet. Add your first one to start tracking."
                  : `You don't have any ${filter} job applications.`}
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
