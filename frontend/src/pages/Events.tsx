import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import EventCard from '@/components/EventCard';
import EventFilters from '@/components/EventFilters';
import Pagination from '@/components/Pagination';
import { useToast } from '@/hooks/use-toast';

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

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    organizer: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, [currentPage, filters]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(filters.title && { title: filters.title }),
        ...(filters.location && { location: filters.location }),
        ...(filters.organizer && { organizer: filters.organizer }),
      });

      const response = await api.get(`/events/?${params}`);
      setEvents(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch events',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ title: '', location: '', organizer: '' });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-gradient-hero py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-primary-foreground">Discover Events</h1>
        <p className="text-lg text-primary-foreground/90">
          Find and join amazing events in your community
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <EventFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center shadow-card">
            <p className="text-lg text-muted-foreground">No events found</p>
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Events;
