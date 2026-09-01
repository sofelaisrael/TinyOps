/**
 * TinyOps Pro — Audit Rules Engine
 *
 * Checks a GitHub repo's file tree against DevOps best practices
 * and produces a scored, categorised audit report.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

/** A single check within a category. */
export type AuditCheck = {
  id: string;
  name: string;
  description: string;
  points: number;
  check: (files: RepoFile[]) => boolean;
  recommendation: string;
};

/** A category of checks (e.g., "CI/CD Health"). */
export type AuditCategory = {
  id: string;
  name: string;
  icon: string;
  checks: AuditCheck[];
};

/** A single issue found by a failing check. */
export type AuditIssue = {
  checkId: string;
  name: string;
  description: string;
  recommendation: string;
};

/** Result for one category. */
export type CategoryResult = {
  id: string;
  name: string;
  icon: string;
  score: number;
  maxScore: number;
  issues: AuditIssue[];
};

/** The full audit report. */
export type AuditReport = {
  score: number;
  maxScore: number;
  grade: string;
  categories: CategoryResult[];
  recommendations: string[];
};

/** A file from the GitHub repo. */
export type RepoFile = {
  path: string;
  content: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Check whether any file path matches a glob-like pattern. */
function hasFile(files: RepoFile[], pattern: RegExp): boolean {
  return files.some((f) => pattern.test(f.path));
}

/** Check whether any file content matches a regex. */
function contentMatches(files: RepoFile[], pathPattern: RegExp, contentPattern: RegExp): boolean {
  return files.some((f) => pathPattern.test(f.path) && contentPattern.test(f.content));
}

/** Check whether any file matching the path pattern has content matching the pattern. */
function anyContentMatches(files: RepoFile[], contentPattern: RegExp): boolean {
  return files.some((f) => contentPattern.test(f.content));
}

/** Find files whose paths match a given pattern. */
function findFiles(files: RepoFile[], pattern: RegExp): RepoFile[] {
  return files.filter((f) => pattern.test(f.path));
}

// ─── Audit Rules ─────────────────────────────────────────────────────────────

const ciCdCategory: AuditCategory = {
  id: "ci-cd",
  name: "CI/CD Health",
  icon: "🔄",
  checks: [
    {
      id: "has-workflows",
      name: "GitHub Actions Workflows",
      description: "Checks whether the repo has GitHub Actions workflow definitions.",
      points: 20,
      check: (files) => hasFile(files, /\.github\/workflows\//),
      recommendation:
        "Add GitHub Actions workflows in .github/workflows/ to automate your CI/CD pipeline.",
    },
    {
      id: "has-caching",
      name: "Dependency Caching",
      description: "Checks whether any workflow uses actions/cache or setup-node with cache enabled.",
      points: 10,
      check: (files) => {
        const workflowFiles = findFiles(files, /\.github\/workflows\/.*\.(yml|yaml)$/);
        return workflowFiles.some(
          (f) =>
            /uses:\s*actions\/cache@/.test(f.content) ||
            /uses:\s*actions\/setup-node@/.test(f.content) && /cache:\s*['"]?npm['"]?/.test(f.content)
        );
      },
      recommendation:
        "Enable dependency caching in your workflows (actions/cache or setup-node with cache) to speed up builds.",
    },
    {
      id: "has-security-scan",
      name: "Security Scanning",
      description: "Checks whether any workflow runs Trivy, Snyk, or CodeQL.",
      points: 10,
      check: (files) => {
        const workflowFiles = findFiles(files, /\.github\/workflows\/.*\.(yml|yaml)$/);
        return workflowFiles.some(
          (f) =>
            /trivy|snyk|codeql/i.test(f.content)
        );
      },
      recommendation:
        "Add a security scanning step to your CI pipeline (Trivy, Snyk, or CodeQL) to catch vulnerabilities early.",
    },
    {
      id: "has-tests",
      name: "Automated Tests",
      description: "Checks whether any workflow runs a test suite.",
      points: 10,
      check: (files) => {
        const workflowFiles = findFiles(files, /\.github\/workflows\/.*\.(yml|yaml)$/);
        return workflowFiles.some(
          (f) =>
            /npm\s+test|pytest|go\s+test|cargo\s+test/.test(f.content)
        );
      },
      recommendation:
        "Add test execution steps to your CI workflows (npm test, pytest, go test, or cargo test).",
    },
    {
      id: "has-lint",
      name: "Linting",
      description: "Checks whether any workflow runs a linter.",
      points: 5,
      check: (files) => {
        const workflowFiles = findFiles(files, /\.github\/workflows\/.*\.(yml|yaml)$/);
        return workflowFiles.some(
          (f) =>
            /npm\s+run\s+lint|eslint|prettier|ruff/.test(f.content)
        );
      },
      recommendation:
        "Add a linting step to your CI pipeline (eslint, prettier, ruff, or npm run lint) to enforce code quality.",
    },
  ],
};

const infrastructureCategory: AuditCategory = {
  id: "infrastructure",
  name: "Infrastructure",
  icon: "🏗️",
  checks: [
    {
      id: "has-iac",
      name: "Infrastructure as Code",
      description: "Checks whether Terraform files or a terraform/ directory exist.",
      points: 15,
      check: (files) =>
        hasFile(files, /\.tf$/) || hasFile(files, /^terraform\//),
      recommendation:
        "Adopt Infrastructure as Code using Terraform. Add .tf files or a terraform/ directory to manage infrastructure declaratively.",
    },
    {
      id: "has-state-encryption",
      name: "State File Encryption",
      description: "Checks whether Terraform backend config enables state encryption.",
      points: 10,
      check: (files) => contentMatches(files, /\.tf$/, /encrypt\s*=\s*true/),
      recommendation:
        'Enable state file encryption in your Terraform backend config: encrypt = true.',
    },
    {
      id: "has-version-pinning",
      name: "Terraform Version Pinning",
      description: "Checks whether Terraform files pin a required_version.",
      points: 5,
      check: (files) => contentMatches(files, /\.tf$/, /required_version/),
      recommendation:
        "Pin your Terraform version using required_version to ensure reproducible builds.",
    },
    {
      id: "has-module-structure",
      name: "Module Structure",
      description: "Checks whether a modules/ directory exists for reusable Terraform modules.",
      points: 5,
      check: (files) => hasFile(files, /^modules\//),
      recommendation:
        "Organise your Terraform code into reusable modules under a modules/ directory.",
    },
  ],
};

const dockerCategory: AuditCategory = {
  id: "docker",
  name: "Docker",
  icon: "🐳",
  checks: [
    {
      id: "has-dockerfile",
      name: "Dockerfile",
      description: "Checks whether a Dockerfile or *.dockerfile exists.",
      points: 10,
      check: (files) =>
        hasFile(files, /(^|\/)Dockerfile$/) || hasFile(files, /\.dockerfile$/),
      recommendation:
        "Add a Dockerfile to define your application's container image.",
    },
    {
      id: "has-multi-stage",
      name: "Multi-Stage Build",
      description: "Checks whether the Dockerfile uses multi-stage builds.",
      points: 5,
      check: (files) => {
        const dockerfiles = findFiles(
          files,
          /(^|\/)Dockerfile$|\.dockerfile$/
        );
        return dockerfiles.some((f) => {
          const fromCount = (f.content.match(/^FROM\s+/gm) || []).length;
          return fromCount >= 2;
        });
      },
      recommendation:
        "Use multi-stage Docker builds to reduce final image size and improve security.",
    },
    {
      id: "has-non-root",
      name: "Non-Root User",
      description: "Checks whether the Dockerfile runs as a non-root user.",
      points: 5,
      check: (files) => {
        const dockerfiles = findFiles(
          files,
          /(^|\/)Dockerfile$|\.dockerfile$/
        );
        return dockerfiles.some((f) => /^USER\s+/m.test(f.content));
      },
      recommendation:
        "Add a USER directive to your Dockerfile to run the container as a non-root user.",
    },
    {
      id: "has-dockerignore",
      name: ".dockerignore",
      description: "Checks whether a .dockerignore file exists.",
      points: 5,
      check: (files) => hasFile(files, /\.dockerignore$/),
      recommendation:
        "Add a .dockerignore file to exclude unnecessary files from the Docker build context.",
    },
  ],
};

const securityCategory: AuditCategory = {
  id: "security",
  name: "Security",
  icon: "🔒",
  checks: [
    {
      id: "no-hardcoded-secrets",
      name: "No Hardcoded Secrets",
      description:
        "Checks that no file contains hardcoded passwords, API keys, or tokens.",
      points: 15,
      check: (files) => {
        const secretPattern =
          /password\s*=\s*['"][^'"]+['"]|api_key\s*=\s*['"][^'"]+['"]|secret\s*=\s*['"][^'"]+['"]|token\s*=\s*['"][^'"]+['"]/i;
        return !files.some((f) => secretPattern.test(f.content));
      },
      recommendation:
        "Remove hardcoded secrets from your code. Use environment variables or a secrets manager instead.",
    },
    {
      id: "env-ignored",
      name: ".env in .gitignore",
      description: "Checks whether .env is listed in .gitignore.",
      points: 10,
      check: (files) => {
        const gitignore = files.find((f) => /(\.gitignore)$/.test(f.path));
        return gitignore !== undefined && /\.env/i.test(gitignore.content);
      },
      recommendation:
        "Add .env to your .gitignore to prevent leaking environment variables and secrets.",
    },
    {
      id: "has-dependency-scan",
      name: "Dependency Scanning",
      description:
        "Checks whether any workflow runs npm audit, safety check, or cargo audit.",
      points: 5,
      check: (files) => {
        const workflowFiles = findFiles(files, /\.github\/workflows\/.*\.(yml|yaml)$/);
        return workflowFiles.some(
          (f) =>
            /npm\s+audit|safety\s+check|cargo\s+audit/.test(f.content)
        );
      },
      recommendation:
        "Add dependency vulnerability scanning (npm audit, safety check, or cargo audit) to your CI pipeline.",
    },
  ],
};

const complianceCategory: AuditCategory = {
  id: "compliance",
  name: "Compliance",
  icon: "✅",
  checks: [
    {
      id: "has-branch-protection",
      name: "Branch Protection",
      description:
        "Placeholder check — branch protection must be verified manually via the GitHub API.",
      points: 10,
      // Always returns true for now; real check requires GitHub API access.
      check: () => true,
      recommendation:
        "Enable branch protection rules on your default branch to prevent force pushes and require reviews.",
    },
    {
      id: "has-logging",
      name: "Logging",
      description: "Checks whether the codebase uses a recognised logging library.",
      points: 5,
      check: (files) => {
        const sourceFiles = findFiles(
          files,
          /\.(ts|js|mjs|cjs|py|java|go|rs|rb)$/
        );
        const loggingPattern =
          /require\s*\(\s*['"](?:winston|pino|log4js|bunyan|log4j|logging|structlog)['"]\)|from\s+['"](?:winston|pino|log4js|bunyan|log4j|logging|structlog)['"]|import\s+.*['"](?:winston|pino|log4js|bunyan|log4j|logging|structlog)['"]/;
        return sourceFiles.some((f) => loggingPattern.test(f.content));
      },
      recommendation:
        "Use a structured logging library (winston, pino, log4j, etc.) for observability and easier debugging.",
    },
    {
      id: "has-access-control",
      name: "Access Control",
      description: "Checks for auth middleware or RBAC patterns in the codebase.",
      points: 10,
      check: (files) => {
        const sourceFiles = findFiles(
          files,
          /\.(ts|js|mjs|cjs|py|java|go|rb)$/
        );
        const authPattern =
          /middleware.*auth|auth.*middleware|passport|jwt|bearer|RBAC|role.*based|isAdmin|isAuthenticated|permission|authorize|requireAuth|protect|authenticate/;
        return sourceFiles.some((f) => authPattern.test(f.content));
      },
      recommendation:
        "Implement authentication middleware and role-based access control (RBAC) to secure API endpoints.",
    },
  ],
};

// ─── All categories ──────────────────────────────────────────────────────────

const allCategories: AuditCategory[] = [
  ciCdCategory,
  infrastructureCategory,
  dockerCategory,
  securityCategory,
  complianceCategory,
];

// ─── Grade Calculation ───────────────────────────────────────────────────────

function calculateGrade(score: number, maxScore: number): string {
  if (maxScore === 0) return "N/A";
  const pct = (score / maxScore) * 100;
  if (pct <= 30) return "Critical";
  if (pct <= 60) return "Needs Work";
  if (pct <= 85) return "Good";
  return "Excellent";
}

// ─── Main Audit Function ─────────────────────────────────────────────────────

/**
 * Run the full audit against a list of repo files.
 *
 * 1. Execute every check in every category.
 * 2. Score each category, collect issues for failed checks.
 * 3. Sum category scores and compute an overall grade.
 */
export function runAudit(files: RepoFile[]): AuditReport {
  let totalScore = 0;
  let totalMaxScore = 0;
  const categories: CategoryResult[] = [];
  const allRecommendations: string[] = [];

  for (const category of allCategories) {
    let categoryScore = 0;
    const issues: AuditIssue[] = [];

    for (const check of category.checks) {
      totalMaxScore += check.points;

      const passed = check.check(files);
      if (passed) {
        categoryScore += check.points;
      } else {
        issues.push({
          checkId: check.id,
          name: check.name,
          description: check.description,
          recommendation: check.recommendation,
        });
        allRecommendations.push(check.recommendation);
      }
    }

    totalScore += categoryScore;

    categories.push({
      id: category.id,
      name: category.name,
      icon: category.icon,
      score: categoryScore,
      maxScore: category.checks.reduce((sum, c) => sum + c.points, 0),
      issues,
    });
  }

  return {
    score: totalScore,
    maxScore: totalMaxScore,
    grade: calculateGrade(totalScore, totalMaxScore),
    categories,
    recommendations: allRecommendations,
  };
}
