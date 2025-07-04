
-- Create a table to store interview ratings
CREATE TABLE public.interview_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  technical INTEGER NOT NULL CHECK (technical >= 1 AND technical <= 5),
  managerial INTEGER NOT NULL CHECK (managerial >= 1 AND managerial <= 5),
  projects INTEGER NOT NULL CHECK (projects >= 1 AND projects <= 5),
  self_introduction INTEGER NOT NULL CHECK (self_introduction >= 1 AND self_introduction <= 5),
  hr_round INTEGER NOT NULL CHECK (hr_round >= 1 AND hr_round <= 5),
  dressup INTEGER NOT NULL CHECK (dressup >= 1 AND dressup <= 5),
  communication INTEGER NOT NULL CHECK (communication >= 1 AND communication <= 5),
  body_language INTEGER NOT NULL CHECK (body_language >= 1 AND body_language <= 5),
  punctuality INTEGER NOT NULL CHECK (punctuality >= 1 AND punctuality <= 5),
  overall_rating DECIMAL(3,2) NOT NULL,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own ratings
ALTER TABLE public.interview_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for interview_ratings table
CREATE POLICY "Users can view their own interview ratings" 
  ON public.interview_ratings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interview ratings" 
  ON public.interview_ratings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview ratings" 
  ON public.interview_ratings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview ratings" 
  ON public.interview_ratings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create edge function for email notifications
CREATE OR REPLACE FUNCTION public.send_interview_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification record
  INSERT INTO public.interview_notifications (
    job_application_id,
    notification_type
  ) VALUES (
    NEW.id,
    'interview_scheduled'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new interview notifications
CREATE TRIGGER send_interview_notification_trigger
  AFTER INSERT ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.send_interview_notification();

-- Enable realtime for ratings table
ALTER TABLE public.interview_ratings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interview_ratings;
