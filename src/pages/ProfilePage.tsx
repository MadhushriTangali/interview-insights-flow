
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneCollection } from "@/components/profile/phone-collection";
import { toast } from "sonner";
import { User, Mail, Calendar, Shield } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    email: "",
    phone: "",
    created_at: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        // Fetch from profiles table
        const { data, error } = await supabase
          .from('profiles' as any)
          .select('phone')
          .eq('id', user.id)
          .maybeSingle();
          
        setProfile({
          email: user.email || "",
          phone: data?.phone || "",
          created_at: user.created_at || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile({
          email: user.email || "",
          phone: "",
          created_at: user.created_at || "",
        });
      }
    };
    
    fetchProfile();
  }, [user]);

  const handlePhoneSubmit = async (phone: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles' as any)
        .upsert({
          id: user.id,
          phone: phone,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setProfile(prev => ({ ...prev, phone }));
      toast.success("Phone number updated successfully");
    } catch (error: any) {
      console.error("Error updating phone:", error);
      toast.error("Failed to update phone number");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  if (!user) {
    return (
      <>
        <Header />
        <main className="flex-1 py-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <div className="container px-4 md:px-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please sign in to view your profile.</p>
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
              Profile
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your account settings and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your basic account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="created">Member Since</Label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="created"
                      value={profile.created_at ? new Date(profile.created_at).toLocaleDateString() : ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone Number Collection */}
            <PhoneCollection
              onPhoneSubmit={handlePhoneSubmit}
              currentPhone={profile.phone}
            />
          </div>

          {/* Account Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Actions
              </CardTitle>
              <CardDescription>
                Manage your account security and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSignOut}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ProfilePage;
