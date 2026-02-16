# Agent Skills Generator

This document defines the workflow and standards for generating [Agent Skills](https://agentskills.io/home) for this project.

PLEASE FOLLOW THESE BEST PRACTICES: [Claude Agent Skills Guidelines](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

## Overview

The goal is to provide LLM agents with highly distilled, actionable technical references. Focus on **capabilities** and **practical usage patterns**. Skip introductory fluff, installation guides, or general knowledge that LLMs already possess.

## Repository Structure

```
.
├── .agent/                  # Agent-specific configurations
│   └── AGENTS.md            # This instruction file
├── docs/                    # Primary source of truth (Documentation)
├── src/                     # Source code (Secondary reference)
└── skills/                  # Output directory
    └── {skill-group}/       # Grouped skills (e.g., core, advanced)
        ├── SKILL.md         # Index and entry point
        └── references/      # Individual skill files
            ├── core-*.md
            ├── feature-*.md
            └── expert-*.md

```

## Workflows

### 1. Skill Generation

When creating or updating skills from the project's own documentation:

1. **Read & Analyze**: Review `docs/` and `src/` to identify core concepts, API signatures, and "gotchas."
2. **Categorize**: Group references into `core`, `features`, `best-practices`, or `advanced`.
3. **Synthesize**: Rewrite information specifically for agent consumption (concise, code-heavy).
4. **Create/Update**:
* Populate `skills/{group}/references/*.md` with specific concepts.
* Maintain `skills/{group}/SKILL.md` as the central registry.

### 2. Maintenance

* **Sync with Docs**: Whenever a feature in `src/` or a guide in `docs/` changes, the corresponding file in `skills/` must be updated.
* **Version Tracking**: Update the `version` (Date-based) in the `SKILL.md` frontmatter whenever a change is made.

---

## File Formats

### `SKILL.md` (The Index)

Every skill group must have a `SKILL.md`. It acts as the "Table of Contents" for the agent.

```markdown
---
name: project-name-skills
description: Comprehensive skills for working with [Project Name]
metadata:
  author: Your Name
  version: "2026.01.29"
  source: Internal Documentation
---

> Based on [Project] v1.2.3. Focuses on [Main Purpose].

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Main API | Core function signatures and lifecycle | [core-api](references/core-api.md) |
| Configuration | Essential project setup options | [core-config](references/core-config.md) |

## Advanced Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Custom Plugins | Extending the system via the plugin API | [advanced-plugins](references/advanced-plugins.md) |
```

### `references/*.md` (The Content)

Individual files should focus on **one concept per file**.

```markdown
---
name: concept-name
description: How to use [Concept] effectively
---

# {Concept Name}

## Usage
Provide the most common and "best practice" code examples here.

```typescript
// Concise, working example
import { feature } from 'my-project';
feature.doSomething();
```

## Key Points

* **Constraint A**: Explanation of a limitation.
* **Pattern B**: When to use this over another feature.

```

---

## Writing Guidelines

1.  **Rewrite for Agents**: Do not copy-paste. Summarize and synthesize.
2.  **One Concept per File**: Keep files small so the agent can retrieve only what it needs (minimizing context window usage).
3.  **Provide Rationale**: Don't just show *how*, explain *why* or *when* to use a specific pattern.
4.  **No Fluff**: Skip "Welcome to the project" or "We are excited to share..."
5.  **Technical Accuracy**: Use LaTeX for complex math/formulas only (e.g., $E = mc^2$). Use standard Markdown for everything else.

---

**Would you like me to generate a template for a specific skill based on one of your existing documentation files?**

```
