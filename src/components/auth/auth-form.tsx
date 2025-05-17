
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
import { setCurrentUser } from "@/lib/auth";
import { User } from "@/types";

type AuthFormProps = {
  type: "login" | "register" | "forgot";
};

// Mock user database
const MOCK_USERS: User[] = [];

export function AuthForm({ type }: AuthFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
        // Mock registration - would be replaced by actual authentication
        setTimeout(() => {
          const newUser: User = {
            id: `user${Math.floor(Math.random() * 10000)}`,
            name: data.name,
            email: data.email,
            createdAt: new Date(),
          };
          
          MOCK_USERS.push(newUser);
          toast.success("Registration successful! Please log in.");
          navigate("/login");
        }, 1500);
      } else if (type === "login") {
        // Mock login - would be replaced by actual authentication
        setTimeout(() => {
          // For demo purposes, we'll just create a mock user
          const user: User = {
            id: `user${Math.floor(Math.random() * 10000)}`,
            name: "Demo User",
            email: data.email,
            createdAt: new Date(),
          };
          
          setCurrentUser(user);
          toast.success("Login successful!");
          navigate("/dashboard");
        }, 1500);
      } else {
        // Mock forgot password
        setTimeout(() => {
          toast.success("Password reset email sent to " + data.email);
        }, 1500);
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    
    // Mock Google sign-in - would be replaced by actual authentication
    setTimeout(() => {
      const user: User = {
        id: `user${Math.floor(Math.random() * 10000)}`,
        name: "Google User",
        email: "google.user@example.com",
        photoURL: "https://lh3.googleusercontent.com/a/default-user",
        createdAt: new Date(),
      };
      
      setCurrentUser(user);
      toast.success("Google sign-in successful!");
      navigate("/dashboard");
      setIsLoading(false);
    }, 1500);
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
