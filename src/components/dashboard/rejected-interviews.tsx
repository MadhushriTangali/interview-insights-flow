
import { format } from "date-fns";
import { Calendar, Clock, X } from "lucide-react";
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

interface RejectedInterviewsProps {
  interviews: JobApplication[];
}

export function RejectedInterviews({ interviews }: RejectedInterviewsProps) {
  const navigate = useNavigate();
  
  const sortedInterviews = [...interviews].sort(
    (a, b) => new Date(b.interviewDate).getTime() - new Date(a.interviewDate).getTime()
  );

  const recentRejected = sortedInterviews.slice(0, 3);

  if (recentRejected.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Rejections</CardTitle>
          <CardDescription>Your recent rejected interviews</CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
          <p className="text-muted-foreground mb-4">
            No rejected interviews yet
          </p>
          <Button onClick={() => navigate("/tracker")}>
            View All Interviews
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Rejections</CardTitle>
        <CardDescription>Your recent rejected interviews</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {recentRejected.map((interview) => (
            <div
              key={interview.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="mb-2 sm:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{interview.companyName}</h4>
                  <X className="h-4 w-4 text-red-500" />
                </div>
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
                {interview.notes && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {interview.notes}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/job/${interview.id}`)}
                className="mt-2 sm:mt-0"
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
        {sortedInterviews.length > 3 && (
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tracker")}
              className="w-full"
            >
              View All Rejected Interviews
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
