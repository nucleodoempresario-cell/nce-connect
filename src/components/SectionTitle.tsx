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
      "mb-16",
      align === 'center' && "text-center",
      className
    )}>
      <div className={cn(
        "h-1.5 w-20 bg-accent rounded-full mb-6",
        align === 'center' && "mx-auto"
      )} />
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed",
          align === 'center' && "mx-auto"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
