
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useInterviewCleanup = (onInterviewsUpdated?: () => void) => {
  useEffect(() => {
    // Set up real-time listener for job applications changes
    const channel = supabase
      .channel('job-applications-changes')
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'job_applications'
        },
        () => {
          console.log('Interview removed from database');
          onInterviewsUpdated?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onInterviewsUpdated]);
};
