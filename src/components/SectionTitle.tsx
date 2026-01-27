import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionTitle({ 
  title, 
  subtitle, 
  className,
  align = 'center',
}: SectionTitleProps) {
  return (
    <div className={cn(
      "mb-12",
      align === 'center' && "text-center",
      className
    )}>
      <div className={cn(
        "h-1 w-16 bg-accent rounded-full mb-4",
        align === 'center' && "mx-auto"
      )} />
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-lg text-muted-foreground max-w-2xl",
          align === 'center' && "mx-auto"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
