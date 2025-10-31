import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';

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

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card className="group transition-all hover:shadow-hover">
      <CardHeader>
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          {!event.is_public && (
            <Badge variant="secondary">Private</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {format(new Date(event.start_time), 'PPp')}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {event.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          {event.organizer.full_name}
        </div>
      </CardContent>

      <CardFooter>
        <Link to={`/events/${event.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
