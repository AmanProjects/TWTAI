# Guidelines for Three Project Teams

*Working model for forming teams, collaborating smoothly, and delivering proof-of-concepts*

**Purpose.** This document converts the project discussion into a simple operating model. The intent is to keep the group focused on three project tracks, assign one clear owner per project, maintain team boundaries, and ensure each group delivers a practical proof-of-concept.

**Guiding principle.** Each team should solve a real documentation workflow problem, demonstrate a working proof-of-concept, and capture learnings that can be reused by other teams.

## 1. Final Project Tracks

| Project Track | Scope / Included Ideas | Suggested Owner | Target Team Size | Group Link |
|---|---|---|---|---|
| Release Notes | Release note generator and release-notes/project-update workflow. | Riffat | 9-10 including owner | <https://chat.whatsapp.com/LVEsGsjWYNQKbejrDk3kJg?s=cl&p=i&ilr=0> |
| Document Intelligence Platform - Converter & Rebranding | Word to DITA-XML converter, rebranding across documents, document transformation, and document cleanup. | Samyak | 9-10 including owner | To be added |
| Document Intelligence Platform - Draft Generator & Automated Pre-Review | Rapid first drafts from demo recordings, wiki pages, and marketing content; automated pre-review for style, completeness, and readiness. | Shrutika | 9-10 including owner | To be added |

**Decision deadline.** Owners for all three projects must be identified by end of business today, Sunday, 21 June 2026. Once owners are confirmed, sign-ups should be closed, teams balanced, and execution should begin.

## 2. Team Formation Rules

- Each project must have exactly one owner. The owner is accountable for scope, coordination, and final proof-of-concept readiness.
- Each project should have 9-10 members including the owner. This keeps the teams large enough for execution but small enough to coordinate.
- Every participant should belong to only one project team unless an exception is explicitly approved by all affected owners.
- People already signed up for a project should not be moved without a short discussion with the person and the receiving owner.
- If one team crosses 10 members, the owner should redirect additional volunteers to a team that is below capacity.
- If a project has fewer than 7 members, it should either recruit from related ideas or reduce its scope to a smaller proof-of-concept.

## 3. Owner Responsibilities

- Create a one-page project charter within the first working session: problem statement, users, input sources, expected output, exclusions, success criteria, and the Git repository location.
- Maintain the final team roster, create or own the project Git repository, and ensure only listed participants are included in project-specific communication channels.
- Assign roles for discovery, prototype build, content validation, testing, demo preparation, and documentation.
- Run short check-ins, remove blockers, and keep the discussion focused on the proof-of-concept outcome.
- Protect the team from scope creep. New ideas should go into a backlog unless they are essential for the proof-of-concept.
- Prepare the final demo narrative: problem, approach, workflow, proof-of-concept, limitations, and recommended next steps.

## 4. Member Responsibilities

- Commit to the team selected and avoid parallel sign-ups unless there is a specific cross-project dependency.
- Attend agreed working sessions or provide async updates before the session if unavailable.
- Own at least one concrete task: research, sample data, workflow mapping, prompt design, prototype logic, validation, testing, or demo material.
- Share work in the project Git repository so the team does not depend on private files, chat history, or one person's local setup.
- Raise blockers early and propose a practical option, not just a problem statement.
- Respect the owner's final call when the team needs to make a quick scope or design decision.

## 5. Git Repository and Information Management

Each project must have its own Git repository. The repository is the official source of truth for the team.

All project information should be part of the repository: charter, roster, roles, README, meeting notes, decisions, assumptions, sample input references, prototype code, prompts, scripts, validation notes, and final recommendations.

The README should explain the problem, scope, setup steps, how to run or review the proof-of-concept, known limitations, and who owns which area.

Use issues, a lightweight project board, or a task list in the repository to track ownership and progress. Avoid tracking key decisions only in WhatsApp or private messages.

No critical work should live only on a personal machine, private drive, or chat thread. If a file cannot be committed directly because of permissions or confidentiality, add a clear reference, access note, or redacted placeholder in the repository.

