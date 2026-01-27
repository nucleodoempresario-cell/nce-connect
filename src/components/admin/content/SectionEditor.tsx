import { ReactNode, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Save, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionEditorProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  isLoading?: boolean;
  isSaving?: boolean;
  hasChanges?: boolean;
  onSave?: () => void;
  defaultOpen?: boolean;
}

export function SectionEditor({
  title,
  icon,
  children,
  isLoading,
  isSaving,
  hasChanges,
  onSave,
  defaultOpen = false,
}: SectionEditorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (showSaved) {
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSaved]);

  const handleSave = () => {
    onSave?.();
    setShowSaved(true);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg">
            <span className="text-primary">{icon}</span>
            {title}
            {hasChanges && !showSaved && (
              <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                Alterado
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isOpen && onSave && (
              <Button 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                disabled={isSaving || !hasChanges}
                className="h-8"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : showSaved ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                {showSaved ? 'Salvo!' : 'Salvar'}
              </Button>
            )}
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <CardContent className="pt-0 pb-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            children
          )}
        </CardContent>
      </div>
    </Card>
  );
}
