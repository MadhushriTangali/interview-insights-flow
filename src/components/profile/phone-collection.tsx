
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone } from "lucide-react";
import { toast } from "sonner";

interface PhoneCollectionProps {
  onPhoneSubmit: (phone: string) => void;
  currentPhone?: string;
}

export function PhoneCollection({ onPhoneSubmit, currentPhone }: PhoneCollectionProps) {
  const [phone, setPhone] = useState(currentPhone || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await onPhoneSubmit(phone);
      toast.success("Phone number updated successfully");
    } catch (error) {
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
          Phone Number
        </CardTitle>
        <CardDescription>
          We'll use this to send you SMS notifications about your interviews
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
            {isSubmitting ? "Updating..." : currentPhone ? "Update Phone Number" : "Save Phone Number"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
