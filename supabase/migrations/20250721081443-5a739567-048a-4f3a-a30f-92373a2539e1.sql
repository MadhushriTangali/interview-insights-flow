-- Create table for storing interview questions
CREATE TABLE public.interview_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  example TEXT,
  type TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own questions" 
ON public.interview_questions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own questions" 
ON public.interview_questions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questions" 
ON public.interview_questions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own questions" 
ON public.interview_questions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_interview_questions_updated_at
BEFORE UPDATE ON public.interview_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_interview_questions_user_company_role 
ON public.interview_questions(user_id, company, role);

CREATE INDEX idx_interview_questions_created_at 
ON public.interview_questions(created_at DESC);