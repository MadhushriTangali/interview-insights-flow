
import { useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JobApplication } from "@/types";
import { useNavigate } from "react-router-dom";
import { useInterviewCleanup } from "@/hooks/useInterviewCleanup";

interface UpcomingInterviewsProps {
  interviews: JobApplication[];
  onRefresh?: () => void;
}

export function UpcomingInterviews({ interviews, onRefresh }: UpcomingInterviewsProps) {
  const navigate = useNavigate();
  
  // Use the cleanup hook to refresh data when interviews are removed
  useInterviewCleanup(onRefresh);
  
  const sortedInterviews = [...interviews].sort(
    (a, b) => new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime()
  );

  if (sortedInterviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
          <CardDescription>Your scheduled interviews</CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
          <p className="text-muted-foreground mb-4">
            No upcoming interviews scheduled
          </p>
          <Button onClick={() => navigate("/scheduler")}>
            Schedule an Interview
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Interviews</CardTitle>
        <CardDescription>Your scheduled interviews</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {sortedInterviews.map((interview) => (
            <div
              key={interview.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="mb-2 sm:mb-0">
                <h4 className="font-medium">{interview.companyName}</h4>
                <p className="text-sm text-muted-foreground">
                  {interview.role}
                </p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{format(new Date(interview.interviewDate), "PPP")}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>{interview.interviewTime}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/prep?company=${interview.companyName}`)}
                className="mt-2 sm:mt-0"
              >
                Prepare
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
