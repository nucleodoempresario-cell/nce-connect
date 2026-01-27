import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Target, Eye, Heart, Shield, Network, TrendingUp, Users, Award, 
  Handshake, Star, CheckCircle, Lightbulb, Building2, Briefcase,
  Globe, Phone, Mail, MapPin, Calendar, Clock, Zap, Rocket,
  Trophy, Medal, Crown, Gem, Gift, Sparkles, Sun, Moon
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target, Eye, Heart, Shield, Network, TrendingUp, Users, Award,
  Handshake, Star, CheckCircle, Lightbulb, Building2, Briefcase,
  Globe, Phone, Mail, MapPin, Calendar, Clock, Zap, Rocket,
  Trophy, Medal, Crown, Gem, Gift, Sparkles, Sun, Moon,
};

interface IconSelectorProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconSelector({ value, onChange }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const IconComponent = iconMap[value] || Star;
  
  const filteredIcons = Object.entries(iconMap).filter(([name]) => 
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-3 h-10">
          <IconComponent className="h-5 w-5 text-primary" />
          <span>{value}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="start">
        <div className="pb-2">
          <Input
            placeholder="Buscar ícone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
        <ScrollArea className="h-[200px]">
          <div className="grid grid-cols-5 gap-1">
            {filteredIcons.map(([name, Icon]) => (
              <Button
                key={name}
                variant={value === name ? 'secondary' : 'ghost'}
                size="icon"
                className="h-10 w-10"
                onClick={() => {
                  onChange(name);
                  setIsOpen(false);
                  setSearch('');
                }}
                title={name}
              >
                <Icon className="h-5 w-5" />
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

// Export the iconMap for use in rendering
export { iconMap };
