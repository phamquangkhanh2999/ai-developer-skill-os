---
# ── Identity ───────────────────────────────────────────────
name: qk-ai-builder
version: 9.2.0
status: stable
description: "Thiết kế và implement AI Agent hoặc RAG pipeline với eval criteria bắt buộc. Dùng skill này khi user nhắc đến: build ai, rag pipeline, prompt engineering, viết prompt, thiết kế agent, llm, vector database, embedding, retrieval, chatbot, ai logic, tạo skill — kể cả khi chỉ nói \"muốn AI trả lời từ tài liệu của mình\"."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - ai-integration
  - agent-behavior

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "build ai"
  - "rag pipeline"
  - "prompt engineering"
  - "viết prompt"
  - "thiết kế agent"
  - "llm"
  - "vector database"
  - "embedding"
  - "retrieval"
  - "chatbot"
  - "ai logic"
  - "tạo skill"


# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-system-evolution

knowledge_scope:
  owns:
    - agent-architecture
    - skill-generation
  references:
    - architecture
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: feature

selection:
  priority: high
  confidence_threshold: 0.85

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: high
latency: slow
risk: high
side_effects: edit_files
produces: [code, schema]
consumes: [user-description]

token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-ai-builder — AI Integration Designer

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm thiết kế và hiện thực hóa AI Agent, RAG pipelines, prompt systems và eval criteria. Cam kết chống hallucination, tối ưu hóa token budget, quản lý context window và bảo vệ dữ liệu nhạy cảm.

---

## Preconditions

Trước khi triển khai bất kỳ hệ thống AI nào, AI BẮT BUỘC kiểm tra:

- [ ] Xác định AI stack từ `.agents/DEV_PROFILE.md` (LLM provider, Vector DB, Framework như LangChain/LlamaIndex/Vercel AI SDK).
- [ ] Xác định rõ Evaluation criteria: Tiêu chí đo lường độ chính xác (Relevance, Faithfulness, Hallucination rate).
- [ ] Kiểm tra chính sách dữ liệu: Có dữ liệu PII (thông tin định danh cá nhân) hoặc secrets cần sanitize trước khi gửi LLM không?
- [ ] Nếu không có phương án kiểm thử / eval criteria đo lường chất lượng AI:
  → **EXIT: BLOCKED**
  → Báo cáo user: Bắt buộc định nghĩa Eval criteria trước khi tiến hành code pipeline.

---

## Scope

✅ Skill này làm:
- Thiết kế luồng RAG (Chunking, Embedding, Vector Search, Re-ranking, Context Augmentation).
- Xây dựng Agent logic (Tool use, Function calling, Structured output, Memory loop).
- Tối ưu hóa System Prompt: Vai trò, nhiệm vụ, định dạng output (JSON schema/Markdown), guardrails.
- Xây dựng Eval suite và bộ test cases đánh giá định lượng câu trả lời của AI.
- Quản lý token budget, streaming response, và cơ chế fallback khi LLM timeout/rate-limit.

❌ Skill này KHÔNG làm:
- Huấn luyện hoặc fine-tune foundation models từ đầu (pre-training).
- Viết giao diện Frontend Chatbot hoàn chỉnh (→ `qk-ui-builder` hoặc `qk-api-consumer`).
- Quản lý hạ tầng GPU / Kubernetes cluster chạy model (→ `qk-devops-platform`).

---

## Execution Steps

### Step 1 — Architecture & Pipeline Design
```
Inputs:  Yêu cầu từ user, Data sources, DEV_PROFILE.md
Actions:
  - Lựa chọn mô hình: Direct prompting vs RAG vs Agentic tool calling.
  - Thiết kế chiến lược chia nhỏ dữ liệu (Chunk size, chunk overlap) và vector embedding.
  - Xác định schema cho Structured Output (JSON Schema / Zod).
Output: AI Architecture Specification
```

### Step 2 — Prompt Engineering & Guardrails
```
Inputs:  AI Architecture Specification
Actions:
  - Viết System Prompt có cấu trúc rõ ràng: Role, Capabilities, Boundaries, Output Format.
  - Thiết lập Guardrails: Khử jailbreak, cấm hallucination khi thiếu dữ liệu, lọc PII.
  - Thiết lập vài ví dụ minh họa (Few-shot learning) nếu cần chuẩn hóa logic phức tạp.
Output: Production-grade Prompt definitions
```

### Step 3 — Pipeline Implementation & Integration
```
Inputs:  Prompts, Schemas, AI SDK
Actions:
  - Code pipeline tích hợp LLM client với error handling, retry backoff và fallback logic.
  - Kết nối Vector store / Document retriever và reranker (nếu là RAG).
  - Tích hợp function calling và parse structured outputs an toàn.
Output: Functional AI Pipeline code
```

