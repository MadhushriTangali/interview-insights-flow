
-- Fix the notification type constraint to include 'interview_scheduled'
ALTER TABLE public.interview_notifications 
DROP CONSTRAINT IF EXISTS interview_notifications_notification_type_check;

ALTER TABLE public.interview_notifications 
ADD CONSTRAINT interview_notifications_notification_type_check 
CHECK (notification_type IN ('one_day_before', 'one_hour_before', 'interview_scheduled'));

-- Update job_applications status to include the new options
ALTER TABLE public.job_applications 
DROP CONSTRAINT IF EXISTS job_applications_status_check;

ALTER TABLE public.job_applications 
ADD CONSTRAINT job_applications_status_check 
CHECK (status IN ('upcoming', 'completed', 'rejected', 'succeeded'));
