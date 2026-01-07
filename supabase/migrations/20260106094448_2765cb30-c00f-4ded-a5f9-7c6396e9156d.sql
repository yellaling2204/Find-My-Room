-- Drop the security definer view and recreate with INVOKER security
DROP VIEW IF EXISTS public.rooms_public;

CREATE VIEW public.rooms_public 
WITH (security_invoker = true)
AS
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
FROM public.rooms
WHERE is_available = true;

-- Grant access to the view
GRANT SELECT ON public.rooms_public TO anon, authenticated;