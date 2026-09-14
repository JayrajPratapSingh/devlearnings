# Generative AI Complete Course — noob to pro, production grade

20 modules / 60 lessons (3 lessons per module — the pacing that worked well for the
Next.js course's later modules), bilingual EN/Hinglish, JS/TS: Node/Anthropic/OpenAI
SDKs, Vercel AI SDK, Zod for schema validation — reusing the platform's existing
`LessonExample.codeJs`/`codeTs` toggle (per Jay's explicit choice this session:
JS+TS over Python, since devprep-ide is a web-dev-first platform and this ties
directly into the Next.js course's own patterns).

Course record: slug `genai-complete`, icon `Sparkles` (lucide-react, added to
`courseIcons.tsx` — no single brand logo is honest across OpenAI/Anthropic/etc.,
same reasoning as Databases/DevOps), color `#6366F1` (indigo, unused by any other
course), level progresses beginner → advanced across the course, `order: 14`.

## Part I — Foundations
1. **What Generative AI Actually Is** — LLMs as next-token predictors, the
   transformer mechanism at a conceptual level (attention = "which prior tokens
   matter"), tokenization, context windows, why hallucination is structural (not
   a bug to patch), embeddings as the other core primitive.
2. **Talking to a Model via API** — Anthropic/OpenAI Node SDKs, chat completions,
   system/user/assistant roles, streaming vs non-streaming, temperature/top_p/
   max_tokens, token counting and basic cost math.
3. **Prompt Engineering Fundamentals** — zero-shot/few-shot, chain-of-thought,
   role/system prompting, JSON mode for structured output, prompt templates,
   why this is applied context design, not superstition.

## Part II — Building Real AI Features
4. **Streaming AI UI in a Web App** — Vercel AI SDK, `useChat`/`useCompletion`,
   Server-Sent Events under the hood, handling partial/incomplete JSON while
   streaming, abort/cancel, optimistic UI for a chat interface.
5. **Tool Calling & Function Calling** — defining tool schemas with Zod, the
   model deciding to call a tool, executing and returning results, multi-turn
   tool loops, validating model-produced arguments (never trust them blindly).
6. **Structured Outputs at Scale** — JSON-schema-constrained generation, tool-
   calling vs `response_format` for structured data, parsing reliably, retry-
   on-invalid-output strategies.
7. **Retrieval-Augmented Generation (RAG) Part 1** — embeddings deep-dive,
   chunking strategies (fixed-size vs semantic), why RAG exists (context limits,
   freshness, grounding against hallucination), cosine similarity.
8. **RAG Part 2 — Vector Databases in Production** — pgvector/Pinecone,
   indexing (HNSW/IVF conceptually), hybrid search (keyword + vector),
   re-ranking, a complete RAG pipeline end-to-end.
9. **Agents** — the ReAct loop (reason, act, observe), multi-step tool use,
   agent memory (short vs long-term), when a simple chain beats an agent.

## Part III — Production Concerns
10. **Cost, Latency & Model Selection** — token pricing math, picking the right
    model per task (fast/cheap vs slow/accurate), prompt caching, batching,
    streaming for perceived latency.
11. **Reliability, Retries & Guardrails** — hallucination mitigation, output
    validation, retry/fallback chains across providers, content moderation
    APIs, circuit breakers for AI calls.
12. **Security for AI Features** — prompt injection (direct + indirect via RAG
    content), jailbreak patterns, sanitizing untrusted content before it
    reaches a prompt, never treating model output as safe HTML/SQL/shell
    (ties back to the Next.js course's own XSS/injection modules), data
    exfiltration risks via tool calls.
13. **Rate Limiting & Abuse Prevention for AI Endpoints** — cost-based (not
    just request-count) rate limiting, detecting abuse patterns, per-user
    quotas, why AI endpoints need different rate-limiting math than a normal
    API.
14. **Evaluation & Testing Non-Deterministic Systems** — eval datasets,
    LLM-as-judge, regression testing prompts across model/prompt changes,
    golden datasets, human-in-the-loop review.

## Part IV — Advanced Capabilities
15. **Multi-modal AI** — vision (image understanding), audio (speech-to-text/
    text-to-speech), image generation APIs, combining modalities in one
    feature.
16. **Fine-tuning vs Prompting vs RAG** — the decision tree for which lever to
    pull, when fine-tuning genuinely helps vs wastes money, dataset prep
    basics, the fine-tuning workflow at a conceptual level.
17. **Open-Source & Local Models** — Ollama, running models locally, open vs
    closed model tradeoffs, self-hosting considerations, when local inference
    genuinely makes sense for a product.

## Part V — Shipping It
18. **Observability for AI Features** — tracing prompts/completions, logging
    structured AI events, drift detection over time, A/B testing prompts/
    models, cost dashboards.
19. **Deploying & Scaling AI Features** — edge vs serverless for AI routes,
    handling long-running generations (timeouts), queueing heavy workloads,
    assembling a complete streaming + RAG + tools chat feature end-to-end.
20. **Responsible AI & Production Launch Checklist** — bias/fairness
    considerations, transparency & AI-content disclosure, user consent,
    copyright/IP considerations for generated content, the final go-live
    checklist tying every module together (capstone).

## Verification approach

Runnable pieces (embeddings math, cosine similarity, chunking, JSON-schema
validation with Zod, rate-limiting logic, prompt-template rendering) get real
offline-executed code the same way the DSA/DevOps/Databases courses did.
Pieces that require a live API key (an actual model call, real streaming from
a real provider) are precise, clearly-marked prose/code that would work
against a real key, verified by mechanism and API shape rather than a live
call — same standard applied to DevOps M13-15/M20 and the Next.js course's
Stripe/Pusher modules.

## Progress

- [x] Course shell in seed.ts (`seedGenAiCourse`, Course record) — commit `f7d9ce3`
- [x] M1 What Generative AI Actually Is — 3/3 lessons, commit `f7d9ce3`
- [x] M2 Talking to a Model via API — 3/3 lessons, commit `ffd7edd`
- [x] M3 Prompt Engineering Fundamentals — 3/3 lessons, commit `b434a06`
- [x] M4 Streaming AI UI in a Web App — 3/3 lessons, commit `717c6a7`
- [x] M5 Tool Calling & Function Calling — 3/3 lessons, commit `dca3dcf`
- [x] M6 Structured Outputs at Scale — 3/3 lessons, commit `1aecb58`
- [x] M7 RAG Part 1 — Embeddings & Chunking — 3/3 lessons, commit `0e377c7`
- [x] M8 RAG Part 2 — Vector Databases in Production — 3/3 lessons, commit `59010ca`
- [x] M9 Agents — 3/3 lessons, commit `77c4ab4`
- [x] M10 Cost, Latency & Model Selection — 3/3 lessons, commit `9473096`
- [x] M11 Reliability, Retries & Guardrails — 3/3 lessons, commit `035d675`
- [x] M12 Security for AI Features — 3/3 lessons, commit `ce47536`
- [x] M13 Rate Limiting & Abuse Prevention for AI Endpoints — 3/3 lessons, commit `888060b`
- [x] M14 Evaluation & Testing Non-Deterministic Systems — 3/3 lessons, commit `2eb89db`

**Part III (Production Concerns) COMPLETE: M10-M14, 15/15 lessons.**
- [x] M15 Multi-modal AI — 3/3 lessons, commit `9e31a37`
- [x] M16 Fine-tuning vs Prompting vs RAG — 3/3 lessons, commit `15fbf94`
- [x] M17 Open-Source & Local Models — 3/3 lessons, commit `1dbd1a1`

**Part IV (Advanced Capabilities) COMPLETE: M15-M17, 9/9 lessons.**
- [ ] M18 Observability for AI Features
- [ ] M19 Deploying & Scaling AI Features
- [ ] M20 Responsible AI & Production Launch Checklist
