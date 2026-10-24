/**
 * @file Claude Code PreToolUse guard — no git hook bypass
 * @description Reads the Bash tool call on stdin and blocks (exit 2) any attempt to skip the
 *   pre-commit CI gate: --no-verify, `git commit -n`, HUSKY=0, or rewiring core.hooksPath.
 *   Wired in .claude/settings.json. Deterministic: same command in, same decision out.
 */
import { readFileSync } from 'node:fs';

const RULES = [
  { re: /--no-verify\b/, why: '--no-verify skips the pre-commit CI gate' },
  {
    re: /\bgit\b[^;&|]*\bcommit\b[^;&|]*\s-[a-zA-Z]*n[a-zA-Z]*(\s|$)/,
    why: '`git commit -n` skips the pre-commit CI gate',
  },
  { re: /\bHUSKY\s*=\s*0\b/, why: 'HUSKY=0 disables the git hooks' },
  { re: /core\.hooksPath/, why: 'changing core.hooksPath disconnects the git hooks' },
];

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const command = String(input?.tool_input?.command ?? '');
// Quoted text (commit messages, heredocs inside "$(...)") is data, not flags.
const code = command.replace(/"(?:\\.|[^"\\])*"|'[^']*'/g, '""');

const hit = RULES.find((rule) => rule.re.test(code));
if (hit) {
  process.stderr.write(
    `Blocked: ${hit.why}. Commits must pass \`npm run ci\` through the hook. ` +
      'If it is red, fix the cause (`npm run fix` for format/lint), stage, and commit again.\n',
  );
  process.exit(2);
}
