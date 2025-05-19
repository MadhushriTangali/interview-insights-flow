
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Clock, DollarSign, FileText, Tag, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { JobApplication } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const getJobDetails = async () => {
      if (!id) {
        setError("No job ID provided");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (!data) {
          setError("Job not found");
          setLoading(false);
          return;
        }
        
        // Transform data to match JobApplication type
        const transformedJob: JobApplication = {
          id: data.id,
          userId: data.user_id,
          companyName: data.company_name,
          role: data.role,
          salaryLPA: data.salary_lpa,
          interviewDate: new Date(data.interview_date),
          interviewTime: data.interview_time,
          status: data.status,
          notes: data.notes || "",
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
        
        setJob(transformedJob);
      } catch (error: any) {
        setError(error.message || "Failed to fetch interview details");
        toast.error("Failed to load interview details");
      } finally {
        setLoading(false);
      }
    };
    
    getJobDetails();
  }, [id]);
  
  const handleDelete = async () => {
    if (!job?.id) return;
    
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', job.id);
        
      if (error) throw error;
      
      toast.success("Interview deleted successfully");
      navigate("/tracker");
    } catch (error: any) {
      toast.error("Failed to delete interview");
    }
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 py-12">
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
  
  if (error || !job) {
    return (
      <>
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-4xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Error</h2>
              <p className="text-muted-foreground mb-6">{error || "Failed to load interview details"}</p>
              <Button onClick={() => navigate("/tracker")}>
                Back to Tracker
              </Button>
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
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/tracker")}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tracker
            </Button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{job.companyName}</h1>
                <p className="text-muted-foreground">{job.role}</p>
              </div>
              
              <Badge className={
                job.status === "upcoming" 
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
                  : job.status === "completed" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              }>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-4 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Interview Date</p>
                <p className="font-medium">{format(job.interviewDate, "PPP")}</p>
              </div>
            </Card>
            
            <Card className="p-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Interview Time</p>
                <p className="font-medium">{job.interviewTime}</p>
              </div>
            </Card>
            
            <Card className="p-4 flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Salary</p>
                <p className="font-medium">₹{job.salaryLPA} LPA</p>
              </div>
            </Card>
          </div>
          
          {job.notes && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Notes
              </h2>
              <Card className="p-4">
                <p className="whitespace-pre-wrap">{job.notes}</p>
              </Card>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Created on {format(job.createdAt, "PPP")}</p>
              <p className="text-sm text-muted-foreground">Last updated on {format(job.updatedAt, "PPP")}</p>
            </div>
            
            <div className="flex gap-3">
              {job.status === "upcoming" && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/edit-job/${job.id}`)}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              
              <Button 
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default JobDetails;
