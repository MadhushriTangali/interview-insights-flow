
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ProgressCircle } from "@/components/dashboard/progress-circle";
import { ArrowRight } from "lucide-react";

const FeedbackPage = () => {
  // Mock data for radar chart
  const radarData = [
    { subject: "Technical", score: 4.2, fullMark: 5 },
    { subject: "Managerial", score: 3.5, fullMark: 5 },
    { subject: "Projects", score: 4.0, fullMark: 5 },
    { subject: "Self-Intro", score: 3.8, fullMark: 5 },
    { subject: "HR Round", score: 4.5, fullMark: 5 },
    { subject: "Dress-up", score: 4.2, fullMark: 5 },
    { subject: "Communication", score: 3.4, fullMark: 5 },
    { subject: "Body Language", score: 3.0, fullMark: 5 },
    { subject: "Punctuality", score: 4.5, fullMark: 5 },
  ];
  
  // Overall average rating
  const overallRating = radarData.reduce((sum, item) => sum + item.score, 0) / radarData.length;
  
  // Find strengths and areas for improvement
  const strengths = [...radarData].sort((a, b) => b.score - a.score).slice(0, 3);
  const improvements = [...radarData].sort((a, b) => a.score - b.score).slice(0, 3);
  
  return (
    <>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Feedback & Insights</h1>
            <p className="text-muted-foreground">
              Analyze your performance and find areas for improvement
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Performance Overview */}
            <div className="lg:col-span-2 space-y-8">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Radar</CardTitle>
                  <CardDescription>
                    Your performance across different interview aspects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#9b87f5"
                          fill="#9b87f5"
                          fillOpacity={0.6}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Strengths and Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Strengths</CardTitle>
                    <CardDescription>
                      Areas where you performed best
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {strengths.map((item) => (
                        <li key={item.subject} className="flex items-center justify-between">
                          <span className="font-medium">{item.subject}</span>
                          <span className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                            {item.score}/5
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                {/* Improvements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Areas for Improvement</CardTitle>
                    <CardDescription>
                      Skills to focus on for your next interview
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {improvements.map((item) => (
                        <li key={item.subject} className="flex items-center justify-between">
                          <span className="font-medium">{item.subject}</span>
                          <span className="inline-flex items-center bg-amber-100 text-amber-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-amber-900 dark:text-amber-300">
                            {item.score}/5
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Right Column - Overall Rating and Suggestions */}
            <div className="space-y-8">
              {/* Overall Rating */}
              <Card className="text-center p-6">
                <CardHeader className="pb-2">
                  <CardTitle>Overall Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center">
                    <ProgressCircle value={(overallRating / 5) * 100} size={150} strokeWidth={12} className="mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{overallRating.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">out of 5</div>
                      </div>
                    </ProgressCircle>
                    <p className="text-muted-foreground mt-4">
                      Based on your self-evaluations across 9 categories
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Improvement Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Suggestions</CardTitle>
                  <CardDescription>
                    Tips to improve your interview performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {improvements.map((area) => {
                    let suggestion = "";
                    
                    switch (area.subject) {
                      case "Body Language":
                        suggestion = "Practice maintaining good posture, make appropriate eye contact, and avoid nervous habits.";
                        break;
                      case "Communication":
                        suggestion = "Work on speaking clearly, using concrete examples, and listening actively during conversations.";
                        break;
                      case "Managerial":
                        suggestion = "Prepare more STAR method examples about your leadership and conflict resolution experiences.";
                        break;
                      case "Self-Intro":
                        suggestion = "Structure your introduction to highlight your relevant skills and accomplishments in under 2 minutes.";
                        break;
                      case "Technical":
                        suggestion = "Practice solving coding problems on platforms like LeetCode and review fundamental concepts.";
                        break;
                      default:
                        suggestion = `Focus on improving your ${area.subject.toLowerCase()} skills through targeted practice.`;
                    }
                    
                    return (
                      <div key={area.subject}>
                        <h3 className="font-semibold mb-1">{area.subject}</h3>
                        <p className="text-sm text-muted-foreground">{suggestion}</p>
                      </div>
                    );
                  })}
                  
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      View Resources <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Progress Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Over Time</CardTitle>
                  <CardDescription>
                    Your improvement trend
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      Rate more interviews to see your progress over time.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => {}}>
                      View Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default FeedbackPage;
