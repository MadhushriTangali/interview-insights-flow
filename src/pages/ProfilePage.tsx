import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

const ProfilePage = () => {
  const { user, session } = useAuth();
  
  // Get user display name and avatar from Supabase user metadata
  const getUserDisplayName = () => {
    if (!user) return "";
    return user.user_metadata?.name || user.email || "";
  };

  const getUserAvatar = () => {
    if (!user) return "";
    return user.user_metadata?.avatar_url || "";
  };
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: getUserDisplayName(),
      email: user?.email || "",
      phone: "",
      location: "",
      bio: "",
    },
  });
  
  // Update form values when user changes
  useEffect(() => {
    if (user) {
      form.setValue("name", getUserDisplayName());
      form.setValue("email", user.email || "");
    }
  }, [user, form]);
  
  const [emailNotification, setEmailNotification] = useState(true);
  const [mobileNotification, setMobileNotification] = useState(false);
  const [upcomingInterviews, setUpcomingInterviews] = useState(true);
  const [feedbackReminders, setFeedbackReminders] = useState(true);
  const [newCompanies, setNewCompanies] = useState(false);
  
  function onSubmit(values: z.infer<typeof profileSchema>) {
    console.log("Profile updated:", values);
    toast.success("Profile updated successfully!");
  }
  
  if (!user) {
    return (
      <>
        <Header />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6 max-w-4xl text-center">
            <Card>
              <CardHeader>
                <CardTitle>Please Login First</CardTitle>
                <CardDescription>
                  You need to be logged in to view and edit your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => window.location.href = "/login"}>
                  Go to Login
                </Button>
              </CardContent>
            </Card>
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
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>
          
          <div className="grid gap-8">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your profile information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
                      <AvatarFallback>{getUserDisplayName().charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="City, Country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Input placeholder="Tell us about yourself" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit">Save Changes</Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and reminders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notification Channels</h3>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch 
                        checked={emailNotification} 
                        onCheckedChange={setEmailNotification} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mobile Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications on your phone
                        </p>
                      </div>
                      <Switch 
                        checked={mobileNotification} 
                        onCheckedChange={setMobileNotification} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notification Types</h3>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Upcoming Interviews</p>
                        <p className="text-sm text-muted-foreground">
                          Notify me about upcoming interviews
                        </p>
                      </div>
                      <Switch 
                        checked={upcomingInterviews} 
                        onCheckedChange={setUpcomingInterviews} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Feedback Reminders</p>
                        <p className="text-sm text-muted-foreground">
                          Remind me to rate my interviews
                        </p>
                      </div>
                      <Switch 
                        checked={feedbackReminders} 
                        onCheckedChange={setFeedbackReminders} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Company Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Notify me about new companies hiring
                        </p>
                      </div>
                      <Switch 
                        checked={newCompanies} 
                        onCheckedChange={setNewCompanies} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Account Security - Fixed to use Label instead of FormLabel */}
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Update your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" placeholder="Enter current password" />
                    </div>
                    
                    <div></div>
                    
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" placeholder="Enter new password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader className="text-red-600 dark:text-red-400">
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription className="text-red-600/80 dark:text-red-400/80">
                  Irreversible actions for your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-red-600 dark:text-red-400">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all your data. This action cannot be undone.
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ProfilePage;
