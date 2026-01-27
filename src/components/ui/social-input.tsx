import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SocialPlatform = 'instagram' | 'linkedin' | 'facebook' | 'twitter';

interface SocialInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  platform: SocialPlatform;
  value: string;
  onChange: (value: string) => void;
}

const PLATFORM_CONFIG: Record<SocialPlatform, { placeholder: string; prefix: string }> = {
  instagram: { placeholder: '@usuario ou link completo', prefix: 'instagram.com/' },
  linkedin: { placeholder: '@usuario ou link completo', prefix: 'linkedin.com/in/' },
  facebook: { placeholder: '@usuario ou link completo', prefix: 'facebook.com/' },
  twitter: { placeholder: '@usuario ou link completo', prefix: 'twitter.com/' }
};

const SocialInput = React.forwardRef<HTMLInputElement, SocialInputProps>(
  ({ className, platform, value, onChange, placeholder, ...props }, ref) => {
    const config = PLATFORM_CONFIG[platform];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          className={cn("pl-3", className)}
          value={value}
          onChange={handleChange}
          placeholder={placeholder || config.placeholder}
          {...props}
        />
      </div>
    );
  }
);

SocialInput.displayName = "SocialInput";

export { SocialInput };
