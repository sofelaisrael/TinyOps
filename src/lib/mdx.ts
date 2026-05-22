import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const promptsDirectory = path.join(process.cwd(), 'content/prompts');

export type SourceLink = {
  title: string;
  type: 'stackoverflow' | 'github' | 'devto';
  url: string;
  votes?: number;
  stars?: number;
  reactions?: number;
  repo?: string;
  author?: string;
};

export type Prompt = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  content: string;
  files: string[];
  secrets: string[];
  repoExample?: string;
  repoUrl?: string;
  searchTerms?: string;
  sources?: SourceLink[];
};

export function getAllPrompts(): Prompt[] {
  try {
    if (!fs.existsSync(promptsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(promptsDirectory);

    const allPrompts = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        try {
          const slug = fileName.replace(/\.mdx$/, '');
          const fullPath = path.join(promptsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');

          const { data, content } = matter(fileContents);

          const prompt: Prompt = {
            slug,
            title: data.title,
            description: data.description,
            category: data.category,
            tags: data.tags || [],
            date: data.date,
            content,
            files: data.files || [],
            secrets: data.secrets || [],
          };
          if (data.repoExample) prompt.repoExample = data.repoExample;
          if (data.repoUrl) prompt.repoUrl = data.repoUrl;
          if (data.searchTerms) prompt.searchTerms = data.searchTerms;
          if (data.sources) prompt.sources = data.sources;
          return prompt;
        } catch (e) {
          console.error(`Failed to parse ${fileName}:`, e);
          return null;
        }
      })
      .filter((p): p is Prompt => p !== null);

    return allPrompts.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (e) {
    console.error('Failed to read prompts directory:', e);
    return [];
  }
}
