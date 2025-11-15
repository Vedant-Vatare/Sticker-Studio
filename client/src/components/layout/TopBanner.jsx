import { useState } from 'react';
import { X } from 'lucide-react';
import { TextLoop } from '@/components/ui/text-loop';

export function TextLoopBasic() {
  return (
    <TextLoop className="font-mono text-sm" interval={4}>
      <span>Diwali Sale is Live! Grab limited time offer!</span>
      <span>20% off on the first purchase!</span>
      <span>Free shipping on orders above Rs.999</span>
    </TextLoop>
  );
}

export default function TopBanner() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      style={{ background: 'var(--gradient-accent)' }}
      className={`font-heading font-base relative z-999 overflow-hidden text-center text-xs font-medium tracking-wide text-white transition-all duration-500 ease-in-out ${
        isCollapsed ? 'h-0 p-0' : 'h-auto p-2'
      }`}
    >
      <TextLoopBasic />
      <button
        onClick={() => setIsCollapsed(true)}
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-white/20"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
