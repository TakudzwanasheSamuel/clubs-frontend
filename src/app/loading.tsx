import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]"> {/* Adjust min-h based on header height */}
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
