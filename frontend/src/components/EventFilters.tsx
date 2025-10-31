import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface EventFiltersProps {
  filters: {
    title: string;
    location: string;
    organizer: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const EventFilters = ({ filters, onFilterChange, onClearFilters }: EventFiltersProps) => {
  const hasActiveFilters = filters.title || filters.location || filters.organizer;

  return (
    <div className="rounded-lg border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Search className="h-5 w-5" />
          Filter Events
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium">Title</label>
          <Input
            placeholder="Search by title..."
            value={filters.title}
            onChange={(e) => onFilterChange('title', e.target.value)}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Location</label>
          <Input
            placeholder="Search by location..."
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Organizer</label>
          <Input
            placeholder="Search by organizer..."
            value={filters.organizer}
            onChange={(e) => onFilterChange('organizer', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
