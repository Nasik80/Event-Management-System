import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    is_public: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}/`);
      const event = response.data;
      setFormData({
        title: event.title,
        description: event.description,
        location: event.location,
        start_time: event.start_time.slice(0, 16),
        end_time: event.end_time.slice(0, 16),
        is_public: event.is_public,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load event',
        variant: 'destructive',
      });
      navigate('/my-events');
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.patch(`/events/${id}/`, {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      });
      
      toast({
        title: 'Event updated!',
        description: 'Your changes have been saved.',
      });
      navigate(`/events/${id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update event',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium">
                  Event Title *
                </label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium">
                  Description *
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe your event"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="mb-2 block text-sm font-medium">
                  Location *
                </label>
                <Input
                  id="location"
                  placeholder="Event location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="start_time" className="mb-2 block text-sm font-medium">
                    Start Time *
                  </label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => handleChange('start_time', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="end_time" className="mb-2 block text-sm font-medium">
                    End Time *
                  </label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => handleChange('end_time', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label htmlFor="is_public" className="font-medium">
                    Public Event
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Make this event visible to everyone
                  </p>
                </div>
                <Switch
                  id="is_public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) => handleChange('is_public', checked)}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/events/${id}`)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditEvent;
