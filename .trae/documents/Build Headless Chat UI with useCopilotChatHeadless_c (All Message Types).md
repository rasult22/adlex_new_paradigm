## Overview

* Adopt `useCopilotChatHeadless_c` to build a fully custom chat UI that renders every message role and related agent events.

* The hook exposes `messages`, `sendMessage`, `isLoading`, plus advanced controls (suggestions, interrupts, MCP, stop/reset) for a complete headless experience (Source: <https://docs.copilotkit.ai/reference/hooks/useCopilotChatHeadless_c>).

* Messages follow AG-UI semantics (users, assistant, system/developer, tool), and agents may stream events like text tokens, tool-call progress, and state updates (Source: <https://www.copilotkit.ai/blog/master-the-17-ag-ui-event-types-for-building-agents-the-right-way>).

## Current Code Context

* CopilotKit provider is configured at `src/main.tsx` to wrap the app.

* `AIChat.tsx` already imports and uses `useCopilotChatHeadless_c`; messages are rendered as `{msg.content}` at `src/pages/home-screen/components/AIChat.tsx:42-50`.

* `index.tsx` uses `useCopilotChat` and GQL message types for programmatic messaging.

## Hook Capabilities to Use

* `messages: Message[]` — AG-UI message format.

* `sendMessage(message)` — submit user messages.

* `isLoading` — generation indicator.

* `reloadMessages(messageId)` / `stopGeneration()` / `reset()` — control flows.

* `suggestions`, `generateSuggestions()` — optional AI suggestions surface.

* `interrupt` — render human-in-the-loop prompts when present.

## Message Types & Rendering

* Roles to display: `user`, `assistant`, `system`, `developer`, `tool`.

* Text streaming: display partial content and completion; show typing indicator when `isLoading`.

* Tool-call context: show tool-related messages (role `tool`) distinctly (badge + details). If tool results are emitted as messages, include an expandable panel; for richer UI, wire `useCopilotAction` later.

* System/developer messages: optionally visible with a toggle (default hidden) to avoid clutter.

* Errors/lifecycle: show a lightweight banner when a run errors or is stopped; tie to `reloadMessages` and `stopGeneration()` for recovery.

## UI Implementation Outline

1. Message rendering layer

* Create `MessageBubble` component: styles per role (`user` right-aligned, `assistant` left; `tool` with a status bar; `system/developer` muted).

* Map `messages` with safe guards for `id`, `role`, `content`. If future payloads include structured parts (code blocks, tables, images), render by type.

1. Composer & actions

* Input box + Send button wired to `sendMessage({ id, role: "user", content })`.

* Add `Stop` and `Reset` controls using `stopGeneration()` and `reset()`.

* Add `Regenerate` per message via `reloadMessages(messageId)` (icon beside assistant messages).

1. Suggestions & Interrupts

* Suggestions: show a horizontal bar of suggested actions if `suggestions.length`; add `Generate` button calling `generateSuggestions()`.

* Interrupts: if `interrupt` is non-null, render inline modal content; reserve an optional follow-up to respond via a dedicated pattern if we adopt LangGraph interrupt APIs.

1. Visibility controls

* Toggle to include/exclude `system` and `developer` messages.

* Compact/expanded view for `tool` role content.

## Verification Plan

* Send multiple user messages and verify role-aligned bubbles and streaming indicator (`isLoading`).

* Trigger assistant reply and test `reloadMessages` and `stopGeneration` controls.

* Validate suggestions rendering by calling `generateSuggestions()`.

* Simulate a `tool` role entry (if backend emits one) and confirm distinct rendering.

## Implementation Notes

* Keep the hook in `AIChat.tsx`; replace the simple `{msg.content}` rendering with role-aware components.

* Preserve CopilotKit provider config in `src/main.tsx`.

* Avoid exposing system/developer content by default; allow users to toggle on.

* Prepare for future structured content parts (code, image) as AG-UI evolves.

* Use untitled ui components if needed.

## Next Step

* I will update `AIChat.tsx` to a headless, role-aware chat UI using `useCopilotChatHeadless_c`, add suggestions/interrupt surface, and controls for regenerate/stop/reset, while keeping the current provider setup intact. Confirm to proceed, and I will implement and verify end-to-end.

