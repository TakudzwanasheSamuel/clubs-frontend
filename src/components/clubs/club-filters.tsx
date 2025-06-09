
'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import type { ClubCategory } from '@/types';

type ClubFiltersProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  categories: ClubCategory[];
};

export function ClubFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories
}: ClubFiltersProps) {

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  return (
    <div className="mb-6 p-4 bg-card rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <label htmlFor="search-clubs" className="block text-sm font-medium text-foreground mb-1">
            Search Clubs
          </label>
          <div className="relative">
            <Input
              id="search-clubs"
              type="text"
              placeholder="Search by name or description..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <div>
          <label htmlFor="filter-category" className="block text-sm font-medium text-foreground mb-1">
            Filter by Category
          </label>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger id="filter-category" className="w-full">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <SelectValue placeholder="All Categories" className="pl-5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {(searchTerm || selectedCategory !== "all") && (
            <Button variant="outline" onClick={handleClearFilters} className="w-full md:w-auto md:col-start-3">
                <X className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
        )}
      </div>
    </div>
  );
}
