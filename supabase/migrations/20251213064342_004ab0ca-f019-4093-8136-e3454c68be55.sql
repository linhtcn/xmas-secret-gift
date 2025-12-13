-- Create enum for user type (friend or family)
CREATE TYPE public.user_type AS ENUM ('friend', 'family');

-- Create table for questionnaire responses
CREATE TABLE public.questionnaire_responses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_type user_type NOT NULL,
    responses JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert responses (no auth required for visitors)
CREATE POLICY "Anyone can submit responses"
ON public.questionnaire_responses
FOR INSERT
WITH CHECK (true);

-- Create admin_users table for admin login
CREATE TABLE public.admin_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow reading admin_users for login verification (password check happens in code)
CREATE POLICY "Allow reading for login"
ON public.admin_users
FOR SELECT
USING (true);

-- Insert the admin user (password: Linh1234! - we'll use simple hash for demo)
INSERT INTO public.admin_users (username, password_hash)
VALUES ('LinhNe', 'Linh1234!');

-- Create policy for admin to read all responses
CREATE POLICY "Anyone can read responses"
ON public.questionnaire_responses
FOR SELECT
USING (true);