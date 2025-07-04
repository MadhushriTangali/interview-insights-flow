
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { JobForm } from "@/components/job/job-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Clock, Briefcase } from "lucide-react";

const Scheduler = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveJob = async (formData: any) => {
    if (!user || !session) {
      toast.error("Please log in to save an interview");
      navigate("/auth");
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
      
      <main className="flex-1 py-12 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 min-h-screen">
        <div className="container px-4 md:px-6 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white shadow-xl">
                <Calendar className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Schedule Your Interview
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Take control of your career journey by organizing and tracking your upcoming job interviews with precision and confidence.
            </p>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center gap-4 p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Smart Scheduling</h3>
                <p className="text-sm text-muted-foreground">Never miss an interview</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Timely Reminders</h3>
                <p className="text-sm text-muted-foreground">Stay prepared and ready</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Career Tracking</h3>
                <p className="text-sm text-muted-foreground">Monitor your progress</p>
              </div>
            </div>
          </div>
          
          {/* Form Section */}
          <div className="rounded-2xl border border-gradient-to-r from-purple-200/50 via-blue-200/50 to-indigo-200/50 dark:from-purple-800/50 dark:via-blue-800/50 dark:to-indigo-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-2xl p-8 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-3 text-gray-800 dark:text-gray-200">Interview Details</h2>
              <p className="text-lg text-muted-foreground">Fill in the information below to schedule your interview</p>
            </div>
            <JobForm onSave={handleSaveJob} isLoading={isLoading} />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Scheduler;
