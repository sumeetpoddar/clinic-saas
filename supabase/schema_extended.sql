-- Run this in Supabase SQL Editor to create the remaining tables

CREATE TABLE public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES auth.users(id) NOT NULL,
  patient_id UUID REFERENCES public.patients(id),
  patient_name TEXT,
  date DATE,
  time TEXT,
  status TEXT,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Docs appts" ON public.appointments FOR ALL USING (auth.uid() = doctor_id);

CREATE TABLE public.inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT,
  stock INTEGER,
  unit TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Docs inv" ON public.inventory FOR ALL USING (auth.uid() = doctor_id);

CREATE TABLE public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES auth.users(id) NOT NULL,
  patient_name TEXT,
  amount NUMERIC,
  date DATE,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Docs invc" ON public.invoices FOR ALL USING (auth.uid() = doctor_id);
