import { UnifiedMediaItem } from '../types/api';

export interface AdultCertificationRule {
  country: string;
  certifications: string[];
}

export const ADULT_CERTIFICATIONS: AdultCertificationRule[] = [
  { country: 'US', certifications: ['NC-17', 'NR', 'Unrated'] },
  { country: 'GB', certifications: ['18', 'R18'] },
  { country: 'JP', certifications: ['R18+'] },
  { country: 'FR', certifications: ['18', '-18', 'X'] },
  { country: 'IN', certifications: ['A'] },
  { country: 'KR', certifications: ['18', '19', 'Restricted'] }
];

export const ADULT_KEYWORDS = [
  'erotic',
  'uncensored',
  'sensual',
  'nudity',
  'adult animation',
  'pink film',
  'explicit',
  'passion'
];

export function isExplicitlyAdult(item: UnifiedMediaItem & { certification?: string }): boolean {
  if (item.adult) return true;
  if (item.certification) {
    const cert = item.certification.toUpperCase();
    if (['NC-17', '18+', 'R18+', 'R-18', '18', 'A', '19', 'X', '-18'].includes(cert)) {
      return true;
    }
  }
  const text = `${item.title} ${item.overview}`.toLowerCase();
  return ADULT_KEYWORDS.some(k => text.includes(k));
}

export function filterAdultContent<T extends UnifiedMediaItem>(items: T[], adultMode: boolean): T[] {
  if (adultMode) {
    // Show ONLY adult / mature / uncensored content
    return items.filter(item => isExplicitlyAdult(item));
  } else {
    // Strictly EXCLUDE any adult or uncensored content
    return items.filter(item => !item.adult && !isExplicitlyAdult(item));
  }
}
