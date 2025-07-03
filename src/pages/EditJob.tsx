
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JobForm } from "@/components/job/job-form";
import { JobApplication } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/header";
import Footer from "@/components/footer";

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, session, loading: authLoading } = useAuth();
  const [job, setJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user || !session) {
      toast.error("Please log in to edit interviews");
      navigate("/auth");
      return;
    }

    if (!id) {
      toast.error("Invalid interview ID");
      navigate("/tracker");
      return;
    }

    fetchJob();
  }, [id, user, session, authLoading, navigate]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        const transformedJob: JobApplication = {
          id: data.id,
          userId: data.user_id,
          companyName: data.company_name,
          role: data.role,
          salaryLPA: data.salary_lpa,
          interviewDate: new Date(data.interview_date),
          interviewTime: data.interview_time,
          status: data.status as "upcoming" | "completed" | "rejected",
          notes: data.notes || "",
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
        
        setJob(transformedJob);
      }
    } catch (error: any) {
      console.error("Error fetching job:", error);
      toast.error("Failed to load interview details");
      navigate("/tracker");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      setSaving(true);
      
      const updateData = {
        company_name: formData.companyName,
        role: formData.role,
        salary_lpa: formData.salaryLPA,
        interview_date: formData.interviewDate.toISOString(),
        interview_time: formData.interviewTime,
        status: formData.status,
        notes: formData.notes || "",
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('job_applications')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success("Interview updated successfully");
      navigate("/tracker");
    } catch (error: any) {
      console.error("Error updating job:", error);
      toast.error("Failed to update interview");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
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

  if (!job) {
    return (
      <>
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-4xl">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Interview Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The interview you're looking for doesn't exist or you don't have permission to edit it.
              </p>
              <button
                onClick={() => navigate("/tracker")}
                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
              >
                Back to Tracker
              </button>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Interview</h1>
            <p className="text-muted-foreground">
              Update your interview details and status
            </p>
          </div>
          
          <div className="bg-card rounded-lg shadow p-6">
            <JobForm
              initialData={{
                companyName: job.companyName,
                role: job.role,
                salaryLPA: job.salaryLPA,
                interviewDate: job.interviewDate,
                interviewTime: job.interviewTime,
                status: job.status,
                notes: job.notes,
                id: job.id
              }}
              onSave={handleSave}
              isLoading={saving}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default EditJob;
