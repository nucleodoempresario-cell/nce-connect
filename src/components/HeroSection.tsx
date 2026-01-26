import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  backgroundImage: string;
  overlayColor?: 'blue' | 'dark';
  children: ReactNode;
  className?: string;
  minHeight?: string;
}

export function HeroSection({ 
  backgroundImage, 
  overlayColor = 'blue',
  children, 
  className,
  minHeight = 'min-h-[70vh]'
}: HeroSectionProps) {
  const overlayClasses = {
    blue: 'bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70',
    dark: 'bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-900/80',
  };

  return (
    <section className={cn("relative overflow-hidden", minHeight, className)}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Overlay */}
      <div className={cn("absolute inset-0", overlayClasses[overlayColor])} />
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-1/4 -left-32 w-64 h-64 bg-accent/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      {/* Content */}
      <div className="relative z-10 container h-full flex items-center">
        {children}
      </div>
    </section>
  );
}
