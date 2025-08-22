
import Image from 'next/image';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 text-xl font-bold ${className}`}>
      <div className="relative">
        <Image 
          src="/logo.png" 
          alt="myCampus Logo" 
          width={40} 
          height={40} 
          className="rounded-full shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-all duration-200 hover:scale-105"
          priority
        />
      </div>
      <span className="text-foreground">myCampus</span>
    </Link>
  );
}
