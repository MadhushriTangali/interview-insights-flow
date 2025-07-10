
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, DollarSign, Star } from "lucide-react";
import { format } from "date-fns";
import { JobApplication } from "@/types";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface JobCardProps {
  job: JobApplication;
  onEdit?: (job: JobApplication) => void;
  onDelete?: (id: string) => void;
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasRating, setHasRating] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkForRating = async () => {
      if (!user || job.status !== "completed" && job.status !== "succeeded" && job.status !== "rejected") return;
      
      try {
        const { data, error } = await supabase
          .from('interview_ratings')
          .select('id')
          .eq('job_application_id', job.id)
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error checking for rating:", error);
          return;
        }
        
        setHasRating(!!data);
      } catch (error) {
        console.error("Error checking for rating:", error);
      }
    };
    
    checkForRating();
  }, [job.id, job.status, user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "succeeded":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Upcoming";
      case "completed":
        return "Completed";
      case "succeeded":
        return "Succeeded";
      case "rejected":
        return "Rejected";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleViewDetails = () => {
    try {
      console.log("Navigating to job details:", job.id);
      navigate(`/job/${job.id}`);
    } catch (error) {
      console.error("Error navigating to job details:", error);
      toast.error("Failed to view job details");
    }
  };

  const handleRateInterview = () => {
    try {
      console.log("Navigating to rate interview:", job.id, "hasRating:", hasRating);
      if (hasRating) {
        navigate("/ratings");
      } else {
        navigate(`/rate-interview/${job.id}`);
      }
    } catch (error) {
      console.error("Error navigating to rate interview:", error);
      toast.error("Failed to navigate to rating page");
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {job.companyName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{job.role}</p>
          </div>
          <Badge className={getStatusColor(job.status)}>
            {formatStatus(job.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{format(job.interviewDate, "PPP")}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{job.interviewTime}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>{job.salaryLPA} LPA</span>
          </div>
        </div>
        
        {job.notes && (
          <div className="text-sm">
            <p className="font-medium text-muted-foreground mb-1">Notes:</p>
            <p className="text-muted-foreground line-clamp-2">{job.notes}</p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1 min-w-0"
          >
            View Details
          </Button>
          
          {job.status === "upcoming" && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(job)}
              className="flex-1 min-w-0"
            >
              Edit
            </Button>
          )}
          
          {(job.status === "completed" || job.status === "succeeded" || job.status === "rejected") && (
            <Button
              size="sm"
              onClick={handleRateInterview}
              disabled={loading}
              className="flex-1 min-w-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Star className="h-4 w-4 mr-1" />
              {hasRating ? "View Rating" : "Rate Interview"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
