/**
 * Normalizes social media links to full URLs
 * Supports input as: @username, username, or full URL
 */

const SOCIAL_PATTERNS: Record<string, { baseUrl: string; prefixes: string[] }> = {
  instagram: {
    baseUrl: 'https://www.instagram.com/',
    prefixes: ['instagram.com', 'www.instagram.com', 'http://instagram.com', 'https://instagram.com', 'http://www.instagram.com', 'https://www.instagram.com']
  },
  linkedin: {
    baseUrl: 'https://www.linkedin.com/in/',
    prefixes: ['linkedin.com', 'www.linkedin.com', 'http://linkedin.com', 'https://linkedin.com', 'http://www.linkedin.com', 'https://www.linkedin.com']
  },
  facebook: {
    baseUrl: 'https://www.facebook.com/',
    prefixes: ['facebook.com', 'www.facebook.com', 'http://facebook.com', 'https://facebook.com', 'http://www.facebook.com', 'https://www.facebook.com']
  },
  twitter: {
    baseUrl: 'https://twitter.com/',
    prefixes: ['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com']
  }
};

/**
 * Normalize a social media link to a full URL
 * @param input - User input (can be @username, username, or full URL)
 * @param platform - Social media platform (instagram, linkedin, facebook, twitter)
 * @returns Normalized full URL or empty string if input is empty
 */
export function normalizeSocialLink(input: string, platform: keyof typeof SOCIAL_PATTERNS): string {
  if (!input || !input.trim()) return '';
  
  const cleaned = input.trim();
  const pattern = SOCIAL_PATTERNS[platform];
  
  if (!pattern) return cleaned;
  
  // If it's already a full URL for this platform, return as-is
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned;
  }
  
  // Remove @ prefix if present
  const username = cleaned.replace(/^@/, '');
  
  // Build full URL
  return `${pattern.baseUrl}${username}`;
}

/**
 * Extract username from a social media URL or input
 * @param input - Full URL or username
 * @param platform - Social media platform
 * @returns Just the username (without @ or URL parts)
 */
export function extractUsername(input: string, platform: keyof typeof SOCIAL_PATTERNS): string {
  if (!input || !input.trim()) return '';
  
  let cleaned = input.trim();
  const pattern = SOCIAL_PATTERNS[platform];
  
  if (!pattern) return cleaned;
  
  // Remove protocol
  cleaned = cleaned.replace(/^https?:\/\//, '');
  
  // Remove common prefixes
  for (const prefix of pattern.prefixes) {
    if (cleaned.toLowerCase().startsWith(prefix.replace(/^https?:\/\//, '') + '/')) {
      cleaned = cleaned.slice(prefix.replace(/^https?:\/\//, '').length + 1);
      break;
    }
  }
  
  // Remove @ prefix and trailing slashes
  return cleaned.replace(/^@/, '').replace(/\/$/, '');
}

/**
 * Get display-friendly version of social link
 * Shows @username format for display
 */
export function getDisplaySocialLink(input: string, platform: keyof typeof SOCIAL_PATTERNS): string {
  const username = extractUsername(input, platform);
  return username ? `@${username}` : '';
}

/**
 * Normalize all social links in an object
 */
export function normalizeAllSocialLinks(links: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(links)) {
    if (key in SOCIAL_PATTERNS) {
      result[key] = normalizeSocialLink(value, key as keyof typeof SOCIAL_PATTERNS);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}
