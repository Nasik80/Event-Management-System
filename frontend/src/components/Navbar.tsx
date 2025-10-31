import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, Plus, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b bg-card shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Calendar className="h-6 w-6" />
            EventHub
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/events">
              <Button variant="ghost">Events</Button>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/my-events">
                  <Button variant="ghost">
                    <User className="mr-2 h-4 w-4" />
                    My Events
                  </Button>
                </Link>
                <Link to="/events/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
