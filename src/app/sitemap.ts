import { getAllPrompts } from '@/lib/mdx';

const baseUrl = 'https://tinyops.vercel.app';

export default async function sitemap() {
  const prompts = getAllPrompts();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  // Dynamic prompt pages
  const promptPages = prompts.map((prompt) => ({
    url: `${baseUrl}/prompt/${prompt.slug}`,
    lastModified: new Date(prompt.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...promptPages];
}