import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  is_public: boolean;
  organizer: {
    id: number;
    username: string;
    full_name: string;
  };
}

const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const response = await api.get('/events/', {
        params: { organizer: user?.username },
      });
      setEvents(response.data.results);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch your events',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-gradient-hero py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-4 text-4xl font-bold text-primary-foreground">My Events</h1>
              <p className="text-lg text-primary-foreground/90">
                Manage your organized events
              </p>
            </div>
            <Link to="/events/create">
              <Button size="lg" className="shadow-lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading your events...</div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center shadow-card">
            <p className="mb-4 text-lg text-muted-foreground">You haven't created any events yet</p>
            <Link to="/events/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
