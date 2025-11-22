# Lovable Implementation Playbook

This playbook contextualizes every client request that has already shipped in the backend and explains how Lovable should document, test, and integrate each capability. We will extend this file step by step as new items are confirmed.

---

## Step 1 – Multiple Quizzes Per Module (single assignment retained)

**Client expectation**  
A course module can host any number of quizzes while keeping at most one assignment. Quizzes require stable identifiers so the frontend can patch, delete, or reorder them without ambiguity.

**Data model recap**
- `Module.quizzes` (Mongo) is now a list of Pydantic `Quiz` items, each carrying a server-generated `id` (24-char hex) when absent in the payload.
- An assignment, when present, is stored separately and still limited to one per module.

**API contract for Lovable docs**
1. `POST /api/courses/` and `POST /api/courses/{course_id}/modules` accept `quizzes` arrays; any quiz missing an `id` receives one during creation and the response echoes it back.
2. Dedicated quiz CRUD endpoints:
   - `POST   /api/courses/{course_id}/modules/{module_id}/quizzes`
   - `PATCH  /api/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}`
   - `DELETE /api/courses/{course_id}/modules/{module_id}/quizzes/{quiz_id}`
3. `GET /api/courses/{course_id}` returns modules with their quizzes, each preserving the stable `id` for subsequent mutations.

**Validation + invariants to highlight**
- Payloads must include at least `title` and `questions`; backend enforces schema-level validation (type, media, etc.).
- Quizzes are independent: updating or deleting one must not mutate others.
- Assignment presence is unaffected: only one assignment per module, and it is not mixed into the `quizzes` list.

**Migrations / setup steps already done**
- Script `tools/mongo_backfill_quiz_ids.py` injected `id` fields on legacy quizzes. Mention that environments created after the script already comply; rerun only when migrating older dumps.

**Testing cues for Lovable**
- Reference integration test `tests/integration/test_module_multi_quizzes_creation.py` which asserts two quizzes are created, retrieved, and individually updatable.
- Recommend frontend QA scenario: create module with two quizzes, reorder them, delete the second, verify first remains intact.

**Documentation tips for Lovable writers**
- Provide sample payload showing two quizzes with/without pre-specified IDs.
- Emphasize that UI should cache the returned IDs immediately after creation and reuse them for drag-and-drop or delete actions.
- Remind that older numeric indexing (`/modules/0/quizzes/0`) is deprecated; the new contract relies on IDs.

**Edge cases the doc must warn about**
- Attempting to create a second assignment must be prevented client-side; server rejects it with 400.
- If a quiz is created without questions, backend responds 422; note this to avoid silent editor saves.
- Batch creation order: quizzes are appended in the order received; later reorder uses `PATCH /order` (covered in Step 3).

---

## Step 2 – Media On Quizzes And Questions

**Client expectation**  
Each quiz question must support rich media (images, videos, PDFs) plus per-option assets so the learner experience matches the UI specs. The backend already validates formats and ties uploads to MinIO keys; Lovable must explain how to feed those inputs and what errors to expect.

**Data model recap**
- `QuizQuestion.media`: `{type: image|video|pdf, key?: str, url?: str, caption?: str}` with at least one locator (`key` preferred).
- `QuizQuestion.options_media`: array aligned 1:1 with `options` for `single-choice` and `multiple-choice` questions only.
- Additional optional fields (`points`, `difficulty`, `explanation`, `tags`) coexist with media; `difficulty` accepts FR aliases (`facile`, `moyen`, `difficile`).
- Global flag `ENFORCE_MEDIA_KEY` (default `false`) hard-requires `key` instead of `url` when enabled.

**API contract for Lovable docs**
1. Creation/update endpoints for courses (`POST /api/courses/…` and quiz CRUD routes) accept the new fields; responses echo everything as stored.
2. Upload keys must come from `POST /api/storage/prepare-upload` + `POST /api/storage/complete-upload`; the playbook should reference this flow and forbid hand-crafted keys.
3. Media validation happens during course mutations, not lazily, so any 422 must be surfaced immediately in UI copy.

