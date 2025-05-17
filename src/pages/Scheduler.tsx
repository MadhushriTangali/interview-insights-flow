
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { JobForm } from "@/components/job/job-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/auth";

const Scheduler = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveJob = async (formData: any) => {
    const user = getCurrentUser();
    
    if (!user) {
      toast.error("Please log in to save an interview");
      navigate("/login");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Format the interview date properly
      const interviewDate = formData.interviewDate instanceof Date ? 
        formData.interviewDate.toISOString() : 
        new Date(formData.interviewDate).toISOString();
      
      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          company_name: formData.companyName,
          role: formData.role,
          salary_lpa: formData.salaryLPA,
          interview_date: interviewDate,
          interview_time: formData.interviewTime,
          status: formData.status,
          notes: formData.notes || "" // Ensure notes is never null
        });
      
      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      toast.success("Interview scheduled successfully!");
      navigate("/tracker");
    } catch (error: any) {
      console.error("Error saving job application:", error);
      toast.error(`Failed to save interview: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Schedule an Interview</h1>
            <p className="text-muted-foreground">
              Add details about your upcoming job interview
            </p>
          </div>
          
          <div className="rounded-lg border bg-card shadow-sm p-6 md:p-8">
            <JobForm onSave={handleSaveJob} isLoading={isLoading} />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Scheduler;
