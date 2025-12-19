import { cn } from '@/lib/utils';

const LoadingDots = ({ color = 'bg-white' }) => {
  return (
    <div className="flex gap-2">
      <span
        style={{ animationDuration: '750ms' }}
        className={`delay-75" h-2.5 w-2.5 animate-pulse rounded-full ${color}`}
      ></span>
      <span
        style={{ animationDuration: '750ms' }}
        className={`h-2.5 w-2.5 animate-pulse rounded-full delay-100 duration-200 ${color}`}
      ></span>
      <span
        style={{ animationDuration: '750ms' }}
        className={`duration-200" h-2.5 w-2.5 animate-pulse rounded-full ${color}`}
      ></span>
    </div>
  );
};

export default LoadingDots;
