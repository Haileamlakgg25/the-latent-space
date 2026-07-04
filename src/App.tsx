import { useState } from 'react';
import BlogHeader from './components/BlogHeader';
import PostCard from './components/PostCard';
import { initialPosts } from './data/initialPosts';
import type { BlogPost } from './types/blog';

export default function App() {
  const [posts] = useState<BlogPost[]>(initialPosts);
  const [activeTaxonomy, setActiveTaxonomy] = useState<string>('All');

  // Filter posts based on clean technical taxonomy selection
  const filteredPosts = activeTaxonomy === 'All'
    ? posts
    : posts.filter(p => p.category === activeTaxonomy);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 pb-24 relative overflow-x-hidden">
      {/* Premium ambient depth light fields */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <BlogHeader totalPosts={filteredPosts.length} />

      {/* Main Grid Layout: Two columns for high-end desktop structure */}
      <main className="max-w-5xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Authority Profile & Taxonomy Sorting */}
        <div className="space-y-8 lg:sticky lg:top-28 lg:h-fit">
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              The Latent Space
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              An independent engineering ledger documenting high-dimensional vector mappings, deep learning mechanics, transformer scaling, and structural cognitive neuroscience.
            </p>
          </header>

          {/* Core Technical Taxonomy Filtering Panel */}
          <div className="border border-slate-900 bg-slate-900/10 rounded-xl p-4 space-y-2.5">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-1">
              Research Domains
            </h3>
            <div className="flex flex-col gap-1 text-xs font-medium">
              {['All', 'Deep Learning', 'LLMs', 'Generative AI', 'Systems Architecture'].map((domain) => (
                <button
                  key={domain}
                  onClick={() => setActiveTaxonomy(domain)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                    activeTaxonomy === domain 
                      ? 'bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                  }`}
                >
                  <span>{domain === 'All' ? '⚡ All Technical Dispatches' : domain}</span>
                  {activeTaxonomy === domain && <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Professional Credentials Card */}
          <div className="p-4 rounded-xl border border-slate-900/60 bg-slate-900/5 text-[11px] text-slate-500 space-y-2">
            <p><strong>Operator:</strong> Computer Engineering & AI Sandbox</p>
            <p><strong>Environment:</strong> Local Matrix Inferences</p>
            <p><strong>Framework:</strong> React TypeScript + Tailwind v4 CDNs</p>
          </div>
        </div>

        {/* RIGHT COLUMN: The Clean, Monolithic Editorial Post Stream */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              {activeTaxonomy} Stream Queue
            </h3>
            <span className="text-[10px] text-slate-600 font-mono">SYS_STATUS: VERIFIED</span>
          </div>

          <div className="space-y-8">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-900 rounded-2xl bg-slate-950/40">
                <p className="text-xs text-slate-500">No computational dispatches mapped to this layer yet.</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}