import { useState, type FormEvent } from 'react';
import type { BlogPost } from '../types/blog';

interface WritePanelProps {
  onPublish: (post: Omit<BlogPost, 'id' | 'date' | 'slug' | 'readTime'>) => void;
}

export default function WritePanel({ onPublish }: WritePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('Deep Learning');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    onPublish({ title, category, excerpt, content });

    setTitle('');
    setExcerpt('');
    setContent('');
    setIsOpen(false);
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden transition-all duration-300">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-900/40 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span>✍️</span> Open Tech Log Composer
        </span>
        <span className={`text-xs text-indigo-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="p-6 border-t border-slate-900 space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Post Title</label>
            <input 
              type="text" required placeholder="e.g., Training Mechanics of Feed-Forward Layers"
              value={title} onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Category Stack</label>
              <select 
                value={category} onChange={e => setCategory(e.target.value as BlogPost['category'])}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="Deep Learning">Deep Learning</option>
                <option value="LLMs">LLMs</option>
                <option value="Generative AI">Generative AI</option>
                <option value="Systems Architecture">Systems Architecture</option>
                <option value="AI Systems">AI Systems</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Short Summary (Excerpt)</label>
              <input 
                type="text" placeholder="Brief outline of the technical thesis..."
                value={excerpt} onChange={e => setExcerpt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Body Markdown Content</label>
            <textarea 
              rows={6} required placeholder="Write your full technical article text here..."
              value={content} onChange={e => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/10">
              Commit Entry to Feed
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
