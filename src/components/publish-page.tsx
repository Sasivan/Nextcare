
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMqttContext } from '@/context/mqtt-context';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Send, ServerCrash } from 'lucide-react';

const publishSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  message: z.string().min(1, 'Message is required'),
  qos: z.enum(['0', '1', '2']),
});

type PublishFormValues = z.infer<typeof publishSchema>;

export function PublishPage() {
  const { publish, payload } = useMqttContext();
  const { toast } = useToast();

  const form = useForm<PublishFormValues>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      topic: 'vital-signs',
      message: '',
      qos: '1',
    },
  });

  const onSubmit = (data: PublishFormValues) => {
    try {
      publish(data.topic, data.message, parseInt(data.qos, 10) as 0 | 1 | 2);
      toast({
        title: 'Message Published',
        description: `Successfully sent to topic: ${data.topic}`,
        action: <Send className="h-5 w-5 text-green-500" />
      });
      form.resetField('message');
    } catch (error) {
       console.error("Failed to publish message:", error);
       toast({
         variant: 'destructive',
         title: 'Publish Error',
         description: 'Could not send message. Check connection.',
         action: <ServerCrash className="h-5 w-5" />
       });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Publish Message</CardTitle>
          <CardDescription>
            Manually send a message to an MQTT topic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., vital-signs" {...field} />
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
                        placeholder="Enter your message here. Can be plain text or JSON."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The content of the message to publish.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>QoS (Quality of Service)</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a QoS level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0 - At most once</SelectItem>
                        <SelectItem value="1">1 - At least once</SelectItem>
                        <SelectItem value="2">2 - Exactly once</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full">
                <Send className="mr-2 h-5 w-5" />
                Publish
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Incoming Messages</CardTitle>
          <CardDescription>
            Raw JSON data received from the 'vital-signs' topic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/20">
            <pre className="text-sm whitespace-pre-wrap">
              {payload ? JSON.stringify(payload, null, 2) : 'Waiting for messages...'}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
