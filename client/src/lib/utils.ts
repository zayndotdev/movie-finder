import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function buildImageUrl(
  path: string | null | undefined,
  size: 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'h632' | 'original' | string = 'w500',
  type: 'poster' | 'backdrop' | 'profile' = 'poster'
): string {
  if (!path) {
    return `/placeholders/${type}-fallback.svg`;
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return 'N/A';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins > 0 ? `${mins}m` : ''}`;
  }
  return `${mins}m`;
}

export function formatYear(dateString: string | null | undefined): string {
  if (!dateString) return '';
  return dateString.slice(0, 4);
}
