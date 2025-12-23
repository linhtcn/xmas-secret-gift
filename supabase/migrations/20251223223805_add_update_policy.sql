-- Add UPDATE policy for questionnaire_responses to allow soft delete
-- Drop policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Anyone can update responses" ON public.questionnaire_responses;

-- Create the UPDATE policy
CREATE POLICY "Anyone can update responses"
ON public.questionnaire_responses
FOR UPDATE
USING (true)
WITH CHECK (true);

