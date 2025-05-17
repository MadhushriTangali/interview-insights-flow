
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { JobForm } from "@/components/job/job-form";
import { toast } from "sonner";
import { dummyJobs } from "@/types";

const Scheduler = () => {
  const navigate = useNavigate();
  
  const handleSaveJob = (formData: any) => {
    // In a real application, this would save to a database
    console.log("Saving job application:", formData);
    toast.success("Job application saved successfully!");
    navigate("/tracker");
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
            <JobForm onSave={handleSaveJob} />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Scheduler;
