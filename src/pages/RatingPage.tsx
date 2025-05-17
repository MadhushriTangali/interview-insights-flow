
import { useState } from "react";
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
import { dummyJobs } from "@/types";

// Custom Star Rating component
const StarRating = ({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (value: number) => void 
}) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl px-1 focus:outline-none ${
            star <= value 
              ? "text-yellow-400 rating-glow" 
              : "text-gray-300"
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
  const { jobId } = useParams();
  
  // Find job by ID from dummy data
  const job = dummyJobs.find((job) => job.id === jobId);
  
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
  
  const onSubmit = (data: z.infer<typeof ratingSchema>) => {
    console.log("Rating submitted:", data);
    
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
    
    console.log("Overall rating:", overallRating.toFixed(1));
    
    toast.success("Rating submitted successfully!");
    navigate("/tracker");
  };
  
  // If job not found
  if (!job) {
    return (
      <>
        <Header />
        
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Job not found</h2>
              <p className="text-muted-foreground mb-6">
                The job application you're trying to rate could not be found.
              </p>
              <Button onClick={() => navigate("/tracker")}>
                Back to Job Tracker
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
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Rate Your Interview</h1>
            <p className="text-muted-foreground">
              {job.companyName} - {job.role}
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Self-Evaluation</CardTitle>
              <CardDescription>
                Rate your performance in various aspects of the interview from 1 to 5 stars
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Technical */}
                    <FormField
                      control={form.control}
                      name="technical"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technical Skills</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
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
                        <FormItem>
                          <FormLabel>Managerial Skills</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
                            How well did you demonstrate leadership and management abilities?
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
                        <FormItem>
                          <FormLabel>Project Explanations</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
                            How effectively did you explain your past projects?
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
                        <FormItem>
                          <FormLabel>Self Introduction</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
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
                        <FormItem>
                          <FormLabel>HR Round</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
                            How well did you handle HR-related questions?
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
                        <FormItem>
                          <FormLabel>Professional Appearance</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
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
                        <FormItem>
                          <FormLabel>Communication Skills</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
                            How clear and effective was your communication?
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
                        <FormItem>
                          <FormLabel>Body Language</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
                            How confident and positive was your body language?
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
                        <FormItem>
                          <FormLabel>Punctuality</FormLabel>
                          <FormControl>
                            <StarRating
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>
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
                      <FormItem>
                        <FormLabel>Personal Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional thoughts, areas for improvement, or specific feedback about your interview experience"
                            className="min-h-[120px]"
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
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Submit Rating</Button>
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
