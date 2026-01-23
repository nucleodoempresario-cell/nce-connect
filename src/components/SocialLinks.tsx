import { Facebook, Instagram, Linkedin, Twitter, Globe, Youtube } from 'lucide-react';

interface SocialLinksProps {
  links: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const buttonSizes = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5',
};

export function SocialLinks({ links, size = 'md' }: SocialLinksProps) {
  const iconSize = iconSizes[size];
  const buttonSize = buttonSizes[size];

  const socialIcons = [
    { key: 'facebook', icon: Facebook, url: links.facebook },
    { key: 'instagram', icon: Instagram, url: links.instagram },
    { key: 'linkedin', icon: Linkedin, url: links.linkedin },
    { key: 'twitter', icon: Twitter, url: links.twitter },
    { key: 'youtube', icon: Youtube, url: links.youtube },
    { key: 'website', icon: Globe, url: links.website },
  ].filter(item => item.url);

  if (socialIcons.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {socialIcons.map(({ key, icon: Icon, url }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonSize} rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors`}
          aria-label={key}
        >
          <Icon className={iconSize} />
        </a>
      ))}
    </div>
  );
}
