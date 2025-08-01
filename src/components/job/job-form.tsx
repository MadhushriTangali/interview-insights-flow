import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const jobFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Job role is required"),
  salaryLPA: z.string().min(1, "Salary is required"),
  interviewDate: z.date({
    required_error: "Interview date is required",
  }),
  interviewTime: z.string().min(1, "Interview time is required"),
  status: z.enum(["upcoming", "completed", "rejected", "succeeded"], {
    required_error: "Status is required",
  }),
  notes: z.string().optional(),
});

type JobFormProps = {
  initialData?: z.infer<typeof jobFormSchema> & { id: string };
  onSave: (data: z.infer<typeof jobFormSchema>) => void;
  isLoading?: boolean;
  isEditing?: boolean;
};

export function JobForm({ initialData, onSave, isLoading = false, isEditing = false }: JobFormProps) {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<"upcoming" | "completed" | "rejected" | "succeeded">(initialData?.status || "upcoming");
  const [showCompletedDialog, setShowCompletedDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<z.infer<typeof jobFormSchema> | null>(null);

  const form = useForm<z.infer<typeof jobFormSchema>>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: initialData || {
      companyName: "",
      role: "",
      salaryLPA: "",
      interviewTime: "",
      status: "upcoming",
      notes: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof jobFormSchema>) => {
    try {
      // If user selects "completed", show dialog to ask for specific outcome
      if (data.status === "completed" && currentStatus !== "completed") {
        setPendingFormData(data);
        setShowCompletedDialog(true);
        return;
      }

      // Combine date and time
      const combined = new Date(data.interviewDate);
      const [hours, minutes] = data.interviewTime.split(":").map(Number);
      combined.setHours(hours, minutes);
      
      onSave({
        ...data,
        interviewDate: combined,
      });
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save interview details");
    }
  };

  const handleCompletedOutcome = (outcome: "succeeded" | "rejected") => {
    if (pendingFormData) {
      const updatedData = { ...pendingFormData, status: outcome };
      
      // Combine date and time
      const combined = new Date(updatedData.interviewDate);
      const [hours, minutes] = updatedData.interviewTime.split(":").map(Number);
      combined.setHours(hours, minutes);
      
      onSave({
        ...updatedData,
        interviewDate: combined,
      });
    }
    setShowCompletedDialog(false);
    setPendingFormData(null);
  };

  // Show all status options
  const getStatusOptions = () => {
    return [
      { value: "upcoming", label: "Upcoming" },
      { value: "completed", label: "Completed" },
      { value: "succeeded", label: "Succeeded" },
      { value: "rejected", label: "Rejected" },
    ];
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter job role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="salaryLPA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary (LPA)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter salary in LPA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={(value: "upcoming" | "completed" | "rejected" | "succeeded") => {
                      field.onChange(value);
                      setCurrentStatus(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getStatusOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            
            <FormField
              control={form.control}
              name="interviewDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Interview Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interviewTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Time</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter any additional notes or preparation reminders" 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Add important points to remember for this interview
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/tracker")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : initialData ? "Update Interview" : "Add Interview"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Completed Status Dialog */}
      <Dialog open={showCompletedDialog} onOpenChange={setShowCompletedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Interview Outcome</DialogTitle>
            <DialogDescription>
              Since you've marked this interview as completed, please let us know the outcome:
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => handleCompletedOutcome("rejected")}
              className="flex-1"
            >
              Rejected
            </Button>
            <Button
              onClick={() => handleCompletedOutcome("succeeded")}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Succeeded
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