The project owner is responsible for repository hygiene: clear folder structure, useful README, current roster, clean task ownership, and final demo readiness.

## 6. Meeting and Working Agreement

- Meetings should be scheduled only when required and only as agreed by the project owner and team members.
- The owner and members should agree on the meeting rhythm, duration, timing, and expected participation. This should respect availability, time zones, and current workload.
- Each meeting should have a clear purpose: decision, unblocker, review, demo preparation, or validation. Avoid meetings that only repeat status available in the repository.
- Every meeting should produce brief notes, decisions, and action items in the Git repository within 24 hours, preferably in a `/meetings` or `/docs/meetings` folder.
- Async updates are acceptable when a meeting is not needed. Important decisions made in chat or calls must still be captured in the repository.

## 7. Recommended Roles Within Each Team

| Role | Typical Count | Responsibility |
|---|---:|---|
| Project Owner | 1 | Owns scope, milestones, decisions, team rhythm, and final demo readiness. |
| Workflow / Domain Leads | 2 | Map the real documentation workflow and define what good output looks like. |
| Prototype Builders | 2-3 | Build the proof-of-concept using available tools, scripts, prompts, APIs, or low-code components. |
| Content and Data Curators | 1-2 | Collect representative input samples and expected output examples. |
| Validation / QA Leads | 1-2 | Test the proof-of-concept against sample scenarios, record gaps, and validate usefulness. |
| Demo and Documentation Lead | 1 | Prepares the demo storyline, screenshots, instructions, and final summary. |

## 8. Proof-of-Concept Expectations

**Deadline.** Each team must be ready to present its working proof-of-concept by Sunday, 05 July 2026. The demo should show evidence of a working flow, not only slides or discussion notes.

- The proof-of-concept must demonstrate a working flow, not just slides or discussion notes.
- It can be lightweight: a script, workflow, prototype UI, prompt chain, automation, or integrated tool flow is acceptable.
- It must use at least two realistic sample inputs and show before/after or input/output comparison.
- It must clearly state what is automated, what still requires human review, and where the solution can fail.
- It must include a short README or usage note so another team member can reproduce the demo.
- It must end with an honest recommendation: continue, pivot, merge with another project, or stop.

## 9. Deadline-Driven Delivery Plan

| Milestone | Deadline | Required Actions | Exit Criteria |
|---|---|---|---|
| Owner confirmation | EOB Sun, 21 Jun | Confirm the named owner for each of the three tracks. Volunteers align to one preferred project. | Each project has exactly one accountable owner. |
| Roster, repo, and charter | Mon, 22 Jun | Publish final roster, role map, Git repo link, and one-page charter. Team confirms availability. | Team is formed, repo is live, and scope is visible. |
| Discovery and sample inputs | Wed, 24 Jun | Map workflow, collect realistic samples, define expected outputs, and agree success criteria. | Inputs, assumptions, exclusions, and success criteria are documented. |
| First working prototype | Fri, 27 Jun | Build a rough end-to-end flow using realistic sample data. | PoC runs at least once, even if rough. |
| Validation and feature freeze | Mon, 30 Jun | Freeze scope for the 05 Jul demo. Test quality, edge cases, usability, and gaps. | Team knows what works, what fails, and what will be shown. |
| Demo package ready | Wed, 02 Jul | Prepare README, screenshots, sample outputs, validation notes, demo story, and backup evidence. | Another member can follow the repo and reproduce the demo. |
| Final rehearsal | Fri, 04 Jul | Run final walkthrough, assign speaking parts, and fix only critical demo blockers. | Demo is ready within the agreed time. |
| PoC presentation | Sun, 05 Jul | Present problem, approach, workflow, PoC, limitations, evidence, and next steps. | Working proof-of-concept is presented with a clear recommendation. |

## 10. Collaboration Norms

