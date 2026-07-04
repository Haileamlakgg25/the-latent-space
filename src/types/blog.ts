export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: 'Deep Learning' | 'LLMs' | 'Generative AI' | 'Systems Architecture';
  readTime: string;
  excerpt: string;
  content: string;
}
