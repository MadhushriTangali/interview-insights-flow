
-- Create a table to track sent notifications to avoid duplicates
CREATE TABLE IF NOT EXISTS public.interview_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('one_day_before', 'one_hour_before')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the notifications table
ALTER TABLE public.interview_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications table
CREATE POLICY "Users can view their own interview notifications" 
  ON public.interview_notifications 
  FOR SELECT 
  USING (
    job_application_id IN (
      SELECT id FROM public.job_applications WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert interview notifications" 
  ON public.interview_notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interview_notifications_job_app_id ON public.interview_notifications(job_application_id);
CREATE INDEX IF NOT EXISTS idx_interview_notifications_type ON public.interview_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_job_applications_interview_date ON public.job_applications(interview_date);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);

-- Enable the pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable the pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;
