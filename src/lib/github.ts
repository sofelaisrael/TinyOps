/**
 * TinyOps Pro — GitHub API Client
 *
 * Fetches repo file trees and contents for auditing.
 * Uses the GitHub REST API v3 with optional token auth.
 */

import { type RepoFile } from "./audit";

// ─── Types ───────────────────────────────────────────────────────────────────

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: string;
  size?: number;
  sha: string;
}

interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

interface GitHubContentResponse {
  name: string;
  path: string;
  content: string;
  encoding: string;
  size: number;
  sha: string;
  url: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GITHUB_API_BASE = "https://api.github.com";
const MAX_FILE_SIZE = 1_048_576; // 1MB in bytes

/** File patterns relevant to DevOps auditing. */
const AUDIT_FILE_PATTERNS: RegExp[] = [
  /^\.github\/workflows\/.*\.ya?ml$/,
  /\.tf$/,
  /^terraform\/.*\.tf$/,
  /^modules\/.*\.tf$/,
  /(^|\/)Dockerfile$/,
  /\.dockerfile$/,
  /\.dockerignore$/,
  /^\.gitignore$/,
  /^package\.json$/,
  /^requirements\.txt$/,
  /^go\.mod$/,
  /^Cargo\.toml$/,
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build request headers, including auth if GITHUB_TOKEN is set.
 */
function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "TinyOps-Pro-Auditor",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  return headers;
}

/**
 * Make a GET request to the GitHub API.
 * Throws descriptive errors for 404, 403 (rate limit), and network failures.
 */
async function githubFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: getHeaders() });

  if (response.status === 404) {
    throw new Error(`GitHub API: repository or resource not found (${url})`);
  }

  if (response.status === 403) {
    const resetHeader = response.headers.get("x-ratelimit-reset");
    const resetTime = resetHeader
      ? new Date(Number(resetHeader) * 1000).toISOString()
      : "unknown";
    throw new Error(
      `GitHub API rate limit exceeded. Resets at ${resetTime}. ` +
        "Set GITHUB_TOKEN to increase your limit to 5,000 req/hr."
    );
  }

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText} (${url})`
    );
  }

  return response.json() as Promise<T>;
}

/**
 * Check if a file path matches any of the audit-relevant patterns.
 */
function isAuditRelevant(filePath: string): boolean {
  return AUDIT_FILE_PATTERNS.some((pattern) => pattern.test(filePath));
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Parse a GitHub URL into owner and repo name.
 *
 * Supports:
 *   - https://github.com/owner/repo
 *   - github.com/owner/repo
 *   - owner/repo
 *   - with or without trailing slashes, .git suffix, or query params
 *
 * @example
 * parseGitHubUrl("https://github.com/facebook/react")
 * // => { owner: "facebook", repo: "react" }
 *
 * @returns Parsed owner and repo, or null if the input is invalid.
 */
export function parseGitHubUrl(
  url: string
): { owner: string; repo: string } | null {
  const trimmed = url.trim();

  // Strip common prefixes/suffixes
  const cleaned = trimmed
    .replace(/^https?:\/\//, "")
    .replace(/^github\.com\//, "")
    .replace(/\.git$/, "")
    .replace(/\/+$/, "")
    .split("?")[0]; // strip query params

  const parts = cleaned.split("/");

  // Must be exactly owner/repo (2 segments, non-empty)
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null;
  }

  // Basic validation: alphanumeric, hyphens, dots, underscores
  const validName = /^[a-zA-Z0-9._-]+$/;
  if (!validName.test(parts[0]) || !validName.test(parts[1])) {
    return null;
  }

  return { owner: parts[0], repo: parts[1] };
}

/**
 * Fetch the full file tree from a GitHub repo (recursive).
 *
 * Uses the Git Trees API with `recursive=1` to get every file path.
 * Falls back to `main` branch if detection fails.
 *
 * @param owner - Repository owner (user or org)
 * @param repo  - Repository name
 * @returns Array of file paths in the repo
 * @throws On repo not found, rate limiting, or network errors
 */
export async function getRepoFileTree(
  owner: string,
  repo: string
): Promise<string[]> {
  // First, detect the default branch
  const repoUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
  const repoInfo = await githubFetch<{ default_branch: string }>(repoUrl);
  const branch = repoInfo.default_branch || "main";

  // Fetch the recursive tree
  const treeUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const tree = await githubFetch<GitHubTreeResponse>(treeUrl);

  // Filter to only blob (file) entries, skip oversized files
  return tree.tree
    .filter((item) => {
      if (item.type !== "blob") return false;
      if (item.size !== undefined && item.size > MAX_FILE_SIZE) return false;
      return true;
    })
    .map((item) => item.path);
}

/**
 * Fetch the content of a single file from a GitHub repo.
 *
 * @param owner - Repository owner
 * @param repo  - Repository name
 * @param path  - File path within the repo
 * @returns File content as a UTF-8 string, or null if not found / too large
 * @throws On rate limiting or network errors
 */
export async function getFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`;

  try {
    const data = await githubFetch<GitHubContentResponse>(url);

    // Skip files larger than the limit
    if (data.size > MAX_FILE_SIZE) {
      return null;
    }

    // Decode base64 content
    if (data.encoding === "base64") {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }

    // Fallback: return as-is if encoding is unexpected
    return data.content;
  } catch (error) {
    // If the file doesn't exist (404), return null instead of throwing
    if (error instanceof Error && error.message.includes("not found")) {
      return null;
    }
    throw error;
  }
}

/**
 * Fetch all audit-relevant files from a GitHub repo.
 *
 * Only retrieves files that match the audit patterns defined in AUDIT_FILE_PATTERNS.
 * Returns RepoFile[] ready to be passed to runAudit().
 *
 * @param owner - Repository owner
 * @param repo  - Repository name
 * @returns Array of RepoFile objects with path and content
 * @throws On repo not found, rate limiting, or network errors
 */
export async function getAuditFiles(
  owner: string,
  repo: string
): Promise<RepoFile[]> {
  // Get the full file tree
  const allPaths = await getRepoFileTree(owner, repo);

  // Filter to audit-relevant files only
  const relevantPaths = allPaths.filter(isAuditRelevant);

  // Fetch content for each relevant file (sequential to avoid rate limits)
  const files: RepoFile[] = [];

  for (const path of relevantPaths) {
    const content = await getFileContent(owner, repo, path);

    // Skip files that couldn't be fetched (too large, not found, etc.)
    if (content !== null) {
      files.push({ path, content });
    }
  }

  return files;
}