- Use one official roster source. Avoid copying long lists across WhatsApp repeatedly because versions quickly diverge.
- Use project-specific groups only after rosters are confirmed. People not on the roster should not be added to that project channel.
- Keep discussion threads decision-oriented: proposal, decision needed, owner response, next action.
- Capture decisions in the project Git repository, not only in chat.
- Use respectful disagreement. Challenge the idea, not the person.
- Escalate cross-project dependencies early, especially between the two Document Intelligence Platform teams.

## 11. Scope Boundaries for the Three Projects

### Release Notes

- Focus on extracting or generating release-note-ready content from structured or semi-structured inputs.
- Do not expand into every documentation output type unless it directly improves release note generation.
- Suggested demo: input feature/change data -> generated release note draft -> reviewer checklist or quality score.

### Document Intelligence Platform - Converter & Rebranding

- Focus on document transformation, format conversion, brand terminology cleanup, and reusable document intelligence services.
- Avoid building a full platform in the proof-of-concept. Demonstrate one or two high-value flows clearly.
- Suggested demo: Word/sample content -> DITA-XML or cleaned/rebranded output -> validation summary.

### Document Intelligence Platform - Draft Generator & Automated Pre-Review

- Focus on generating first drafts and reviewing them for style, completeness, gaps, and readiness.
- Use realistic source material such as demo notes, wiki pages, marketing text, or feature summaries.
- Suggested demo: source material -> first draft -> automated review report -> revised draft recommendations.

## 12. Decision and Escalation Model

- Project-level decisions are made by the project owner after listening to the team.
- Cross-project decisions are made by the three owners together, with Aman resolving ties or unresolved conflicts.
- If a topic does not affect the proof-of-concept, park it in the backlog.
- If two teams are duplicating work, the owners should either split the scope or agree on a shared component.
- If a team member is inactive, the owner should first check in privately, then reassign tasks if needed.

## 13. Required Artifacts From Each Team

- Project charter in the Git repository: problem, target users, scope, exclusions, success criteria.
- Roster and role map in the Git repository: owner, members, responsibilities.
- Sample input set and expected output examples.
- Working proof-of-concept or reproducible demo evidence committed to the Git repository.
- Validation notes in the Git repository: what worked, what failed, risks, and open questions.
- Final recommendation: continue, merge, pivot, or stop.

**Deadline reminder.** The repo should show clear evidence of progress at every milestone. By 05 July 2026, each repo should contain enough material for the PoC to be reviewed after the live presentation.

## 14. Immediate Next Actions

1. Confirm owners for all three projects by EOB today, Sunday, 21 June 2026.
2. Create one clean sign-up sheet with only the three final project tracks by Monday, 22 June 2026.
3. Cap each project at 10 participants including the owner and freeze the final roster by Monday, 22 June 2026.
4. Move people from the earlier detailed ideas into the closest final track by Monday, 22 June 2026.
5. Ask each owner to publish a one-page project charter by Monday, 22 June 2026, before the first working session.
6. Create one Git repository per project by Monday, 22 June 2026, and keep the charter, roster, meeting notes, decisions, sample data references, prototype files, validation notes, README, and final recommendation there.

## Appendix A: Clean Sign-Up Template

| Project | Owner | Members, including owner - max 10 |
|---|---|---|
| Release Notes | Riffat | 1. Riffat<br>2. Samyak Mukherjee<br>3. Dhannya Nair<br>4. Anubhav Chaudhary<br>5. Dimple Mittal<br>6. Srividya Kannan<br>7. Div<br>8. Shubh Karman<br>9. Bhargavi<br>10. Vasavi |
| Document Intelligence Platform - Converter & Rebranding | To be confirmed | 1. Owner<br>2. Riffat Wyne<br>3. Anubhav<br>4. Anshita<br>5.<br>6.<br>7.<br>8.<br>9.<br>10. |
| Document Intelligence Platform - Draft Generator & Automated Pre-Review | To be confirmed | 1. Owner<br>2.<br>3.<br>4.<br>5.<br>6.<br>7.<br>8.<br>9.<br>10. |
