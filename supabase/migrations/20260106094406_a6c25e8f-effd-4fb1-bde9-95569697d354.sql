-- Create a view that excludes contact_number for public browsing
CREATE OR REPLACE VIEW public.rooms_public AS
SELECT 
  id,
  title,
  description,
  location,
  city,
  rent_price,
  property_type,
  tenant_preference,
  images,
  is_available,
  owner_id,
  created_at,
  updated_at
FROM public.rooms;

-- Grant access to the view
GRANT SELECT ON public.rooms_public TO anon, authenticated;

-- Create a secure function to get contact number for authenticated users only
CREATE OR REPLACE FUNCTION public.get_room_contact(room_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  contact text;
BEGIN
  -- Only allow authenticated users
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to view contact details';
  END IF;
  
  SELECT contact_number INTO contact
  FROM public.rooms
  WHERE id = room_id;
  
  RETURN contact;
END;
$$;

-- Create a function to get available cities for location filter
CREATE OR REPLACE FUNCTION public.get_available_cities()
RETURNS TABLE(city text, room_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT city, COUNT(*) as room_count
  FROM public.rooms
  WHERE is_available = true
  GROUP BY city
  ORDER BY room_count DESC;
$$;