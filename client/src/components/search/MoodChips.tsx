import { cn } from '../../lib/utils';

export interface MoodChipItem {
  id: string;
  emoji: string;
  label: string;
  prompt: string;
  color: string;
}

export const PRESET_MOODS: MoodChipItem[] = [
  { id: 'happy', emoji: '😊', label: 'Feel-Good & Uplifting', prompt: 'Wholesome, feel-good movie or show that makes me laugh and smile', color: 'hover:border-amber-400 hover:text-amber-300' },
  { id: 'thrilling', emoji: '💀', label: 'Edge-of-Seat Thriller', prompt: 'High-tension suspenseful thriller with huge plot twists', color: 'hover:border-purple-400 hover:text-purple-300' },
  { id: 'romantic', emoji: '❤️', label: 'Heartfelt Romance', prompt: 'Intense chemistry, romantic connection, and poignant love story', color: 'hover:border-rose-400 hover:text-rose-300' },
  { id: 'mindbending', emoji: '🧠', label: 'Mind-Bending Sci-Fi', prompt: 'Philosophical, reality-warping sci-fi like Inception or Dark', color: 'hover:border-cyan-400 hover:text-cyan-300' },
  { id: 'sad', emoji: '😢', label: 'Emotional & Moving', prompt: 'Deep emotional tearjerker drama with powerful performances', color: 'hover:border-blue-400 hover:text-blue-300' },
  { id: 'adventure', emoji: '⚔️', label: 'Epic Adventure', prompt: 'Grand cinematic scale, heroic journey, and spectacle', color: 'hover:border-emerald-400 hover:text-emerald-300' },
  { id: 'bollywood', emoji: '🪕', label: 'Bollywood Magic', prompt: 'Iconic Bollywood blockbuster with unforgettable music and heart', color: 'hover:border-orange-400 hover:text-orange-300' },
  { id: 'anime', emoji: '🎌', label: 'Japanese Anime Hits', prompt: 'Critically acclaimed Japanese anime series or film', color: 'hover:border-red-400 hover:text-red-300' }
];

export function MoodChips({
  onSelectMood,
  selectedMoodId
}: {
  onSelectMood: (mood: MoodChipItem) => void;
  selectedMoodId?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center justify-center">
      {PRESET_MOODS.map((mood) => {
        const isSelected = selectedMoodId === mood.id;
        return (
          <button
            key={mood.id}
            type="button"
            onClick={() => onSelectMood(mood)}
            className={cn(
              'group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-200 cursor-pointer shadow-sm active:scale-95',
              isSelected
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-amber-500/20'
                : 'bg-[#111828]/80 backdrop-blur-md text-[#94A3B8] border-[#1E2A42] hover:bg-[#172035]',
              mood.color
            )}
          >
            <span className="text-base sm:text-lg transition-transform group-hover:scale-125 duration-200">
              {mood.emoji}
            </span>
            <span>{mood.label}</span>
          </button>
        );
      })}
    </div>
  );
}
