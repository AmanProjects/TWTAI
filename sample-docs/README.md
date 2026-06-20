# Sample Docs

Practice documents for the **Tech Writer's Tribe** training. Use these files to run the Skills you build in **Module 3 (Prompt Engineering)** and **Module 4 (Skill Patterns)**.

The main file, `orders-api.md`, is an API reference with **intentional issues** seeded in. Your skills should find — and in some cases fix — them.

## How to use it

| Module | Pattern | Try this |
|--------|---------|----------|
| 3 | Reviewer (RTCCO) | `/check-api-doc sample-docs/orders-api.md` — report missing sections |
| 4 | Reviewer | `/check-style sample-docs/orders-api.md` — flag style-guide violations |
| 4 | Transformer | `/active-voice sample-docs/orders-api.md` — rewrite passive → active |
| 4 | Generator | `/scaffold-api-doc sample-docs/orders-api.md` — rebuild the missing sections |
| 4 | Analyzer | `/doc-coverage sample-docs/orders-api.md` — list documentation gaps |

The team style guide lives at `sample-project/test-docs/style-guide.md`. A clean reference example is `sample-project/test-docs/good-api-doc.md`.

## Seeded issues (answer key — instructors only)

`orders-api.md` is missing or breaking the following. Compare your skill's output against this list.

**Missing required sections** (per style guide → API Documentation Requirements):
- No **HTTP method and path** (is it `POST /orders`?)
- No **Authentication** section
- No **error codes**
- No **rate limits**
- Response has no schema, field table, or real example

**Incomplete parameters:**
- No types, no required/optional status, no real descriptions
- Parameter names are not in `backticks`

**Style-guide violations:**
- **Title Case heading** ("Create A New Order") — should be sentence case
- **Passive voice** ("will be used", "is returned by the endpoint")
- **Future tense** ("will be used", "will be fired")
- **Run-on sentence** in the description (well over 25 words)
- **Undefined jargon** ("idempotency", "webhook") used without definition
- Vague instruction ("pass the right values")

**Accuracy / example problems:**
- The `curl` example uses `GET` semantics for a create (should be `POST` with a body)
- The example does not match the parameters listed
