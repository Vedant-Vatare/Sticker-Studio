import {
  CircleCheckIcon,
  InfoIcon,
  CircleXIcon,
  Loader2Icon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-6" color="white" fill="#10b981" />
        ),
        info: <InfoIcon className="size-5" />,
        warning: (
          <TriangleAlertIcon className="size-4" fill="#f59e0b" color="white" />
        ),
        error: <CircleXIcon className="size-6" color="white" fill="#ef4444" />,
        loading: <Loader2Icon className="size-6 animate-spin" />,
      }}
      style={{
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
        '--border-radius': 'var(--radius)',
      }}
      {...props}
    />
  );
};

export { Toaster };
