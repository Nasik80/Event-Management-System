import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Star, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-hero py-24 text-center">
        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/10 backdrop-blur-sm">
            <Calendar className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mb-6 text-5xl font-bold text-primary-foreground md:text-6xl">
            Welcome to EventHub
          </h1>
          <p className="mb-8 text-xl text-primary-foreground/90 md:text-2xl">
            Discover, create, and manage amazing events in your community
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/events">
              <Button size="lg" variant="secondary" className="shadow-lg">
                Browse Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" className="bg-primary-foreground text-primary shadow-lg hover:bg-primary-foreground/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Discover Events</h3>
              <p className="text-muted-foreground">
                Find exciting events happening in your area and beyond
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Connect with Others</h3>
              <p className="text-muted-foreground">
                RSVP to events and meet like-minded people in your community
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
                <Star className="h-8 w-8 text-warning" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Share Feedback</h3>
              <p className="text-muted-foreground">
                Rate and review events to help others make informed decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to Create Your Own Event?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join our community of organizers and bring people together
          </p>
          <Link to="/register">
            <Button size="lg">Sign Up Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
