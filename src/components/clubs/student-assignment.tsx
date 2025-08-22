"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  registrationNumber?: string;
  profilePictureUrl?: string;
}

interface StudentAssignmentProps {
  clubId: string;
  clubName: string;
  onAssignmentComplete: () => void;
}

export function StudentAssignment({ clubId, clubName, onAssignmentComplete }: StudentAssignmentProps) {
  const { toast } = useToast();
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [assignmentComplete, setAssignmentComplete] = useState(false);

  const searchStudents = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&role=student`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to search students');
      }

      const students = await response.json();
      setSearchResults(students);
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Could not search for students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search as user types
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchStudents(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const assignStudent = async (student: Student) => {
    setIsAssigning(true);
    try {
      const response = await fetch('/api/clubs/assign-leader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clubId,
          studentId: student.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign student');
      }

      const result = await response.json();
      
      toast({
        title: "Leader Assigned!",
        description: `${student.firstName} ${student.lastName} is now the club leader for ${clubName}`,
      });

      setSelectedStudent(student);
      setAssignmentComplete(true);
      
      // Call the callback after a delay
      setTimeout(() => {
        onAssignmentComplete();
      }, 2000);

    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };



  if (assignmentComplete && selectedStudent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-green-800 mb-2">Club Leader Assigned!</h3>
          <p className="text-sm text-green-700 mb-4">
            <strong>{selectedStudent.firstName} {selectedStudent.lastName}</strong> is now the leader of <strong>{clubName}</strong>.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-green-300 rounded-lg p-4">
      <h4 className="font-medium text-green-800 mb-2">Assign Club Leader</h4>
      <p className="text-sm text-green-700 mb-4">
        Search for a student to assign as the club leader for <strong>{clubName}</strong>:
      </p>
      
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Input
            placeholder="Search students by name, email, or registration number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 pr-10"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Start typing to search. Results will appear automatically.
        </p>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">Search Results:</h5>
          {searchResults.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={student.profilePictureUrl} />
                  <AvatarFallback>
                    {student.firstName[0]}{student.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {student.email} • {student.registrationNumber || 'No Reg Number'}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => assignStudent(student)}
                disabled={isAssigning}
                size="sm"
                className="flex items-center space-x-1"
              >
                {isAssigning ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <UserPlus className="h-3 w-3" />
                )}
                <span>Assign</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="text-center py-4 text-sm text-gray-500">
          No students found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
