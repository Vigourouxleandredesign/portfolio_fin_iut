/**
 * @file Secret leak smoke check (A3)
 * @description Scans tracked source trees for obvious secret patterns.
 *   Does not replace human review of diffs. See docs/TESTING.md.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['src', 'pages', 'public', 'scripts'];
const SKIP_DIR_NAMES = new Set([
  'node_modules',
  'dist',
  '.git',
  'reference',
  'Assets',
]);

/** Patterns that must never appear in committed front/source trees */
const FORBIDDEN = [
  { id: 'service_role_assignment', re: /service_role\s*[:=]/i },
  { id: 'supabase_service_role_env', re: /SUPABASE_SERVICE_ROLE/ },
  { id: 'begin_private_key', re: /BEGIN (RSA |OPENSSH )?PRIVATE KEY/ },
  { id: 'aws_access_key_id', re: /AKIA[0-9A-Z]{16}/ },
];

/**
 * @param {string} dir
 * @param {string[]} files
 */
function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR_NAMES.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, files);
    } else if (/\.(ts|js|mjs|cjs|html|css|json|txt|toml)$/i.test(name)) {
      if (name === '.env') continue;
      files.push(full);
    }
  }
  return files;
}

const hits = [];
for (const dirName of SCAN_DIRS) {
  const dir = join(ROOT, dirName);
  try {
    statSync(dir);
  } catch {
    continue;
  }
  for (const file of walk(dir, [])) {
    if (file.includes('check-no-secrets')) continue;
    const text = readFileSync(file, 'utf8');
    for (const rule of FORBIDDEN) {
      if (rule.re.test(text)) {
        hits.push(`${rule.id} → ${relative(ROOT, file)}`);
      }
    }
  }
}

if (hits.length > 0) {
  console.error('[check:secrets] Forbidden patterns found:');
  for (const hit of hits) console.error(`  - ${hit}`);
  process.exit(1);
}

console.log('[check:secrets] OK — no forbidden secret patterns in scanned trees.');
