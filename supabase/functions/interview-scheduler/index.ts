
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

interface JobApplication {
  id: string;
  user_id: string;
  company_name: string;
  role: string;
  interview_date: string;
  interview_time: string;
}

interface UserProfile {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting interview scheduler task...');

    // Get current time
    const now = new Date();
    
    // 1. Remove past interviews (older than 24 hours)
    const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const { data: pastInterviews, error: pastError } = await supabase
      .from('job_applications')
      .delete()
      .lt('interview_date', pastDate.toISOString())
      .select();

    if (pastError) {
      console.error('Error removing past interviews:', pastError);
    } else {
      console.log(`Removed ${pastInterviews?.length || 0} past interviews`);
    }

    // 2. Send one-day-before notifications
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const oneDayStart = new Date(oneDayFromNow.getFullYear(), oneDayFromNow.getMonth(), oneDayFromNow.getDate());
    const oneDayEnd = new Date(oneDayStart.getTime() + 24 * 60 * 60 * 1000);

    const { data: oneDayInterviews, error: oneDayError } = await supabase
      .from('job_applications')
      .select('*')
      .gte('interview_date', oneDayStart.toISOString())
      .lt('interview_date', oneDayEnd.toISOString())
      .eq('status', 'upcoming');

    if (oneDayError) {
      console.error('Error fetching one-day interviews:', oneDayError);
    } else if (oneDayInterviews) {
      await sendNotifications(oneDayInterviews, 'one_day_before');
    }

    // 3. Send one-hour-before notifications
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const oneHourStart = new Date(oneHourFromNow.getTime() - 30 * 60 * 1000); // 30 min window
    const oneHourEnd = new Date(oneHourFromNow.getTime() + 30 * 60 * 1000);

    const { data: oneHourInterviews, error: oneHourError } = await supabase
      .from('job_applications')
      .select('*')
      .gte('interview_date', oneHourStart.toISOString())
      .lt('interview_date', oneHourEnd.toISOString())
      .eq('status', 'upcoming');

    if (oneHourError) {
      console.error('Error fetching one-hour interviews:', oneHourError);
    } else if (oneHourInterviews) {
      await sendNotifications(oneHourInterviews, 'one_hour_before');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        pastInterviewsRemoved: pastInterviews?.length || 0,
        oneDayNotifications: oneDayInterviews?.length || 0,
        oneHourNotifications: oneHourInterviews?.length || 0
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in interview scheduler:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function sendNotifications(interviews: JobApplication[], notificationType: 'one_day_before' | 'one_hour_before') {
  for (const interview of interviews) {
    try {
      // Check if notification already sent
      const { data: existingNotification } = await supabase
        .from('interview_notifications')
        .select('id')
        .eq('job_application_id', interview.id)
        .eq('notification_type', notificationType)
        .single();

      if (existingNotification) {
        console.log(`Notification already sent for interview ${interview.id}`);
        continue;
      }

      // Get user email from auth
      const { data: user, error: userError } = await supabase.auth.admin.getUserById(interview.user_id);
      
      if (userError || !user?.user?.email) {
        console.error('Error getting user email:', userError);
        continue;
      }

      const userEmail = user.user.email;
      const userName = user.user.user_metadata?.name || user.user.email;

      // Send email notification
      const timeText = notificationType === 'one_day_before' ? 'tomorrow' : 'in 1 hour';
      const subject = `Interview Reminder: ${interview.company_name} - ${timeText}`;
      
      const emailHtml = `
        <h2>Interview Reminder</h2>
        <p>Hi ${userName},</p>
        <p>This is a reminder that you have an interview ${timeText}:</p>
        <ul>
          <li><strong>Company:</strong> ${interview.company_name}</li>
          <li><strong>Role:</strong> ${interview.role}</li>
          <li><strong>Date:</strong> ${new Date(interview.interview_date).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${interview.interview_time}</li>
        </ul>
        <p>Good luck with your interview!</p>
        <p>Best regards,<br>Interview Tracker Team</p>
      `;

      const { error: emailError } = await resend.emails.send({
        from: 'Interview Tracker <onboarding@resend.dev>',
        to: [userEmail],
        subject: subject,
        html: emailHtml,
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        continue;
      }

      // Record notification as sent
      await supabase
        .from('interview_notifications')
        .insert({
          job_application_id: interview.id,
          notification_type: notificationType,
        });

      console.log(`Sent ${notificationType} notification for interview ${interview.id}`);

    } catch (error) {
      console.error(`Error processing notification for interview ${interview.id}:`, error);
    }
  }
}

serve(handler);
