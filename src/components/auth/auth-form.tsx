
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

type AuthFormProps = {
  type: "login" | "register" | "forgot";
};

export function AuthForm({ type }: AuthFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Define schema based on form type
  let formSchema;
  
  if (type === "register") {
    formSchema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Please enter a valid email"),
      password: z.string().min(6, "Password must be at least 6 characters"),
    });
  } else if (type === "login") {
    formSchema = z.object({
      email: z.string().email("Please enter a valid email"),
      password: z.string().min(1, "Password is required"),
    });
  } else {
    // Forgot password
    formSchema = z.object({
      email: z.string().email("Please enter a valid email"),
    });
  }

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if (type === "register") {
        // Enhanced sign up with proper error handling and redirect URL
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });
        
        if (error) {
          console.error("Sign up error:", error);
          throw error;
        }
        
        if (authData.user && !authData.session) {
          toast.success("Registration successful! Please check your email to verify your account.");
        } else if (authData.session) {
          toast.success("Registration successful! You're now logged in.");
          navigate("/dashboard");
        }
      } else if (type === "login") {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        
        if (error) {
          console.error("Login error:", error);
          // Show forgot password option on failed login
          if (error.message?.includes("Invalid login credentials")) {
            setShowForgotPassword(true);
          }
          throw error;
        }
        
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        
        if (error) {
          console.error("Password reset error:", error);
          throw error;
        }
        
        toast.success("Password reset email sent to " + data.email);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Enhanced error handling
      if (error.message?.includes("User already registered")) {
        toast.error("An account with this email already exists. Please sign in instead.");
      } else if (error.message?.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please check your credentials.");
      } else if (error.message?.includes("Email not confirmed")) {
        toast.error("Please check your email and confirm your account before signing in.");
      } else if (error.message?.includes("Failed to fetch")) {
        toast.error("Network error. Please check your internet connection and try again.");
      } else {
        toast.error(error.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error("Google sign-in error:", error);
        throw error;
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast.error(error.message || "Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {type === "register" && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your name" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    type="email" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {(type === "login" || type === "register") && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your password" 
                      type="password" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {type === "login" && (
            <div className="text-sm text-right">
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal" 
                onClick={() => navigate("/forgot-password")}
                type="button"
                disabled={isLoading}
              >
                Forgot password?
              </Button>
            </div>
          )}

          {/* Show forgot password button after failed login */}
          {type === "login" && showForgotPassword && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                Having trouble logging in?
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/forgot-password")}
                type="button"
                disabled={isLoading}
                className="w-full"
              >
                Reset Password
              </Button>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="mr-2" size="sm" />
            ) : null}
            {type === "login" ? "Sign In" : type === "register" ? "Sign Up" : "Reset Password"}
          </Button>
        </form>
      </Form>
      
      {type !== "forgot" && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            type="button" 
            className="w-full" 
            onClick={handleGoogleSignIn} 
            disabled={isLoading}
          >
            {isLoading ? <Loader className="mr-2" size="sm" /> : null}
            Google
          </Button>
        </>
      )}
      
      {type === "login" ? (
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto font-normal" 
            onClick={() => navigate("/register")}
            type="button"
            disabled={isLoading}
          >
            Sign up
          </Button>
        </p>
      ) : type === "register" ? (
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto font-normal" 
            onClick={() => navigate("/login")}
            type="button"
            disabled={isLoading}
          >
            Sign in
          </Button>
        </p>
      ) : null}
    </div>
  );
}
