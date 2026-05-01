-- Copy and paste this entirely into the Supabase SQL Editor and click "Run"

-- 1. Create Patients Table
CREATE TABLE public.patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  phone TEXT,
  last_visit DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- 3. Create Security Policies (Doctors can only see their own patients)
CREATE POLICY "Doctors can manage their own patients" 
ON public.patients 
FOR ALL 
USING (auth.uid() = doctor_id);

-- 4. Insert some mock data (Run this AFTER you create an account and log in, replace YOUR_UID_HERE with your user ID from the Auth tab)
-- INSERT INTO public.patients (doctor_id, name, age, gender, phone) VALUES 
-- ('YOUR_UID_HERE', 'Rahul Sharma', 45, 'Male', '+919876543210'),
-- ('YOUR_UID_HERE', 'Priya Patel', 32, 'Female', '+919876543211');