### Step 4 — Verification & Eval Execution
```
Inputs:  AI Pipeline, Test dataset
Actions:
  - Chạy eval test cases để đo lường: Faithfulness (độ trung thực), Retrieval recall, Latency.
  - Đảm bảo token cost nằm trong ngân sách cho phép.
Exit: SUCCESS nếu vượt qua các ngưỡng benchmark chất lượng đã cam kết.
```

---

## Prompt Template

AI đọc `DEV_PROFILE.md` để biết LLM, vector DB, và pipeline framework đang dùng.
Mô tả agent/pipeline cần build — AI thiết kế đúng kiến trúc, không generic.

```
Build:       [RAG pipeline / AI agent / prompt chain / eval suite / ...]
Mục đích:   [System này làm gì, cho ai dùng]
Input:       [User query / document / event / ...]
Output:      [Response format, citation style, action taken]
Constraints: [Latency budget, cost/query, context window limit, PII rules]
Eval:        [Thành công trông như thế nào — metric cụ thể]
```

---

### Ví dụ theo use case:

**RAG — Tài liệu nội bộ (OpenAI + pgvector + LangChain)**
```
Build:       RAG pipeline cho Q&A tài liệu nội bộ công ty
Mục đích:   Nhân viên hỏi về policy, quy trình, handbook — AI trả lời có citation
Input:       User question (text), corpus: 500 PDF files (~50k pages)
Output:      { answer: string, citations: [{doc, page, excerpt}], confidence: high|low }
Constraints: Latency < 3s, cost < $0.01/query, không trả lời ngoài corpus
Eval:        Faithfulness > 0.85, Answer relevance > 0.80, No hallucination on factual Q
```
→ AI thiết kế: chunking strategy (semantic vs fixed với overlap),
  embedding model (text-embedding-3-small vs large — cost vs quality),
  pgvector index type (ivfflat vs hnsw), retrieval pipeline (vector search → rerank),
  system prompt với grounding enforcement, citation extraction,
  eval harness (RAGAS metrics), fallback khi confidence thấp.

**Agentic — Tool-calling Agent (OpenAI + LangGraph)**
```
Build:       Customer support agent tự động xử lý refund requests
Mục đích:   Giảm ticket cho support team — tự xử lý 80% refund đơn giản
Input:       Customer message qua chat widget
Output:      Tự động: approve/reject refund, update order status, gửi email
             Escalate: chuyển human agent nếu case phức tạp
Constraints: Không approve refund > $500 tự động, log mọi quyết định,
             PII không được gửi sang LLM ngoài (dùng on-premise model)
Eval:        Accuracy > 95% trên refund eligibility, escalation rate < 20%,
             False approve rate = 0% cho orders > $500
```
→ AI thiết kế: tool definitions (check_order, process_refund, escalate_to_human),
  LangGraph state machine cho multi-turn conversation,
  guardrails cho financial limits (rule-based, không phụ thuộc LLM),
  audit trail cho mọi action, PII redaction trước khi gửi LLM,
  human-in-the-loop node, eval test cases với adversarial inputs.

**Prompt Engineering — Structured Output (Anthropic Claude)**
```
Build:       Pipeline extract thông tin từ hóa đơn PDF → JSON
Mục đích:   Tự động hóa nhập liệu kế toán — xử lý 1000 hóa đơn/ngày
Input:       PDF hóa đơn (scan hoặc digital), đa ngôn ngữ (VN, EN, JP)
Output:      { vendor, date, total, currency, lineItems: [], taxAmount, invoiceNumber }
Constraints: Accuracy > 99% trên digital PDFs, > 95% trên scanned,
             Latency < 5s/invoice, cost < $0.005/invoice
Eval:        Field-level accuracy per invoice type, error rate theo language
```
→ AI thiết kế: PDF parsing strategy (PyMuPDF vs vision model),
  structured output với JSON schema (tool_use / response_format),
  few-shot examples cho từng invoice format,
  confidence scoring per field, human review queue cho low-confidence,
  batch processing pipeline, cost tracking per document type,
  A/B test prompt versions.

**Eval Suite — Đánh giá AI system hiện có**
```
Build:       Eval pipeline cho RAG system đang chạy production
Mục đích:   Detect regression khi thay đổi prompt hoặc retrieval config
Input:       Golden dataset: 200 Q&A pairs có ground truth answers
Output:      Eval report: faithfulness, relevance, correctness per category,
             comparison vs baseline version
Constraints: Eval phải chạy trong CI/CD, kết quả trong < 10 phút
Eval:        Chính eval này cần được validate bằng human judgment sample
```
→ AI thiết kế: RAGAS framework setup, golden dataset format,
  LLM-as-judge prompt design (với rubric rõ ràng),
  metric thresholds cho CI gate (fail build nếu faithfulness < 0.80),
  regression detection (compare vs previous run),
  human calibration workflow cho judge prompts.
