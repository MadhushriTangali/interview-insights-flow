
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "sonner";
import { JobApplication } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Custom Star Rating component
const StarRating = ({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (value: number) => void 
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-3xl transition-all duration-200 hover:scale-110 ${
            star <= value 
              ? "text-yellow-400 drop-shadow-lg" 
              : "text-gray-300 hover:text-yellow-200"
          }`}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const ratingSchema = z.object({
  technical: z.number().min(1).max(5),
  managerial: z.number().min(1).max(5),
  projects: z.number().min(1).max(5),
  selfIntroduction: z.number().min(1).max(5),
  hrRound: z.number().min(1).max(5),
  dressup: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  bodyLanguage: z.number().min(1).max(5),
  punctuality: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

const RatingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchJob = async () => {
      if (!id || !user) return;
      
      try {
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          const transformedJob: JobApplication = {
            id: data.id,
            userId: data.user_id,
            companyName: data.company_name,
            role: data.role,
            salaryLPA: data.salary_lpa,
            interviewDate: new Date(data.interview_date),
            interviewTime: data.interview_time,
            status: data.status as "upcoming" | "completed" | "rejected",
            notes: data.notes || "",
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at)
          };
          setJob(transformedJob);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Failed to load interview details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id, user]);
  
  // Initialize form
  const form = useForm<z.infer<typeof ratingSchema>>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      technical: 0,
      managerial: 0,
      projects: 0,
      selfIntroduction: 0,
      hrRound: 0,
      dressup: 0,
      communication: 0,
      bodyLanguage: 0,
      punctuality: 0,
      feedback: "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof ratingSchema>) => {
    if (!job || !user) return;
    
    try {
      setSubmitting(true);
      
      // Calculate overall rating
      const ratingValues = [
        data.technical,
        data.managerial,
        data.projects,
        data.selfIntroduction,
        data.hrRound,
        data.dressup,
        data.communication,
        data.bodyLanguage,
        data.punctuality,
      ];
      
      const overallRating = 
        ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length;
      
      // Save rating to database
      const { error: ratingError } = await supabase
        .from('interview_ratings')
        .insert({
          job_application_id: job.id,
          user_id: user.id,
          technical: data.technical,
          managerial: data.managerial,
          projects: data.projects,
          self_introduction: data.selfIntroduction,
          hr_round: data.hrRound,
          dressup: data.dressup,
          communication: data.communication,
          body_language: data.bodyLanguage,
          punctuality: data.punctuality,
          overall_rating: parseFloat(overallRating.toFixed(2)),
          feedback: data.feedback || null
        });
        
      if (ratingError) throw ratingError;
      
      // Update job status to completed
      const { error: jobError } = await supabase
        .from('job_applications')
        .update({ status: 'completed' })
        .eq('id', job.id);
        
      if (jobError) throw jobError;
      
      toast.success("Rating submitted successfully!");
      navigate("/ratings");
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
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
  
  // If job not found
  if (!job) {
    return (
      <>
        <Header />
        <main className="flex-1 py-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <div className="container px-4 md:px-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Interview not found</h2>
              <p className="text-muted-foreground mb-6">
                The interview you're trying to rate could not be found.
              </p>
              <Button onClick={() => navigate("/tracker")} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Back to Tracker
              </Button>
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
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Rate Your Interview
            </h1>
            <p className="text-muted-foreground text-lg">
              {job?.companyName} - {job?.role}
            </p>
          </div>
          
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Self-Evaluation</CardTitle>
              <CardDescription className="text-purple-100">
                Rate your performance in various aspects of the interview from 1 to 5 stars
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Technical */}
                    <FormField
                      control={form.control}
                      name="technical"
                      render={({ field }) => (
                        <FormItem className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800">
                          <FormLabel className="text-lg font-semibold text-blue-700 dark:text-blue-300">Technical Skills</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription className="text-blue-600 dark:text-blue-400">
                            How well did you answer technical questions?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Managerial */}
                    <FormField
                      control={form.control}
                      name="managerial"
                      render={({ field }) => (
                        <FormItem className="p-6 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800">
                          <FormLabel className="text-lg font-semibold text-purple-700 dark:text-purple-300">Managerial Skills</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription className="text-purple-600 dark:text-purple-400">
                            How well did you demonstrate leadership abilities?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Projects */}
                    <FormField
                      control={form.control}
                      name="projects"
                      render={({ field }) => (
                        <FormItem className="p-6 rounded-lg bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 border border-green-200 dark:border-green-800">
                          <FormLabel className="text-lg font-semibold text-green-700 dark:text-green-300">Project Explanations</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription className="text-green-600 dark:text-green-400">
                            How effectively did you explain your projects?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Self Introduction */}
                    <FormField
                      control={form.control}
                      name="selfIntroduction"
                      render={({ field }) => (
                        <FormItem className="p-6 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border border-orange-200 dark:border-orange-800">
                          <FormLabel className="text-lg font-semibold text-orange-700 dark:text-orange-300">Self Introduction</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription className="text-orange-600 dark:text-orange-400">
                            How well did you introduce yourself?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* HR Round */}
                    <FormField
                      control={form.control}
                      name="hrRound"
                      render={({ field }) => (
                        <FormItem className="p-6 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950 border border-pink-200 dark:border-pink-800">
                          <FormLabel className="text-lg font-semibold text-pink-700 dark:text-pink-300">HR Round</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription className="text-pink-600 dark:text-pink-400">
                            How well did you handle HR questions?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Dress-up */}
                    <FormField
                      control={form.control}
                      name="dressup"
                      render={({ field }) => (
                        <FormItem className="p-6 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 border border-indigo-200 dark:border-indigo-800">
                          <FormLabel className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">Professional Appearance</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription className="text-indigo-600 dark:text-indigo-400">
                            How professional was your appearance?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Communication */}
                    <FormField
                      control={form.control}
                      name="communication"
                      render={({ field }) => (
                        <FormItem className="p-6 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 border border-teal-200 dark:border-teal-800">
                          <FormLabel className="text-lg font-semibold text-teal-700 dark:text-teal-300">Communication Skills</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription className="text-teal-600 dark:text-teal-400">
                            How clear was your communication?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Body Language */}
                    <FormField
                      control={form.control}
                      name="bodyLanguage"
                      render={({ field }) => (
                        <FormItem className="p-6 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 border border-violet-200 dark:border-violet-800">
                          <FormLabel className="text-lg font-semibold text-violet-700 dark:text-violet-300">Body Language</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription className="text-violet-600 dark:text-violet-400">
                            How confident was your body language?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Punctuality */}
                    <FormField
                      control={form.control}
                      name="punctuality"
                      render={({ field }) => (
                        <FormItem className="p-6 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border border-amber-200 dark:border-amber-800">
                          <FormLabel className="text-lg font-semibold text-amber-700 dark:text-amber-300">Punctuality</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription className="text-amber-600 dark:text-amber-400">
                            Did you arrive on time and prepare well?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Feedback */}
                  <FormField
                    control={form.control}
                    name="feedback"
                    render={({ field }) => (
                      <FormItem className="p-6 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950 border border-gray-200 dark:border-gray-800">
                        <FormLabel className="text-lg font-semibold">Personal Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional thoughts, areas for improvement, or specific feedback about your interview experience"
                            className="min-h-[120px] border-2 focus:border-purple-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate("/tracker")}
                      className="px-8 py-3 text-lg"
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit Rating"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default RatingPage;
