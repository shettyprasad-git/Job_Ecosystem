'use client';

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FiltersState = {
  keyword: string;
  location: string;
  mode: string;
  experience: string;
  source: string;
  sortBy: string;
}

type FilterBarProps = {
  filters: FiltersState;
  setFilters: (updateFn: (prev: FiltersState) => FiltersState) => void;
  uniqueValues: {
    locations: string[];
    experiences: string[];
    modes: string[];
    sources: string[];
  };
};

export function FilterBar({ filters, setFilters, uniqueValues }: FilterBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilters((prev) => ({ ...prev, keyword: value }));
  };

  const handleSelectChange = (name: keyof FiltersState) => (value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value === 'all' ? '' : value }));
  };

  return (
    <div className="mb-8 p-4 border rounded-lg bg-card shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Keyword Search */}
        <div className="xl:col-span-2">
          <Input
            placeholder="Search by title, company, skill..."
            value={filters.keyword}
            onChange={handleInputChange}
            className="h-12 text-base"
          />
        </div>

        {/* Location Dropdown */}
        <Select value={filters.location} onValueChange={handleSelectChange('location')}>
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {uniqueValues.locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Mode Dropdown */}
        <Select value={filters.mode} onValueChange={handleSelectChange('mode')}>
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
             {uniqueValues.modes.map(mode => <SelectItem key={mode} value={mode}>{mode}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Experience Dropdown */}
        <Select value={filters.experience} onValueChange={handleSelectChange('experience')}>
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {uniqueValues.experiences.map(exp => <SelectItem key={exp} value={exp}>{exp}</SelectItem>)}
          </SelectContent>
        </Select>
        
        {/* Source Dropdown */}
        <Select value={filters.source} onValueChange={handleSelectChange('source')}>
            <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {uniqueValues.sources.map(source => <SelectItem key={source} value={source}>{source}</SelectItem>)}
            </SelectContent>
        </Select>
        
        {/* Sort Dropdown */}
        <Select value={filters.sortBy} onValueChange={handleSelectChange('sortBy')}>
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">
                Latest
            </SelectItem>
            <SelectItem value="oldest">
                Oldest
            </SelectItem>
          </SelectContent>
        </Select>

      </div>
    </div>
  );
}
