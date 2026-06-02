
-- Create portfolio sites table
CREATE TABLE public.portfolio_sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_sites ENABLE ROW LEVEL SECURITY;

-- Anyone can view sites (public portfolio)
CREATE POLICY "Anyone can view portfolio sites"
ON public.portfolio_sites FOR SELECT USING (true);

-- Only authenticated owner can insert
CREATE POLICY "Owner can insert portfolio sites"
ON public.portfolio_sites FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only authenticated owner can update
CREATE POLICY "Owner can update portfolio sites"
ON public.portfolio_sites FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Only authenticated owner can delete
CREATE POLICY "Owner can delete portfolio sites"
ON public.portfolio_sites FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create storage bucket for site screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('site-screenshots', 'site-screenshots', true);

CREATE POLICY "Anyone can view site screenshots"
ON storage.objects FOR SELECT USING (bucket_id = 'site-screenshots');

CREATE POLICY "Authenticated users can upload screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-screenshots');

CREATE POLICY "Authenticated users can delete screenshots"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-screenshots');

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_portfolio_sites_updated_at
BEFORE UPDATE ON public.portfolio_sites
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
