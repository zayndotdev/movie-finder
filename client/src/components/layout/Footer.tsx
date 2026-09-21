import { Film, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#1E2A42] bg-[#06080F] py-12 px-4 sm:px-6 text-[#94A3B8] text-xs">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-black">
              <Film className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-base text-[#F8FAFC]">
              Cine<span className="text-amber-400">Match</span>
            </span>
          </div>
          <p className="max-w-sm text-xs text-[#64748B] leading-relaxed">
            AI-powered cinematic & television discovery agent for Bollywood, Hollywood, and global uncensored cinema.
          </p>
        </div>

        {/* Attribution & Disclaimers */}
        <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right max-w-md">
          <div className="flex items-center gap-4 text-xs font-semibold text-[#F8FAFC]">
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
            >
              TMDB Database <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://www.justwatch.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors inline-flex items-center gap-1"
            >
              JustWatch Streams <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-[11px] text-[#64748B]">
            This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability provided by JustWatch.
          </p>
          <p className="text-[11px] text-[#64748B]">
            © {new Date().getFullYear()} CineMatch Entertainment. Built for global film and television lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