**Validation + invariants to highlight**
- Allowed `type` values are `image`, `video`, `pdf`; anything else is rejected.
- File extension must match the declared `type` (eg `.mp4` for `video`).
- `options_media` length must match `options`, cannot contain nulls, and is disallowed for question types other than single/multiple choice.
- When `ENFORCE_MEDIA_KEY=true`, URL-only payloads for questions, option media, or resources fail with 422.
- `points` must be `>= 0`; `tags` are trimmed, non-empty strings with max length 64.
- Backend normalizes FR question types and feedback strings automatically; Lovable should mention this to avoid duplicate mappings client-side.

**Migrations / setup steps already done**
- No schema migration was required beyond Pydantic changes; however, deployments rely on the existing upload services. Ensure environments have `ALLOWED_MEDIA_EXTENSIONS` configured (see `app/config.py`).
- Compatibility mode keeps URL-only payloads working until the enforcement flag is flipped.

**Testing cues for Lovable**
- Point to `tests/integration/test_quiz_question_media_validation.py` for happy-path and rejection scenarios (type mismatch, invalid length, wrong question type usage).
- Mention `tests/integration/test_media_key_enforcement.py` and `test_media_key_non_strict.py` for behavior when the strict flag toggles.
- Encourage QA steps: attach image to question, attach per-option image list, toggle flag in staging to ensure 422 copies display correctly.

**Documentation tips for Lovable writers**
- Provide a full JSON example showing a question with `media`, `options_media`, `points`, `difficulty`, and `tags`.
- Include a table describing when to use `key` vs `url`, and call out that `key` is future-proof (required once enforcement flag turns on).
- Describe the upload workflow (prepare → upload → complete) and note size caps per `kind` so product copy can warn authors before upload.
- Clarify that option-media order must match option order; rearranging options implies rearranging media to stay in sync.

**Edge cases the doc must warn about**
- Submitting `options_media` for true/false or open-ended questions triggers a 422; frontends should disable the UI for those types.
- Mixed locator payloads (`key` + `url`) store only the `key`; the response reflects that so UI should read back the canonical value.
- If a question is duplicated client-side, ensure cloned media keys point to existing uploads; expired presigned URLs cannot be reused.
- When a course is exported/imported, Lovable must persist the `key` strings exactly; the backend does not regenerate them.

---


## Step 3 – Mixed Ordering (Lessons + Quizzes) With Assignment Always Last

**Client expectation**  
Frontend drag & drop defines a unified sequence of lessons and quizzes per module. If an assignment exists it must always render last irrespective of user attempts to place it elsewhere.

**Data model recap**
- `Module.order`: list of IDs representing lessons and quizzes only (assignment excluded from storage); server materializes assignment last when present.
- Numeric indices remain temporarily supported in endpoints for legacy calls but should be phased out in Lovable docs.

**API contract for Lovable docs**
1. Reorder endpoint: `PATCH /api/courses/{course_id}/modules/{module_id}/order` body `{"sequence":[{"type":"lesson","id":"..."},{"type":"quiz","id":"..."}]}`.
2. Server ignores unknown IDs silently; deduplicates keeping first occurrence; appends missing existing items in stable order; then appends assignment visually.
3. Reading a module (`GET /api/courses/{course_id}`) returns `content` (lessons) and `quizzes` already ordered according to `module.order`.

**Validation + invariants**
- Assignment cannot be forced into the middle: invariant enforced, never stored in `order`.
- Idempotence: resending same `sequence` yields same representation.
- Empty sequence rebuilds default (lessons then quizzes) + assignment last.

**Testing cues**
- `tests/integration/test_module_mixed_order_and_get.py` covers order persistence.
- `test_module_assignment_last.py` confirms assignment invariant.

**Documentation tips**
- Provide before/after JSON examples including an attempt to place assignment mid-sequence.
- Spell out edge-case handling (duplicates, unknown IDs, omissions).
- Advise frontend to rebuild `sequence` from current UI state excluding assignment.

