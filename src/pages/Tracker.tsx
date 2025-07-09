
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { JobCard } from "@/components/job/job-card";
import { JobForm } from "@/components/job/job-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { JobApplication } from "@/types";
import { useAutoUpdateExpiredInterviews } from "@/hooks/useAutoUpdateExpiredInterviews";
import { toast } from "sonner";
import { Plus, Search, Filter } from "lucide-react";

const Tracker = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);

  const fetchJobApplications = async (): Promise<JobApplication[]> => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', user.id)
      .order('interview_date', { ascending: false });
    
    if (error) throw error;
    
    return data.map(app => ({
      id: app.id,
      userId: app.user_id!,
      companyName: app.company_name,
      role: app.role,
      salaryLPA: app.salary_lpa,
      interviewDate: new Date(app.interview_date),
      interviewTime: app.interview_time,
      status: app.status as "upcoming" | "completed" | "succeeded" | "rejected",
      notes: app.notes || "",
      createdAt: new Date(app.created_at),
      updatedAt: new Date(app.updated_at)
    }));
  };

  const { data: jobApplications = [], isLoading, refetch } = useQuery({
    queryKey: ['jobApplications', user?.id],
    queryFn: fetchJobApplications,
    enabled: !!user
  });

  // Use the auto-update hook to handle expired interviews
  useAutoUpdateExpiredInterviews(() => {
    refetch();
  });

  const filteredJobs = jobApplications.filter(job => {
    const matchesSearch = job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (job: JobApplication) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Job application deleted successfully");
      refetch();
    } catch (error: any) {
      console.error("Error deleting job application:", error);
      toast.error("Failed to delete job application");
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingJob(null);
    refetch();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingJob(null);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 py-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
      
      <main className="flex-1 py-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Interview Tracker
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your job applications and interview schedule
              </p>
            </div>
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Interview
            </Button>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by company or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="succeeded">Succeeded</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Job Applications Grid */}
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No interviews found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Start by adding your first interview to track."}
              </p>
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Interview
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Dialog open={isFormOpen} onOpenChange={handleFormClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? "Edit Interview" : "Add New Interview"}
            </DialogTitle>
          </DialogHeader>
          <JobForm
            job={editingJob}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

export default Tracker;
