interface HeaderProps {
  totalPosts: number;
}

export default function BlogHeader({ totalPosts }: HeaderProps) {
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
          <span className="font-bold tracking-tight text-white text-lg">
            the.<span className="text-indigo-400">latent.space</span>
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            Total Logs: <strong className="text-white">{totalPosts}</strong>
          </span>
        </div>
      </div>
    </nav>
  );
}
