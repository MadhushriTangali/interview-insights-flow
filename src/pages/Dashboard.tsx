
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { StatCard } from "@/components/dashboard/stat-card";
import { UpcomingInterviews } from "@/components/dashboard/upcoming-interviews";
import { RejectedInterviews } from "@/components/dashboard/rejected-interviews";
import { RatingVisualization } from "@/components/dashboard/rating-visualization";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { JobApplication } from "@/types";
import { useAutoUpdateExpiredInterviews } from "@/hooks/useAutoUpdateExpiredInterviews";
import { useRatings } from "@/hooks/useRatings";
import { Calendar, Target, CheckCircle, Award } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { ratings } = useRatings();
  
  const fetchJobApplications = async (): Promise<JobApplication[]> => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', user.id)
      .order('interview_date', { ascending: true });
    
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

  const stats = {
    totalInterviews: jobApplications.length,
    upcomingInterviews: jobApplications.filter(job => job.status === "upcoming").length,
    completedInterviews: jobApplications.filter(job => 
      job.status === "completed" || job.status === "succeeded" || job.status === "rejected"
    ).length,
    successRate: jobApplications.filter(job => job.status === "succeeded").length
  };

  const upcomingInterviews = jobApplications.filter(job => job.status === "upcoming");
  const rejectedInterviews = jobApplications.filter(job => job.status === "rejected");

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
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your interview progress and performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Interviews"
              value={stats.totalInterviews}
              icon={<Target className="h-4 w-4" />}
            />
            <StatCard
              title="Upcoming Interviews"
              value={stats.upcomingInterviews}
              icon={<Calendar className="h-4 w-4" />}
            />
            <StatCard
              title="Completed Interviews"
              value={stats.completedInterviews}
              icon={<CheckCircle className="h-4 w-4" />}
            />
            <StatCard
              title="Successful Interviews"
              value={stats.successRate}
              icon={<Award className="h-4 w-4" />}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <UpcomingInterviews 
              interviews={upcomingInterviews} 
              onRefresh={refetch}
            />
            <RejectedInterviews interviews={rejectedInterviews} />
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <RatingVisualization ratings={ratings} />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Dashboard;
