import React from 'react';
import { Loader2, LucideIcon } from 'lucide-react';
import { Button, ButtonProps } from './button';

type LoaderButtonProps = ButtonProps & {
  isLoading?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
};

export const LoaderButton = React.forwardRef<HTMLButtonElement, LoaderButtonProps>(
  ({ isLoading, icon: Icon, children, ...props }, ref) => {
    return (
      <Button ref={ref} disabled={isLoading} {...props}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : Icon ? (
          <>
            <Icon size={18} className="mr-3" />
            {children}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

LoaderButton.displayName = 'LoaderButton'; 