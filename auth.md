# Auth.md — Harekaze Agent Registration Metadata

## Overview

This file provides agent registration and authentication metadata for **https://harekaze.link**.

## Authentication

This site is a **public blog and tools website**. No authentication is required to access any content or tools. All pages and tools are publicly available without login.

## Agent Access

- **Content**: AI agents may read and index all public pages (`/robots.txt` governs crawling rules)
- **Tools**: All tool pages (`/tools/`) are accessible via direct URL navigation
- **APIs**: This site does not expose any authenticated API endpoints

## Agent Auth Block

```json
{
  "agent_auth": {
    "register_uri": null,
    "supported_identity_types": [],
    "credential_types": ["none"],
    "claims_uri": null,
    "revocation_uri": null,
    "description": "No authentication required. This is a public website with no protected resources."
  }
}
```

## Content Signals

Please respect the following Content-Signal directives declared in `robots.txt`:

- `ai-train=no` — Do not train AI models on this site's content
- `search=yes` — Search engines may index this content
- `ai-input=yes` — Accept queries from AI agents via standard web protocols

## Discovery Endpoints

| Endpoint | Content-Type | Purpose |
|----------|-------------|---------|
| `/.well-known/ai-catalog.json` | `application/json` | ARD manifest |
| `/.well-known/api-catalog.json` | `application/linkset+json` | RFC 9727 API catalog |
| `/.well-known/agent-skills/index.json` | `application/json` | Agent skills index |

## Contact

For questions about this site, visit the [About Us](https://harekaze.link/about_us.html) page.
