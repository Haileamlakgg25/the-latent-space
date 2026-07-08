export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: 'Deep Learning' | 'LLMs' | 'Generative AI' | 'Systems Architecture'|'AI Systems';
  readTime: string;
  excerpt: string;
  content: string;
}