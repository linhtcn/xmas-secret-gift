-- Add soft delete and player_name columns to questionnaire_responses
ALTER TABLE public.questionnaire_responses 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN player_name TEXT DEFAULT NULL;

-- Create game_statistics table for visitor counts
CREATE TABLE public.game_statistics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    fake_count INTEGER NOT NULL DEFAULT 0,
    real_count INTEGER NOT NULL DEFAULT 0,
    last_fake_increment TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_statistics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read game statistics
CREATE POLICY "Anyone can read game statistics"
ON public.game_statistics
FOR SELECT
USING (true);

-- Allow anyone to update game statistics (for incrementing counts)
CREATE POLICY "Anyone can update game statistics"
ON public.game_statistics
FOR UPDATE
USING (true);

-- Insert initial row for game statistics
INSERT INTO public.game_statistics (fake_count, real_count, last_fake_increment)
VALUES (0, 0, now());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_game_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_game_statistics_updated_at
BEFORE UPDATE ON public.game_statistics
FOR EACH ROW
EXECUTE FUNCTION public.update_game_stats_updated_at();