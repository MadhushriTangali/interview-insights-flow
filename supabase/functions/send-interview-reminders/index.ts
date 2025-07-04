
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Interview {
  id: string;
  company_name: string;
  role: string;
  interview_date: string;
  interview_time: string;
  user_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    console.log('Checking for interviews to remind...');

    // Get interviews that need 24-hour reminders
    const { data: oneDayInterviews, error: oneDayError } = await supabaseClient
      .from('job_applications')
      .select('*')
      .eq('status', 'upcoming')
      .gte('interview_date', now.toISOString())
      .lte('interview_date', oneDayFromNow.toISOString());

    if (oneDayError) {
      console.error('Error fetching one-day interviews:', oneDayError);
    }

    // Get interviews that need 1-hour reminders
    const { data: oneHourInterviews, error: oneHourError } = await supabaseClient
      .from('job_applications')
      .select('*')
      .eq('status', 'upcoming')
      .gte('interview_date', now.toISOString())
      .lte('interview_date', oneHourFromNow.toISOString());

    if (oneHourError) {
      console.error('Error fetching one-hour interviews:', oneHourError);
    }

    let emailsSent = 0;

    // Process 24-hour reminders
    if (oneDayInterviews && oneDayInterviews.length > 0) {
      for (const interview of oneDayInterviews) {
        // Check if we've already sent this reminder
        const { data: existingNotification } = await supabaseClient
          .from('interview_notifications')
          .select('id')
          .eq('job_application_id', interview.id)
          .eq('notification_type', 'one_day_before')
          .single();

        if (!existingNotification) {
          console.log(`Sending 24-hour reminder for interview: ${interview.company_name}`);
          
          // Record that we're sending this notification
          await supabaseClient
            .from('interview_notifications')
            .insert({
              job_application_id: interview.id,
              notification_type: 'one_day_before'
            });

          emailsSent++;
        }
      }
    }

    // Process 1-hour reminders
    if (oneHourInterviews && oneHourInterviews.length > 0) {
      for (const interview of oneHourInterviews) {
        // Check if we've already sent this reminder
        const { data: existingNotification } = await supabaseClient
          .from('interview_notifications')
          .select('id')
          .eq('job_application_id', interview.id)
          .eq('notification_type', 'one_hour_before')
          .single();

        if (!existingNotification) {
          console.log(`Sending 1-hour reminder for interview: ${interview.company_name}`);
          
          // Record that we're sending this notification
          await supabaseClient
            .from('interview_notifications')
            .insert({
              job_application_id: interview.id,
              notification_type: 'one_hour_before'
            });

          emailsSent++;
        }
      }
    }

    console.log(`Processed reminders. Emails sent: ${emailsSent}`);

    return new Response(
      JSON.stringify({ 
        message: 'Reminder check completed', 
        emailsSent,
        oneDayReminders: oneDayInterviews?.length || 0,
        oneHourReminders: oneHourInterviews?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-interview-reminders function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
