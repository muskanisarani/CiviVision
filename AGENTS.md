<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Ralph Loop Workflow Protocol

When the user triggers Ralph Loop commands, follow this exact protocol:

## Commands:
- `ralph run`:
  1. Read `PRD.md` and `progress.txt` fresh.
  2. Identify the first unchecked task (`- [ ]`).
  3. Execute the implementation and tests for that specific task.
  4. Update `PRD.md` by marking the task as completed (`- [x]`).
  5. Append a summary entry with date/timestamp to `progress.txt`.
  6. Create a git commit for that task (e.g. `git commit -m "ralph: <task description>"`).
  7. Hand back control to the user and stop.

- `ralph run all`:
  1. Autonomously repeat the loop (steps 1–6) for each consecutive unchecked task.
  2. Stop when all tasks in `PRD.md` are completed (`- [x]`).

- `ralph status`:
  1. Read `PRD.md` and `progress.txt`.
  2. Present a clear breakdown: Completed tasks, In-Progress / Next task, Remaining tasks.
  3. Do NOT make any code modifications or commits.

- `ralph continue`:
  1. Resume from the first remaining unchecked task in `PRD.md` and execute the `ralph run` cycle.