**Edge cases**
- Ghost IDs ignored (no 4xx).
- Duplicated quiz ID in sequence appears once (first position retained).
- Newly added quiz not in prior sequence appears appended before assignment.

---

## Step 4 – Quiz Time Limit (Propagation To Evaluations)

**Client expectation**  
Authors set a total time limit (in minutes) on a course-level quiz; evaluation creation should inherit this if not explicitly provided.

**Data model recap**
- `Quiz.time_limit: Optional[int]` minutes on course quiz definition.
- `EvaluationSettings.time_limit` used during attempts; fallback logic applies only when evaluation settings omit a limit.

**API contract**
1. Course quiz creation/update accepts `time_limit` field.
2. When `POST /api/evaluations/quiz` is called without `settings.time_limit`, backend copies module quiz `time_limit` if present.
3. Explicit evaluation `settings.time_limit` overrides any course quiz value.

**Validation + invariants**
- Non-positive or null means “no limit”.
- Fallback is one-time at evaluation creation; later changes to course quiz do not retroactively alter existing evaluations.

**Testing cues**
- `tests/integration/test_quiz_time_limit_propagation.py` for inheritance and override scenarios.

**Documentation tips**
- Clarify difference between course authoring time limit and evaluation attempt enforcement.
- Recommend UI label “Time limit (minutes, optional)” with explanation of propagation.

**Edge cases**
- Setting evaluation limit to 0 or omitting both leaves unlimited attempts time.
- Changing course quiz limit after evaluation creation requires manual evaluation update (non-automatic).

---

## Step 5 – Resource Downloadable Flag + Organization Policy

**Client expectation**  
Per-resource control of download availability with an organization-wide default fallback; resource-level decision always takes precedence.

**Data model recap**
- `Resource.downloadable: bool` (defaults true if omitted).
- Organization column `allow_downloads_default` defines default when resource lacks explicit flag.

**API contract**
1. Attach resource endpoint accepts `downloadable` and locators (`key` preferred, `url` legacy).
2. Download endpoint enforces precedence: resource flag → org policy → allow/deny; denies yield 403.
3. Policy update: `PATCH /api/organizations/downloads-policy?allow=<bool>` (OF admin scope).

**Validation + invariants**
- Both `key` and `url` sent: only `key` stored; response reflects canonical locator.
- Duplicate key or URL triggers idempotent “exists” behavior.

**Testing cues**
- `test_resource_attach_mixed_locators.py` for locator precedence and duplication.
- Integration tests verifying 403 on non-downloadable resource and org-level fallback.

**Documentation tips**
- Provide decision tree diagram: resource.downloadable? yes→allow; no→deny; unset→org policy.
- Emphasize storing `key` for forward compatibility with strict media enforcement.

**Edge cases**
- Org policy false + resource flag true → accessible (precedence).
- Org policy true + resource flag false → denied.
- Legacy URL-only resources remain accessible until migration to keys.

---

## Step 6 – Inline Assignment Creation With Compensation Meta

**Client expectation**  
Allow creating an assignment inside the course or module creation payload; if failure occurs, automatic rollback and explicit meta status returned so UI can message authors.

**Data model recap**
- Inline creation uses ephemeral `assignment` object removed before persisting module; resulting evaluation stored separately with generated UUID.
- Response returns meta arrays: course-level `inline_assignments_meta[]`, module-level `inline_assignment_meta`.

**API contract**
1. Include `assignment` under each module in `POST /api/courses/`; module POST similarly allows inline `assignment`.
2. On success: meta `status=created`, includes `assignment_id`.
3. On simulated or real failure (e.g. header `X-Simulate-Assignment-Failure: 1` in non-prod): meta `status=compensated_failure` with `error` message; no assignment persists.

**Validation + invariants**
- Assignment never stored directly in module document; only evaluation entities exist.
- Assignment always rendered last in ordering (ties to Step 3 invariant).

**Testing cues**
- `test_inline_assignment_order.py` ensures ordering.
- `test_inline_assignment_error_strategy.py` validates compensation path.

