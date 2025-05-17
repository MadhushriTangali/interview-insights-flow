
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Star, UserCheck, Users } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressCircle } from "@/components/dashboard/progress-circle";
import { RatingChart } from "@/components/dashboard/rating-chart";
import { UpcomingInterviews } from "@/components/dashboard/upcoming-interviews";
import { getCurrentUser } from "@/lib/auth";
import { JobApplication } from "@/types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasRatings, setHasRatings] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Fetch user's interviews
    const fetchInterviews = async () => {
      try {
        setLoading(true);
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
            status: job.status as "upcoming" | "completed" | "rejected",
            notes: job.notes || "",
            createdAt: new Date(job.created_at),
            updatedAt: new Date(job.updated_at)
          }));
          
          setJobs(transformedData);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching interviews:", error);
        toast.error("Failed to load your interviews");
      } finally {
        setLoading(false);
      }
    };
    
    fetchInterviews();
    
    // For demo purposes, we're setting hasRatings to false initially
    // In a real app, this would be fetched from a ratings table
    setHasRatings(false);
  }, [user, navigate]);

  const upcomingInterviews = jobs.filter((job) => job.status === "upcoming");
  const completedInterviews = jobs.filter((job) => job.status === "completed");

  // Mock rating data - only shown if hasRatings is true
  const averageRating = 3.8;
  const ratingData = [
    { name: "Technical", value: 4.2 },
    { name: "Managerial", value: 3.5 },
    { name: "Projects", value: 4.0 },
    { name: "Self-Intro", value: 3.8 },
    { name: "HR", value: 4.5 },
    { name: "Dress-up", value: 4.2 },
    { name: "Communication", value: 3.4 },
    { name: "Body Language", value: 3.0 },
    { name: "Punctuality", value: 4.5 },
  ];

  // Calculate percentage for progress circle
  const ratingPercentage = Math.round((averageRating / 5) * 100);

  // Check if there are any updates to show
  const hasUpdates = jobs.length > 0;

  return (
    <>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
            <p className="text-muted-foreground">
              Track your job applications and prepare for upcoming interviews
            </p>
          </div>
          
          {/* Quick Stats - Only show counts if there are interviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {!loading && (
              <>
                <StatCard
                  title="Upcoming Interviews"
                  value={upcomingInterviews.length}
                  icon={<Calendar className="h-4 w-4 text-blue-500" />}
                  description="Scheduled interviews"
                />
                <StatCard
                  title="Completed Interviews"
                  value={completedInterviews.length}
                  icon={<CheckCircle className="h-4 w-4 text-green-500" />}
                  description="Past interviews"
                />
                {hasRatings ? (
                  <StatCard
                    title="Average Rating"
                    value={averageRating.toFixed(1)}
                    icon={<Star className="h-4 w-4 text-yellow-500" />}
                    description="Based on self-evaluations"
                  />
                ) : (
                  <StatCard
                    title="Rate your interviews"
                    value="N/A"
                    icon={<Star className="h-4 w-4 text-yellow-500" />}
                    description="No ratings yet"
                  />
                )}
                <StatCard
                  title="Next Interview"
                  value={upcomingInterviews.length > 0 
                    ? new Date(upcomingInterviews[0].interviewDate).toLocaleDateString() 
                    : "None"
                  }
                  icon={<Clock className="h-4 w-4 text-primary" />}
                  description={upcomingInterviews.length > 0 
                    ? upcomingInterviews[0].companyName 
                    : "No upcoming interviews"
                  }
                />
              </>
            )}
            {loading && (
              <div className="col-span-4 flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Performance Chart - Only show if ratings exist */}
              {hasRatings && <RatingChart data={ratingData} />}
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  className="h-auto py-4 justify-start"
                  onClick={() => navigate("/scheduler")}
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Schedule Interview</div>
                      <div className="text-xs text-muted-foreground">Add a new job application</div>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  className="h-auto py-4 justify-start"
                  variant="outline"
                  onClick={() => navigate("/prep")}
                >
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Interview Prep</div>
                      <div className="text-xs text-muted-foreground">Practice with sample questions</div>
                    </div>
                  </div>
                </Button>
              </div>
              
              {/* Latest Updates - Only if there are any updates */}
              {hasUpdates && (
                <div className="rounded-lg border bg-card shadow">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Latest Updates</h2>
                    
                    <div className="space-y-4">
                      {jobs.length > 0 && jobs.slice(0, 3).map((job, index) => (
                        <div key={job.id} className="flex items-start gap-4">
                          <div className={`h-10 w-10 rounded-full ${job.status === 'upcoming' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} flex items-center justify-center`}>
                            {job.status === 'upcoming' ? <Calendar className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-medium">{job.companyName} interview {job.status === 'upcoming' ? 'scheduled' : 'completed'}</p>
                            <p className="text-sm text-muted-foreground">
                              {job.status === 'upcoming' 
                                ? `You have a ${job.status} interview with ${job.companyName} for ${job.role} role.`
                                : `You ${job.status} your interview with ${job.companyName} for ${job.role} role.`
                              }
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(job.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}

                      {jobs.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">No updates yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {!hasUpdates && !loading && (
                <div className="rounded-lg border bg-card shadow p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by scheduling your first interview to see updates here.
                  </p>
                  <Button onClick={() => navigate("/scheduler")}>
                    Schedule Interview
                  </Button>
                </div>
              )}
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              {/* Overall Rating - Only if ratings exist */}
              {hasRatings && (
                <div className="rounded-lg border bg-card shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Overall Rating</h2>
                  <div className="flex flex-col items-center justify-center">
                    <ProgressCircle value={ratingPercentage} size={150} strokeWidth={12} className="mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">out of 5</div>
                      </div>
                    </ProgressCircle>
                    
                    <div className="w-full mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Technical Skills</span>
                        <span className="text-sm text-muted-foreground">4.2/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="progress-bar-gradient h-2 rounded-full" 
                          style={{ width: `${(4.2 / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="w-full mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Communication</span>
                        <span className="text-sm text-muted-foreground">3.4/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="progress-bar-gradient h-2 rounded-full" 
                          style={{ width: `${(3.4 / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="w-full mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">HR Round</span>
                        <span className="text-sm text-muted-foreground">4.5/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="progress-bar-gradient h-2 rounded-full" 
                          style={{ width: `${(4.5 / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-6" onClick={() => navigate("/feedback")}>
                      View Detailed Analysis
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Upcoming Interviews - Only show if there are upcoming interviews */}
              {upcomingInterviews.length > 0 && (
                <UpcomingInterviews interviews={upcomingInterviews} />
              )}
              
              {upcomingInterviews.length === 0 && !loading && (
                <div className="rounded-lg border bg-card shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Upcoming Interviews</h2>
                  <div className="flex flex-col items-center justify-center min-h-[150px] text-center">
                    <p className="text-muted-foreground mb-4">
                      You don't have any upcoming interviews scheduled
                    </p>
                    <Button onClick={() => navigate("/scheduler")}>
                      Schedule Your First Interview
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Dashboard;
