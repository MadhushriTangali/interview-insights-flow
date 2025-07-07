
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  Edit, 
  MoreVertical, 
  Star, 
  Trash,
  Eye
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { JobApplication } from "@/types";

interface JobCardProps {
  job: JobApplication;
  onDelete: (id: string) => void;
}

export function JobCard({ job, onDelete }: JobCardProps) {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    succeeded: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };

  const handleEdit = () => {
    navigate(`/edit-job/${job.id}`);
  };

  const handleView = () => {
    navigate(`/job-details/${job.id}`);
  };
  
  const handleRate = () => {
    navigate(`/rate/${job.id}`);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(false);
    onDelete(job.id);
  };

  return (
    <Card className="job-card hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{job.role}</h3>
            <p className="text-muted-foreground">{job.companyName}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={cn(statusColors[job.status as keyof typeof statusColors])}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="-mr-2">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {(job.status === "completed" || job.status === "succeeded" || job.status === "rejected") && (
                  <DropdownMenuItem onClick={handleRate}>
                    <Star className="h-4 w-4 mr-2" />
                    Rate Interview
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the interview
                        from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{format(new Date(job.interviewDate), "PPP")}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{job.interviewTime}</span>
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold">₹{job.salaryLPA} LPA</span>
          </div>
        </div>
        
        <div className="mt-5 flex justify-between">
          <Button variant="outline" size="sm" onClick={handleView}>
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          
          {(job.status === "completed" || job.status === "succeeded" || job.status === "rejected") ? (
            <Button size="sm" className="flex items-center gap-1" onClick={handleRate}>
              <Star className="h-4 w-4" /> Rate Interview
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
