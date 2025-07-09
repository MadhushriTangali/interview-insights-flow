
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useAutoUpdateExpiredInterviews = (onUpdate?: () => void) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const updateExpiredInterviews = async () => {
      try {
        const now = new Date();
        
        // Get all upcoming interviews that are past their date
        const { data: expiredInterviews, error: fetchError } = await supabase
          .from('job_applications')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'upcoming')
          .lt('interview_date', now.toISOString());

        if (fetchError) {
          console.error("Error fetching expired interviews:", fetchError);
          return;
        }

        if (expiredInterviews && expiredInterviews.length > 0) {
          // Update all expired interviews to "completed" status
          const { error: updateError } = await supabase
            .from('job_applications')
            .update({ status: 'completed' })
            .eq('user_id', user.id)
            .eq('status', 'upcoming')
            .lt('interview_date', now.toISOString());

          if (updateError) {
            console.error("Error updating expired interviews:", updateError);
          } else {
            console.log(`Updated ${expiredInterviews.length} expired interviews to completed`);
            if (onUpdate) {
              onUpdate();
            }
          }
        }
      } catch (error) {
        console.error("Error in auto-update expired interviews:", error);
      }
    };

    // Run immediately
    updateExpiredInterviews();

    // Run every hour
    const interval = setInterval(updateExpiredInterviews, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, onUpdate]);
};
