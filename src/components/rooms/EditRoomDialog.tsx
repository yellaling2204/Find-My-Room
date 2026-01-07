import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Room, useUpdateRoom } from '@/hooks/useRooms';
import { Constants, Database } from '@/integrations/supabase/types';

type PropertyType = Database['public']['Enums']['property_type'];
type TenantPreference = Database['public']['Enums']['tenant_preference'];

const propertyTypes = Constants.public.Enums.property_type;
const tenantPreferences = Constants.public.Enums.tenant_preference;

const roomSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  location: z.string().min(3, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  rent_price: z.coerce.number().min(1, 'Rent price is required'),
  property_type: z.string().min(1, 'Property type is required'),
  tenant_preference: z.string().min(1, 'Tenant preference is required'),
  contact_number: z.string().min(10, 'Valid contact number is required'),
});

type RoomFormData = z.infer<typeof roomSchema>;

interface EditRoomDialogProps {
  room: Room;
  trigger?: React.ReactNode;
}

export function EditRoomDialog({ room, trigger }: EditRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const updateRoom = useUpdateRoom();

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      title: room.title,
      description: room.description || '',
      location: room.location,
      city: room.city,
      rent_price: room.rent_price,
      property_type: room.property_type,
      tenant_preference: room.tenant_preference,
      contact_number: room.contact_number,
    },
  });

  // Reset form when dialog opens with room data
  useEffect(() => {
    if (open) {
      form.reset({
        title: room.title,
        description: room.description || '',
        location: room.location,
        city: room.city,
        rent_price: room.rent_price,
        property_type: room.property_type,
        tenant_preference: room.tenant_preference,
        contact_number: room.contact_number,
      });
    }
  }, [open, room, form]);

  const onSubmit = async (data: RoomFormData) => {
    try {
      await updateRoom.mutateAsync({
        id: room.id,
        title: data.title,
        description: data.description,
        location: data.location,
        city: data.city,
        rent_price: data.rent_price,
        property_type: data.property_type as PropertyType,
        tenant_preference: data.tenant_preference as TenantPreference,
        contact_number: data.contact_number,
      });

      toast({
        title: 'Room updated successfully! ✅',
        description: 'Your room listing has been updated and changes are now visible to customers.',
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: 'Error updating room',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Room Listing</DialogTitle>
          <DialogDescription>
            Update the details of "{room.title}". Changes will be reflected immediately.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Spacious 2 BHK in Prime Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your room, amenities, nearby facilities..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location / Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Street, Area, Landmark" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Mumbai, Delhi, Bangalore..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Rent Price */}
              <FormField
                control={form.control}
                name="rent_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rent Price (₹/month)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Property Type */}
              <FormField
                control={form.control}
                name="property_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tenant Preference */}
              <FormField
                control={form.control}
                name="tenant_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant Preference</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tenantPreferences.map((pref) => (
                          <SelectItem key={pref} value={pref}>
                            {pref}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Number */}
            <FormField
              control={form.control}
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 98765 43210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={updateRoom.isPending}
                className="flex-1 gradient-warm text-primary-foreground shadow-warm"
              >
                {updateRoom.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Room
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateRoom.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

