-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('customer', 'manager');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'customer',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_roles.user_id = $1;
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role on signup"
ON public.user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create room inquiries table
CREATE TABLE public.room_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  message text NOT NULL,
  -- Inquiry / booking status (internal values)
  -- pending   -> inquiry received, not yet confirmed
  -- contacted -> booked / in progress
  -- resolved  -> cancelled / closed
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'resolved')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.room_inquiries ENABLE ROW LEVEL SECURITY;

-- Customers can create inquiries
CREATE POLICY "Customers can create inquiries"
ON public.room_inquiries FOR INSERT
WITH CHECK (auth.uid() = customer_id);

-- Customers can view their own inquiries
CREATE POLICY "Customers can view their own inquiries"
ON public.room_inquiries FOR SELECT
USING (auth.uid() = customer_id);

-- Managers can view inquiries for their rooms
CREATE POLICY "Managers can view inquiries for their rooms"
ON public.room_inquiries FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.rooms 
    WHERE rooms.id = room_inquiries.room_id 
    AND rooms.owner_id = auth.uid()
  )
);

-- Managers can update inquiry status
CREATE POLICY "Managers can update inquiry status"
ON public.room_inquiries FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.rooms 
    WHERE rooms.id = room_inquiries.room_id 
    AND rooms.owner_id = auth.uid()
  )
);

-- Update rooms RLS to only allow managers to insert
DROP POLICY IF EXISTS "Authenticated users can insert rooms" ON public.rooms;
CREATE POLICY "Only managers can insert rooms"
ON public.rooms FOR INSERT
WITH CHECK (
  auth.uid() = owner_id AND 
  public.get_user_role(auth.uid()) = 'manager'
);

-- Trigger for updated_at on inquiries
CREATE TRIGGER update_room_inquiries_updated_at
BEFORE UPDATE ON public.room_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();