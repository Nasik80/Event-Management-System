import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, User, Star, Edit, Trash2 } from 'lucide-react';
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

interface Review {
  id: number;
  user: {
    id: number;
    username: string;
    full_name: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState<string>('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchEvent();
    fetchReviews();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}/`);
      setEvent(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load event',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/events/${id}/reviews/`);
      setReviews(response.data.results || []);
    } catch (error) {
      console.error('Failed to fetch reviews');
    }
  };

  const handleRSVP = async () => {
    if (!rsvpStatus) {
      toast({
        title: 'Please select a status',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.post(`/events/${id}/rsvp/`, { status: rsvpStatus });
      toast({
        title: 'RSVP submitted',
        description: `You marked yourself as "${rsvpStatus}"`,
      });
      setRsvpStatus('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit RSVP',
        variant: 'destructive',
      });
    }
  };

  const handleReviewSubmit = async () => {
    if (!comment.trim()) {
      toast({
        title: 'Please write a comment',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.post(`/events/${id}/reviews/`, { rating, comment });
      toast({
        title: 'Review posted',
        description: 'Thank you for your feedback!',
      });
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post review',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/events/${id}/`);
      toast({
        title: 'Event deleted',
        description: 'The event has been removed',
      });
      navigate('/my-events');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Event not found</div>
      </div>
    );
  }

  const isOrganizer = user?.id === event.organizer.id;

  return (
    <div className="min-h-screen bg-muted pb-12">
      <div className="bg-gradient-hero py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-primary-foreground">{event.title}</h1>
              {!event.is_public && <Badge className="bg-secondary">Private Event</Badge>}
            </div>
            {isOrganizer && (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => navigate(`/events/${id}/edit`)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 -mt-8">
        <Card className="mb-6 shadow-card">
          <CardContent className="pt-6">
            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <div>
                  <div className="font-medium text-card-foreground">
                    {format(new Date(event.start_time), 'PPPp')}
                  </div>
                  <div className="text-sm">to {format(new Date(event.end_time), 'PPp')}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="font-medium text-card-foreground">{event.location}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <User className="h-5 w-5" />
                <span className="font-medium text-card-foreground">{event.organizer.full_name}</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-3 text-lg font-semibold">About this event</h3>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
          </CardContent>
        </Card>

        {isAuthenticated && !isOrganizer && (
          <Card className="mb-6 shadow-card">
            <CardHeader>
              <CardTitle>RSVP to this event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Select value={rsvpStatus} onValueChange={setRsvpStatus}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select your status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Going">Going</SelectItem>
                    <SelectItem value="Maybe">Maybe</SelectItem>
                    <SelectItem value="Not Going">Not Going</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleRSVP}>Submit RSVP</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isAuthenticated && (
          <Card className="mb-6 shadow-card">
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-colors"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating ? 'fill-warning text-warning' : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Comment</label>
                <Textarea
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleReviewSubmit}>Post Review</Button>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Reviews ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className="text-center text-muted-foreground">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{review.user.full_name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'fill-warning text-warning' : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(review.created_at), 'PPp')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetail;
