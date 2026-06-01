#!/usr/bin/env node
// architecture-docs-notify: post to #zb-dx when architecture docs land on main.
// Terse message — changed files, a compare link, and the latest CHANGELOG entry —
// so folks know to pull latest / sync with upstream.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const TOKEN = process.env.SLACK_BOT_TOKEN;
const CHANNEL_ID = process.env.ZB_DX_CHANNEL_ID;
const COMPARE_URL = process.env.COMPARE_URL || '';
const PUSHER = process.env.PUSHER || 'someone';
const CHANGED_FILES = (process.env.CHANGED_FILES || '')
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean);
const CHANGELOG_FILE = join(process.cwd(), 'architecture', 'CHANGELOG.md');

if (!TOKEN || !CHANNEL_ID) {
  console.error('Missing required env: SLACK_BOT_TOKEN, ZB_DX_CHANNEL_ID');
  process.exit(1);
}

async function slackPost(method, body) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Slack API ${method} failed: ${data.error || JSON.stringify(data)}`);
  return data;
}

async function topChangelogEntry() {
  if (!existsSync(CHANGELOG_FILE)) return null;
  const raw = await readFile(CHANGELOG_FILE, 'utf8');
  const lines = raw.split('\n');
  const start = lines.findIndex((l) => /^## /.test(l));
  if (start === -1) return null;
  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end === -1) end = lines.length;
  const section = lines.slice(start, end);
  const heading = section[0].replace(/^##\s+/, '').trim();
  // Cap at the first real paragraph. Skip blank-line-delimited blocks that
  // mention "memex" — those are private-memory source citations, meaningless
  // to the channel audience.
  const paragraphs = section
    .slice(1)
    .join('\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const firstPublic = paragraphs.find((p) => !/memex/i.test(p));
  return firstPublic ? `${heading}\n\n${firstPublic}` : heading;
}

function truncate(s, n) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

async function main() {
  if (CHANGED_FILES.length === 0) {
    console.log('No changed architecture files detected — skipping notification.');
    return;
  }

  const entry = await topChangelogEntry();
  const fileLines = CHANGED_FILES.map((f) => `• \`${f}\``).join('\n');

  const parts = [
    `:books: *zb-dx architecture docs updated* (by ${PUSHER})`,
    '',
    fileLines,
    '',
    COMPARE_URL ? `<${COMPARE_URL}|View the diff>` : '',
    '',
    ':arrows_counterclockwise: *Pull latest / sync with upstream* to stay current.',
  ];

  if (entry) {
    parts.push('', '*Latest CHANGELOG entry:*', '```', truncate(entry, 2500), '```');
  }

  const text = parts.filter((p) => p !== '').join('\n');

  await slackPost('chat.postMessage', {
    channel: CHANNEL_ID,
    text,
    unfurl_links: false,
    unfurl_media: false,
  });

  console.log(`Posted architecture-docs update to ${CHANNEL_ID} (${CHANGED_FILES.length} file(s)).`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
