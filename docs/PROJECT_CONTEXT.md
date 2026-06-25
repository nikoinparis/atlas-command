# Project Context

## Product Vision

Atlas Command is a fantasy 2.5D village/base-builder that acts as a serious operating system for small AI-assisted business experiments. Each building represents a business function with agents, tasks, approvals, cost, revenue, status, and risk.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Phaser 3 for the village canvas
- Local mock data for the first build
- Future Supabase, workers, queues, and LLM APIs

## Core Loop

1. Enter the village and scan status.
2. Open a building.
3. Talk to the manager agent.
4. Agents research, draft, or analyze.
5. Any side-effecting output goes to Approval Court.
6. Treasury logs cost and revenue.
7. Atlas recommends where to spend the next hour and dollar.

## Building List In This Build

- Keep Hall / HQ
- Treasury
- Content Studio
- Product Workshop
- Freelance Guild
- Engineering Workshop
- Approval Court
- Research Library
- Atlas Treasury / Allocation Tower

## Safety Philosophy

Agents can draft and propose. Humans approve real-world actions. Nothing that posts, sends, spends, publishes, invests, or changes production should happen automatically.

## Current Implementation Status

This build is a complete local mock foundation. It has the Next.js app, routes, Phaser canvas, HUD, panels, mock agents, mock tasks, mock approvals, mock Treasury data, local settings, and documentation. It does not require Supabase credentials or LLM API keys.
