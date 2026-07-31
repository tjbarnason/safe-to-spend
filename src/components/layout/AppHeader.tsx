import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900">
      <div className="mx-auto flex h-14 max-w-[420px] items-center justify-between px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 text-white"
            >
              <path d="M3 21h18" />
              <path d="M5 21V7l7-4 7 4v14" />
              <path d="M9 21v-4h6v4" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white">
            Community First CU
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-sm text-slate-300 hover:bg-slate-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-400">
            SM
          </div>
        </div>
      </div>
    </header>
  );
}
