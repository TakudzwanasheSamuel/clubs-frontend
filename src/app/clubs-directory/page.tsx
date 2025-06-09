
"use client";

import { useState, useEffect } from 'react';
import { ClubCard } from '@/components/clubs/club-card';
import { ClubFilters } from '@/components/clubs/club-filters';
import { mockClubs, clubCategories } from '@/lib/mock-data';
import type { Club } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Users, Search } from 'lucide-react';

export default function ClubDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Initialize with all clubs. If mockClubs is empty, this will result in "No Clubs Found" if not handled by loading state.
  const [filteredClubs, setFilteredClubs] = useState<Club[]>(mockClubs); 

  useEffect(() => {
    let clubsToDisplay = mockClubs;

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase().trim();
      clubsToDisplay = clubsToDisplay.filter(club =>
        club.name.toLowerCase().includes(lowerSearchTerm) ||
        club.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    if (selectedCategory !== 'all') {
      clubsToDisplay = clubsToDisplay.filter(club => club.category.id === selectedCategory);
    }
    
    setFilteredClubs(clubsToDisplay);
  }, [searchTerm, selectedCategory]); // mockClubs is stable, not needed as dependency here

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
            <Users className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Club Directory</h1>
        </div>
        <Button asChild variant="default">
          <Link href="/clubs/create">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Club
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground mb-6">
        Discover and join various clubs on campus. Find your community!
      </p>

      <ClubFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={clubCategories}
      />

      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card shadow-lg rounded-lg mt-8">
          <Search className="mx-auto h-16 w-16 text-muted-foreground mb-5" />
          <h2 className="text-2xl font-semibold text-foreground mb-3">No Clubs Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't find any clubs matching your current search term or category filter. Try broadening your search!
          </p>
        </div>
      )}
    </div>
  );
}
