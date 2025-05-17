import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Building, 
  Calendar, 
  Clock, 
  Coins, 
  Edit, 
  FileText, 
  Trash,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";
import Footer from "@/components/footer";
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
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";
import { JobApplication } from "@/types";
import { cn } from "@/lib/utils";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiPrep, setAiPrep] = useState<{question: string, answer: string}[]>([]);
  const [isLoadingPrep, setIsLoadingPrep] = useState(false);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      const user = getCurrentUser();
      
      if (!user) {
        toast.error("Please log in to view job details");
        navigate("/login");
        return;
      }
      
      if (!id) {
        navigate("/tracker");
        return;
      }
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          toast.error("Interview not found");
          navigate("/tracker");
          return;
        }
        
        // Transform data to match JobApplication type
        const transformedData: JobApplication = {
          id: data.id,
          userId: data.user_id || "",
          companyName: data.company_name,
          role: data.role,
          salaryLPA: data.salary_lpa,
          interviewDate: new Date(data.interview_date),
          status: data.status as "upcoming" | "completed" | "rejected",
          notes: data.notes || "",
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
        
        setJob(transformedData);
        fetchPreparationQuestions(data.company_name, data.role);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to load interview details");
        navigate("/tracker");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id, navigate]);
  
  const fetchPreparationQuestions = async (company: string, role: string) => {
    try {
      setIsLoadingPrep(true);
      // Mock AI data for now - in a real app this would call an AI endpoint
      const mockQuestions = [
        { 
          question: "What do you know about our company culture?", 
          answer: `${company} is known for its innovation in the tech industry. Be ready to discuss their recent products, company culture, and mission statement.`
        },
        { 
          question: "Why do you want this role?", 
          answer: `Explain how your skills align with the ${role} position and what attracts you to work with ${company}.` 
        },
        { 
          question: "Describe a challenging project you worked on.", 
          answer: "Choose a relevant project that showcases skills needed for this role. Describe the challenge, your approach, and the outcome." 
        },
        { 
          question: "How do you handle tight deadlines?", 
          answer: "Demonstrate your time management skills with a specific example of how you prioritized tasks to meet an important deadline." 
        },
        { 
          question: "What are your salary expectations?", 
          answer: "Research the market rates for this role and be prepared to give a range that aligns with your experience and the company's typical compensation." 
        }
      ];
      
      setTimeout(() => {
        setAiPrep(mockQuestions);
        setIsLoadingPrep(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error fetching preparation questions:", error);
      setIsLoadingPrep(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Interview deleted successfully");
      navigate("/tracker");
    } catch (error) {
      console.error("Error deleting job application:", error);
      toast.error("Failed to delete interview");
    }
  };
  
  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!job) {
    return (
      <>
        <Header />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <h2 className="text-2xl font-bold mb-2">Interview Not Found</h2>
              <p className="text-muted-foreground mb-6">The interview you're looking for does not exist or has been deleted.</p>
              <Button onClick={() => navigate("/tracker")}>Back to Tracker</Button>
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
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center mb-4" 
              onClick={() => navigate("/tracker")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tracker
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{job.role}</h1>
                <p className="text-xl text-muted-foreground">{job.companyName}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge className={cn("px-3 py-1", statusColors[job.status as keyof typeof statusColors])}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
                
                <Button variant="outline" size="sm" onClick={() => navigate(`/edit-job/${job.id}`)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                      <Trash className="h-4 w-4 mr-2" /> Delete
                    </Button>
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
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column with job details */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Interview Details</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Building className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-medium">{job.companyName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <User className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="font-medium">{job.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{format(new Date(job.interviewDate), "PPP")}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{format(new Date(job.interviewDate), "h:mm a")}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Coins className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Salary</p>
                        <p className="font-medium">₹{job.salaryLPA} LPA</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <div className="flex items-start mb-2">
                      <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Notes</p>
                    </div>
                    <div className="pl-8">
                      {job.notes ? (
                        <p className="whitespace-pre-wrap">{job.notes}</p>
                      ) : (
                        <p className="text-muted-foreground italic">No notes added</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column with preparation questions */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Preparation Questions</h2>
                  
                  {isLoadingPrep ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {aiPrep.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
                          <p className="text-muted-foreground">{item.answer}</p>
                        </div>
                      ))}
                      
                      <div className="pt-4">
                        <Button onClick={() => navigate(`/prep?company=${job.companyName}&role=${job.role}`)} className="w-full">
                          Get More Preparation Questions
                        </Button>
                      </div>
                    </div>
                  )}
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

export default JobDetails;
