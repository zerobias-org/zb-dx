---
status: draft
author: clark
app: sme-mart
severity: high
subscribers:
  - clark
zb-task: null
resolution: null
resolved-date: null
promoted-to: null
---

# FileService is not executable via ZB MCP (describe-only, like portal)

## What I was trying to do

Create Project Notes (notebooks + note files with markdown bodies) on UAT via ZB MCP — the sanctioned path — as part of standing up requirements/model living-docs for the backend team on the Transparency Commerce dogfood tree.

## What happened

ZB MCP **indexes** the FileService OpenAPI, so `zerobias_search` / `zerobias_describe` return every op and its full shape (`fileservice.Folder.create`, `fileservice.File.create`, etc.). But `zerobias_execute` on any of them fails:

```
API error: Unknown service: fileservice
```

So FileService is **describe-only** in MCP — same situation as `portal`. Nothing (folder create, file create, body upload, delete) can actually be run through MCP. The describe surface is a false affordance: it looks available, then errors on execute.

Compounding gotchas discovered while building the curl workaround:
- The public gateway path `https://<env>.zerobias.com/file-service/…` is **CloudFront and GET-only** — POST/PUT/DELETE return `403 "distribution supports only cachable requests"`. Writes must use the **`/api/file-service`** prefix.
- The content-upload endpoint `POST /files/{id}/upload` is **undocumented** (absent from the OpenAPI, so it can never appear in MCP) and requires a **`?checksum=<md5-hex>`** query param of the exact bytes, else `400 "checksum query parameter must be specified"`.

## What I expected

`fileservice` to be executable via `zerobias_execute` like `platform` / `hub` / `store` / `hydra` / `danaOld`, so Notes/Documents/file work can be done on the sanctioned MCP path without dropping to direct HTTP. (Ideally the undocumented `/upload` endpoint also gets a real OpenAPI entry so it's discoverable.)

## Workaround (if any)

Full curl recipe + a drop-in `zb-fs.sh` helper (subcommands: `mkfolder`/`mkfile`/`put`/`cat`/`ls`/`rm…`), verified end-to-end on UAT:

- Recipe: `mocks/_coord/FILESERVICE-CURL-RECIPE.md`
- Local slash command: `/zb-fs` (helper at `~/.claude/scripts/zb-fs.sh`)
- Auth: `Authorization: APIKey …` + `Dana-Org-Id: …` from the active mcp-zb profile; base `https://<env>.zerobias.com/api/file-service`.

Note: files/folders ARE hydra Resources, so tagging / `resourceSearch` / `linkResources` on them still work through the `hydra` service in MCP — only the fileservice ops themselves are curl-only.

**Ask for Kevin:** add `fileservice` to ZB MCP's executable services (and give `/files/{id}/upload` a real OpenAPI entry). Pairs with the existing "hub-module unavailable on UAT/QA" friction — both are "the sanctioned MCP path can't reach a service we need."
