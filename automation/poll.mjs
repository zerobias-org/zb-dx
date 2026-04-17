#!/usr/bin/env node
// zb-dx-watcher: poll #zb-dx for new members, DM Clark with a draft welcome.
// On first run (no state file), bootstrap state silently — no welcomes sent.

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const TOKEN = process.env.SLACK_BOT_TOKEN;
const CHANNEL_ID = process.env.ZB_DX_CHANNEL_ID;
const CLARK_ID = process.env.CLARK_SLACK_USER_ID;
const STATE_FILE = join(process.cwd(), 'automation', 'known-members.json');
const TEMPLATE_FILE = join(process.cwd(), 'automation', 'welcome-template.md');

if (!TOKEN || !CHANNEL_ID || !CLARK_ID) {
  console.error('Missing required env: SLACK_BOT_TOKEN, ZB_DX_CHANNEL_ID, CLARK_SLACK_USER_ID');
  process.exit(1);
}

async function slack(method, params = {}, body = null) {
  const isPost = body !== null;
  const url = new URL(`https://slack.com/api/${method}`);
  if (!isPost) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url, {
    method: isPost ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(isPost && { 'Content-Type': 'application/json; charset=utf-8' }),
    },
    ...(isPost && { body: JSON.stringify(body) }),
  });

  const data = await res.json();
  if (!data.ok) throw new Error(`Slack API ${method} failed: ${data.error || JSON.stringify(data)}`);
  return data;
}

async function getCurrentMembers() {
  const members = [];
  let cursor;
  do {
    const data = await slack('conversations.members', {
      channel: CHANNEL_ID,
      limit: '200',
      ...(cursor && { cursor }),
    });
    members.push(...data.members);
    cursor = data.response_metadata?.next_cursor;
  } while (cursor);
  return members;
}

async function getUserProfile(userId) {
  const data = await slack('users.info', { user: userId });
  return data.user;
}

async function loadState() {
  if (!existsSync(STATE_FILE)) return null;
  const raw = await readFile(STATE_FILE, 'utf8');
  return JSON.parse(raw);
}

async function saveState(state) {
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2) + '\n');
}

async function loadTemplate() {
  return await readFile(TEMPLATE_FILE, 'utf8');
}

function renderTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

function buildClarkDM(profile, draftMessage) {
  const name = profile.real_name || profile.name;
  const handle = `@${profile.name}`;
  const email = profile.profile?.email || '_(not visible — bot lacks users:read.email or user opted out)_';
  const title = profile.profile?.title || '_(none)_';

  return [
    `:wave: *New #zb-dx member detected*`,
    ``,
    `> *${name}* (${handle})  -  <@${profile.id}>`,
    `> Email: ${email}`,
    `> Title: ${title}`,
    ``,
    `*Draft welcome message* (review below, then copy/paste to DM them):`,
    `\`\`\``,
    draftMessage,
    `\`\`\``,
    ``,
    `_To skip: just ignore. To customize: edit before sending._`,
  ].join('\n');
}

async function dmClark(text) {
  // Open the IM channel first to be safe across Slack edge cases
  const im = await slack('conversations.open', {}, { users: CLARK_ID });
  await slack('chat.postMessage', {}, {
    channel: im.channel.id,
    text,
    unfurl_links: false,
    unfurl_media: false,
  });
}

async function main() {
  console.log(`[${new Date().toISOString()}] Polling channel ${CHANNEL_ID}`);

  const current = await getCurrentMembers();
  const currentSet = new Set(current);
  console.log(`Current members: ${current.length}`);

  const state = await loadState();

  if (state === null) {
    // Bootstrap: first run, capture current state, no welcomes
    console.log('No state file — bootstrapping (no welcomes will be sent for existing members)');
    await saveState({
      channel_id: CHANNEL_ID,
      bootstrapped_at: new Date().toISOString(),
      known_member_ids: current,
    });
    console.log('Bootstrap complete.');
    return;
  }

  const knownSet = new Set(state.known_member_ids || []);
  const newMembers = current.filter(id => !knownSet.has(id));

  if (newMembers.length === 0) {
    console.log('No new members.');
    return;
  }

  console.log(`Detected ${newMembers.length} new member(s): ${newMembers.join(', ')}`);
  const template = await loadTemplate();

  for (const userId of newMembers) {
    try {
      const profile = await getUserProfile(userId);
      // Skip bots and apps — only welcome humans
      if (profile.is_bot || profile.deleted) {
        console.log(`Skipping ${userId} (bot or deleted)`);
        continue;
      }

      const firstName = (profile.profile?.first_name || profile.real_name || profile.name || '')
        .split(/\s+/)[0] || 'there';

      const draftMessage = renderTemplate(template, {
        first_name: firstName,
        handle: profile.name,
      });

      const dmText = buildClarkDM(profile, draftMessage);
      await dmClark(dmText);
      console.log(`DM'd Clark about new member ${userId} (${profile.name})`);
    } catch (err) {
      console.error(`Failed to process ${userId}:`, err.message);
      // Don't update state for failed members so we'll retry next run
      currentSet.delete(userId);
    }
  }

  // Save updated state — only successfully processed (or already-known) members
  await saveState({
    ...state,
    last_updated: new Date().toISOString(),
    known_member_ids: [...currentSet].sort(),
  });

  console.log('Done.');
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
