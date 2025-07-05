
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔔 Starting interview reminder notifications...');
    const now = new Date();
    
    // Calculate time ranges for notifications
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    // Create time windows (30-minute windows to catch interviews)
    const oneDayStart = new Date(oneDayFromNow.getTime() - 15 * 60 * 1000);
    const oneDayEnd = new Date(oneDayFromNow.getTime() + 15 * 60 * 1000);
    
    const oneHourStart = new Date(oneHourFromNow.getTime() - 15 * 60 * 1000);
    const oneHourEnd = new Date(oneHourFromNow.getTime() + 15 * 60 * 1000);

    console.log(`⏰ Looking for interviews between ${oneDayStart.toISOString()} and ${oneDayEnd.toISOString()} for 24-hour reminders`);
    console.log(`⏰ Looking for interviews between ${oneHourStart.toISOString()} and ${oneHourEnd.toISOString()} for 1-hour reminders`);

    // Get interviews for 24-hour reminders
    const { data: oneDayInterviews, error: oneDayError } = await supabase
      .from('job_applications')
      .select('*')
      .eq('status', 'upcoming')
      .gte('interview_date', oneDayStart.toISOString())
      .lte('interview_date', oneDayEnd.toISOString());

    if (oneDayError) {
      console.error('❌ Error fetching 24-hour interviews:', oneDayError);
    }

    // Get interviews for 1-hour reminders
    const { data: oneHourInterviews, error: oneHourError } = await supabase
      .from('job_applications')
      .select('*')
      .eq('status', 'upcoming')
      .gte('interview_date', oneHourStart.toISOString())
      .lte('interview_date', oneHourEnd.toISOString());

    if (oneHourError) {
      console.error('❌ Error fetching 1-hour interviews:', oneHourError);
    }

    let emailsSent = 0;

    // Send 24-hour reminders
    if (oneDayInterviews && oneDayInterviews.length > 0) {
      console.log(`📧 Found ${oneDayInterviews.length} interviews for 24-hour reminders`);
      for (const interview of oneDayInterviews) {
        const sent = await sendNotification(interview, 'one_day_before');
        if (sent) emailsSent++;
      }
    }

    // Send 1-hour reminders
    if (oneHourInterviews && oneHourInterviews.length > 0) {
      console.log(`📧 Found ${oneHourInterviews.length} interviews for 1-hour reminders`);
      for (const interview of oneHourInterviews) {
        const sent = await sendNotification(interview, 'one_hour_before');
        if (sent) emailsSent++;
      }
    }

    console.log(`✅ Notification check completed. Emails sent: ${emailsSent}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Interview reminder notifications processed',
        emailsSent,
        oneDayReminders: oneDayInterviews?.length || 0,
        oneHourReminders: oneHourInterviews?.length || 0,
        timestamp: now.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('❌ Error in interview reminder function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};

async function sendNotification(interview: JobApplication, notificationType: 'one_day_before' | 'one_hour_before'): Promise<boolean> {
  try {
    // Check if notification already sent
    const { data: existingNotification } = await supabase
      .from('interview_notifications')
      .select('id')
      .eq('job_application_id', interview.id)
      .eq('notification_type', notificationType)
      .single();

    if (existingNotification) {
      console.log(`⏭️ Notification already sent for interview ${interview.id} (${notificationType})`);
      return false;
    }

    // Get user email from auth
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(interview.user_id);
    
    if (userError || !user?.user?.email) {
      console.error('❌ Error getting user email:', userError);
      return false;
    }

    const userEmail = user.user.email;
    const userName = user.user.user_metadata?.full_name || user.user.user_metadata?.name || user.user.email;

    // Format interview details
    const interviewDate = new Date(interview.interview_date);
    const timeText = notificationType === 'one_day_before' ? 'tomorrow' : 'in 1 hour';
    const urgencyIcon = notificationType === 'one_day_before' ? '📅' : '🚨';
    const subject = `${urgencyIcon} Interview Reminder: ${interview.company_name} - ${timeText}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${urgencyIcon} Interview Alert!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">You have an interview ${timeText}</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Hi ${userName}! 👋</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            This is your ${notificationType === 'one_day_before' ? '24-hour' : '1-hour'} reminder for your upcoming interview.
          </p>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">📋 Interview Details</h3>
            <div style="display: grid; gap: 12px;">
              <div><strong style="color: #667eea;">🏢 Company:</strong> <span style="color: #333;">${interview.company_name}</span></div>
              <div><strong style="color: #667eea;">💼 Position:</strong> <span style="color: #333;">${interview.role}</span></div>
              <div><strong style="color: #667eea;">📅 Date:</strong> <span style="color: #333;">${interviewDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span></div>
              <div><strong style="color: #667eea;">🕐 Time:</strong> <span style="color: #333;">${interview.interview_time}</span></div>
            </div>
          </div>
          
          ${notificationType === 'one_day_before' ? `
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="color: #1976d2; margin-top: 0;">💡 Preparation Tips:</h4>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li>Review the company's recent news and updates</li>
                <li>Prepare your STAR method examples</li>
                <li>Test your video call setup if it's virtual</li>
                <li>Plan your route and arrive 10-15 minutes early</li>
              </ul>
            </div>
          ` : `
            <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 25px 0; border: 2px solid #ff9800;">
              <h4 style="color: #f57c00; margin-top: 0;">🚨 Final Checklist:</h4>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li>Double-check the interview location/link</li>
                <li>Have your resume and questions ready</li>
                <li>Silence your phone notifications</li>
                <li>Take a deep breath - you've got this! 💪</li>
              </ul>
            </div>
          `}
          
          <div style="text-align: center; margin-top: 30px;">
            <div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 15px 30px; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px;">
              🍀 Best of luck with your interview!
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
          <p>This is an automated reminder from your Interview Tracker app.</p>
          <p style="margin: 5px 0;">💼 Stay organized, stay confident!</p>
        </div>
      </div>
    `;

    const { error: emailError } = await resend.emails.send({
      from: 'Interview Tracker <onboarding@resend.dev>',
      to: [userEmail],
      subject: subject,
      html: emailHtml,
    });

    if (emailError) {
      console.error('❌ Error sending email:', emailError);
      return false;
    }

    // Record notification as sent
    await supabase
      .from('interview_notifications')
      .insert({
        job_application_id: interview.id,
        notification_type: notificationType,
      });

    console.log(`✅ Sent ${notificationType} notification to ${userEmail} for interview: ${interview.company_name}`);
    return true;

  } catch (error) {
    console.error(`❌ Error processing notification for interview ${interview.id}:`, error);
    return false;
  }
}

serve(handler);
