import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useAuth } from '@/hooks/useAuth';
import { useCreateInquiry } from '@/hooks/useInquiries';
import { useToast } from '@/hooks/use-toast';
import { PublicRoom } from '@/hooks/useRooms';
import { useUserProfile } from '@/hooks/useUserProfile';

const inquirySchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_email: z.string().email('Please enter a valid email'),
  customer_phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryDialogProps {
  room: PublicRoom;
  trigger?: React.ReactNode;
}

export function InquiryDialog({ room, trigger }: InquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();
  const createInquiry = useCreateInquiry();
  const { toast } = useToast();

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      customer_name: userProfile?.full_name || '',
      customer_email: user?.email || '',
      customer_phone: userProfile?.phone || '',
      message: `Hi, I'm interested in "${room.title}" at ${room.location}, ${room.city}. Please share more details.`,
    },
  });
  
  // Update form when profile loads
  useEffect(() => {
    if (userProfile && open) {
      form.setValue('customer_name', userProfile.full_name || '');
      form.setValue('customer_email', user?.email || '');
      if (userProfile.phone) {
        form.setValue('customer_phone', userProfile.phone);
      }
    }
  }, [userProfile, open, user?.email, form]);

  const onSubmit = async (data: InquiryFormData) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to send an inquiry.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createInquiry.mutateAsync({
        room_id: room.id,
        customer_id: user.id,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        message: data.message,
      });

      toast({
        title: 'Room inquiry sent!',
        description: 'This room has been added to your booked rooms list. The property manager will contact you soon.',
      });
      setOpen(false);
      form.reset();
    } catch (error: unknown) {
      toast({
        title: 'Failed to send inquiry',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gradient-warm text-primary-foreground shadow-warm">
            <Send className="w-4 h-4 mr-2" />
            Book Room
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book This Room</DialogTitle>
          <DialogDescription>
            Send an inquiry to the property manager about "{room.title}". It will be added to your booked rooms list.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell the manager what you're looking for..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={createInquiry.isPending}
              className="w-full gradient-warm text-primary-foreground"
            >
              {createInquiry.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Book Room
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
