import { NextResponse } from 'next/server';
import { parseGitHubUrl, getAuditFiles } from '@/lib/github';
import { runAudit } from '@/lib/audit';

// ─── Request / Response Types ────────────────────────────────────────────────

interface AuditRequestBody {
  repoUrl?: string;
}

interface AuditSuccessResponse {
  success: true;
  repo: {
    owner: string;
    repo: string;
    url: string;
  };
  audit: {
    score: number;
    maxScore: number;
    grade: string;
    categories: ReturnType<typeof runAudit>['categories'];
    recommendations: string[];
  };
}

interface AuditErrorResponse {
  success: false;
  error: string;
}

// ─── POST Handler ────────────────────────────────────────────────────────────

export async function POST(req: Request): Promise<
  NextResponse<AuditSuccessResponse | AuditErrorResponse>
> {
  try {
    // 1. Parse request body
    let body: AuditRequestBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    // 2. Validate repoUrl
    if (!body.repoUrl || typeof body.repoUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'repoUrl is required' },
        { status: 400 },
      );
    }

    // 3. Parse GitHub URL
    const parsed = parseGitHubUrl(body.repoUrl);
    if (!parsed) {
      return NextResponse.json(
        { success: false, error: 'Invalid GitHub URL format' },
        { status: 400 },
      );
    }

    const { owner, repo } = parsed;

    // 4. Fetch files from GitHub
    let files;
    try {
      files = await getAuditFiles(owner, repo);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);

      console.error(`[audit] GitHub fetch error for ${owner}/${repo}:`, message);

      if (message.includes('not found')) {
        return NextResponse.json(
          { success: false, error: 'Repository not found' },
          { status: 404 },
        );
      }

      if (message.includes('rate limit')) {
        return NextResponse.json(
          { success: false, error: 'GitHub API rate limit exceeded' },
          { status: 429 },
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to fetch repository' },
        { status: 500 },
      );
    }

    // 5. Run audit
    let audit;
    try {
      audit = runAudit(files);
    } catch (err) {
      console.error(`[audit] Audit engine error for ${owner}/${repo}:`, err);
      return NextResponse.json(
        { success: false, error: 'Failed to run audit' },
        { status: 500 },
      );
    }

    // 6. Return report
    return NextResponse.json({
      success: true,
      repo: {
        owner,
        repo,
        url: body.repoUrl.trim(),
      },
      audit: {
        score: audit.score,
        maxScore: audit.maxScore,
        grade: audit.grade,
        categories: audit.categories,
        recommendations: audit.recommendations,
      },
    });
  } catch (err) {
    // Catch-all for unexpected errors
    console.error('[audit] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to run audit' },
      { status: 500 },
    );
  }
}
