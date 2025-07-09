
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { PhoneCollection } from "@/components/profile/phone-collection";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate("/auth");
      return;
    }

    // Load user phone number from user metadata
    if (user.user_metadata?.phone) {
      setPhoneNumber(user.user_metadata.phone);
    }
    setLoading(false);
  }, [user, authLoading, navigate]);

  const handlePhoneSubmit = async (phone: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { phone: phone }
      });
      
      if (error) throw error;
      
      setPhoneNumber(phone);
    } catch (error: any) {
      console.error("Error updating phone:", error);
      throw error;
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-4xl">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
      
      <main className="flex-1 py-12 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 min-h-screen">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Profile Settings
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your account settings and notification preferences
            </p>
          </div>

          <div className="grid gap-8">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member since</label>
                  <p className="text-lg">{new Date(user?.created_at || '').toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Notification Settings</h2>
              <PhoneCollection 
                onPhoneSubmit={handlePhoneSubmit}
                currentPhone={phoneNumber}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ProfilePage;
