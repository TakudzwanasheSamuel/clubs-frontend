'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-3xl font-bold text-foreground mb-2">Oops, something went wrong!</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        We're sorry for the inconvenience. An unexpected error occurred. You can try again or contact support if the problem persists.
      </p>
      {error?.digest && (
        <p className="text-xs text-muted-foreground mb-6">Error Digest: {error.digest}</p>
      )}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Try again
      </Button>
       <Button variant="link" className="mt-4 text-primary" onClick={() => window.location.href='/'}>
        Go to Homepage
      </Button>
    </div>
  );
}
