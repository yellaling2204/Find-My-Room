import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { RoomInsert, uploadRoomImages, useCreateRoom } from '@/hooks/useRooms';
import { useAuth } from '@/hooks/useAuth';
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

interface RoomFormProps {
  onSuccess?: () => void;
}

export function RoomForm({ onSuccess }: RoomFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const createRoom = useCreateRoom();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      city: '',
      rent_price: 0,
      property_type: '1 BHK',
      tenant_preference: 'Any',
      contact_number: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast({
        title: 'Too many images',
        description: 'You can upload a maximum of 5 images',
        variant: 'destructive',
      });
      return;
    }

    setImages([...images, ...files]);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const onSubmit = async (data: RoomFormData) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add a room',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadRoomImages(images);
      }

      const roomData: RoomInsert = {
        title: data.title,
        description: data.description,
        location: data.location,
        city: data.city,
        rent_price: data.rent_price,
        property_type: data.property_type as PropertyType,
        tenant_preference: data.tenant_preference as TenantPreference,
        contact_number: data.contact_number,
        owner_id: user.id,
        images: imageUrls,
      };

      await createRoom.mutateAsync(roomData);

      toast({
        title: 'Room added successfully! 🎉',
        description: 'Your room listing is now live and visible to all customers. You can manage it from "My Listings".',
      });

      form.reset();
      setImages([]);
      setImagePreviewUrls([]);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error adding room',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Image Upload */}
        <div>
          <label className="text-base font-semibold text-foreground mb-3 block">
            Room Images <span className="text-muted-foreground font-normal">(Max 5 images)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-border shadow-sm group">
                <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-destructive rounded-full text-destructive-foreground hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-all">
                <Upload className="w-10 h-10 mb-2" />
                <span className="text-xs text-center font-medium">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

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
                  className="min-h-[100px]"
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

        <div className="pt-4 border-t border-border">
          <Button
            type="submit"
            disabled={isUploading || createRoom.isPending}
            size="lg"
            className="w-full h-14 text-lg gradient-warm text-primary-foreground shadow-warm hover:shadow-premium font-semibold"
          >
            {isUploading || createRoom.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Publishing Room...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Publish Room Listing
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Your room will be immediately visible to all customers after publishing
          </p>
        </div>
      </form>
    </Form>
  );
}