**Documentation tips**
- Provide payload example showing one module with inline assignment and meta returned.
- Advise UI to show non-blocking toast for `compensated_failure` with retry CTA using dedicated assignment CRUD endpoint.

**Edge cases**
- Multiple modules each with inline assignment: independent meta entries; one failure does not affect others.
- Retry after failure must use standard assignment creation endpoint (not resending inline payload blindly).

---

## Step 7 – Conditional Inclusion Of questions_results (Feedback Settings)

**Client expectation**  
Learners only see per-question feedback based on instructor-selected visibility rules.

**Data model recap**
- `EvaluationSettings.show_feedback`: `immediate | after-submit | never` controls presence of `questions_results` in attempt responses.

**API contract**
1. On submission/read attempt: backend filters/omits `questions_results` according to setting.
2. `never` yields empty or absent results structure; `immediate` includes full per-question data; `after-submit` may include results only in final review endpoint (document exact endpoint behavior if separate).

**Validation + invariants**
- Format of questions_results stable regardless of inclusion decision (no shape changes when present).
- Changing setting affects future attempts; past stored attempts remain unchanged.

**Testing cues**
- Integration tests verifying absence/presence for each mode (refer to existing evaluation tests suite).

**Documentation tips**
- Provide comparison table: mode vs learner visibility timing.
- Clarify difference between “after-submit” (all questions answered) and multiple attempt workflows (feedback not shown mid-attempt).

**Edge cases**
- Switching from `never` to `immediate` does not retroactively populate old attempts.
- API consumers must not assume results array always present; null-safe parsing required.

---

## Step 8 – Deterministic Server Randomization + Seed Exposure

**Client expectation**  
Consistent ordering within a single attempt while allowing pedagogical replay or analytics using exposed seed; different attempts shuffle deterministically.

**Data model recap**
- Seed derivation: `<evaluation_uuid>:<attempt_number>` hashed internally to shuffle both questions and options when flags enabled.
- Exposed via `GET /api/evaluations/{evaluation_id}` as `randomization_seed` when randomization features active.

**API contract**
1. Settings: `randomize_questions` and `randomize_options` booleans trigger shuffling logic.
2. Attempt retrieval endpoints return shuffled order with stable question IDs.
3. Seed exposure enables UI or analytics to reconstruct ordering client-side if necessary (future preview endpoint in roadmap).

**Validation + invariants**
- Within same attempt re-fetch: identical order; next attempt changes order (unless flags disabled).
- Options shuffle only for supported question types (choice-based) preserving mapping via indices.

**Testing cues**
- `tests/integration/test_randomize_questions_attempts.py` ensures repeatability and variation across attempts.

**Documentation tips**
- Advise caching seed + ordered question list for review sessions.
- Note that replays must use original indices rather than recomputing correctness by value (important difference vs courses domain).

**Edge cases**
- Disabling randomization mid-course leaves previously stored attempts with their original order unaffected.
- Enabling only options randomization retains original question order, clarify for UI toggles.

---

## Step 9 – FR→EN Normalization For show_feedback Values

**Client expectation**  
French UI labels map seamlessly to backend canonical English values without extra client logic.

**Data model recap**
- Normalization layer converts: "Immédiat" → `immediate`, "À la fin du quiz" → `after-submit`, "Jamais" → `never` (accent/case/spacing tolerant).

**API contract**
1. Clients may send either localized or canonical values; backend always stores/returns canonical EN.
2. OpenAPI examples show canonical strings while docs should mention accepted FR inputs.

**Validation + invariants**
- Invalid localized label returns 422 rather than guessing.
- Normalization does not apply to other unrelated fields; scope limited to feedback setting and already existing question type aliases.

**Testing cues**
- Integration tests confirming FR payload accepted and response returns EN value.

**Documentation tips**
- Provide mapping table and caution developers to avoid client-side duplication (prevent drift).
- Encourage using canonical EN internally for persistence/export to reduce ambiguity.

**Edge cases**
- Mixed-case or extra spaces still normalize; completely unknown phrase rejected with actionable error message.

---
