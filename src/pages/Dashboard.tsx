
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
import { dummyJobs } from "@/types";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [jobs, setJobs] = useState(dummyJobs);

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const upcomingInterviews = jobs.filter((job) => job.status === "upcoming");
  const completedInterviews = jobs.filter((job) => job.status === "completed");
  const ratedInterviews = 1; // Mock data

  // Mock rating data
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

  return (
    <>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back, {user?.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">
              Track your job applications and prepare for upcoming interviews
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <StatCard
              title="Average Rating"
              value={averageRating.toFixed(1)}
              icon={<Star className="h-4 w-4 text-yellow-500" />}
              description="Based on self-evaluations"
            />
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
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Performance Chart */}
              <RatingChart data={ratingData} />
              
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
              
              {/* Latest Updates */}
              <div className="rounded-lg border bg-card shadow">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Latest Updates</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Google interview scheduled</p>
                        <p className="text-sm text-muted-foreground">
                          You have a new interview scheduled with Google for Frontend Developer role.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Microsoft interview rated</p>
                        <p className="text-sm text-muted-foreground">
                          You rated your Microsoft interview with an overall score of 4.2/5.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">5 days ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Amazon is hiring</p>
                        <p className="text-sm text-muted-foreground">
                          Amazon has 200+ new openings for software engineers.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              {/* Overall Rating */}
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
              
              {/* Upcoming Interviews */}
              <UpcomingInterviews interviews={upcomingInterviews} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Dashboard;
