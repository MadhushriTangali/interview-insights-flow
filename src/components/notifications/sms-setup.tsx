
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Bell } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function SMSSetup() {
  const { user } = useAuth();
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);

  useEffect(() => {
    const checkUserPhone = async () => {
      if (!user) return;
      
      try {
        // Use raw SQL query to access profiles table until types are updated
        const { data, error } = await supabase
          .rpc('get_user_profile', { user_id: user.id });
          
        if (error) {
          // Fallback to direct query if RPC doesn't exist
          const { data: profileData, error: profileError } = await supabase
            .from('profiles' as any)
            .select('phone')
            .eq('id', user.id)
            .maybeSingle();
            
          if (!profileError && profileData?.phone) {
            setPhone(profileData.phone);
            setHasPhone(true);
          }
        } else if (data?.phone) {
          setPhone(data.phone);
          setHasPhone(true);
        }
      } catch (error) {
        console.error("Error checking phone:", error);
      }
    };
    
    checkUserPhone();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast.error("Please enter a phone number");
      return;
    }
    
    // Basic phone validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles' as any)
        .upsert({
          id: user?.id,
          phone: phone,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setHasPhone(true);
      toast.success("Phone number updated successfully");
    } catch (error) {
      console.error("Error updating phone:", error);
      toast.error("Failed to update phone number");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          SMS Notifications
        </CardTitle>
        <CardDescription>
          {hasPhone 
            ? "Your phone number is set up for SMS notifications" 
            : "Add your phone number to receive SMS reminders for upcoming interviews"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            <Bell className="h-4 w-4 mr-2" />
            {isSubmitting ? "Updating..." : hasPhone ? "Update Phone Number" : "Enable SMS Notifications"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
