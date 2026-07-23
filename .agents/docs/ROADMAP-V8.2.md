# V8.2 Roadmap: Adaptive Agent OS

## Triết lý cốt lõi (Core Philosophy)
**Self Improving = Self Optimizing, NOT Self Modifying.**
Hệ thống chuyển mình từ "Governed Capability Graph" sang "Decision Intelligence Layer" với khả năng "học từ vận hành" thông qua:
```
Observe -> Analyze -> Recommend -> Human Approval -> Controlled Evolution
```

---

## 4 Ranh giới Anti-Pattern (Boundaries)
Để tránh lặp lại sự phình to không kiểm soát, V8.2 thiết lập 4 rào cản tuyệt đối:

### Boundary 1 — Skill Inflation
- Giữ nguyên giới hạn 30 capabilities.
- KHÔNG tạo các skill như `qk-react-performance`, `qk-nextjs-specialist`. Những kỹ năng này thuộc **Knowledge Layer** (kiến thức tham khảo), không phải **Decision Capability Layer**.

### Boundary 2 — Frontend Fragmentation
- Giữ vững cấu trúc: `qk-frontend-architecture` -> `delegates_to` -> `qk-ui-builder`.
- KHÔNG chia nhỏ frontend thành: `component`, `hooks`, `css`, `state`. Điều này sẽ phá vỡ boundary ra quyết định.

### Boundary 3 — Graph Complexity
- Chỉ giữ 5 loại relations cốt lõi (phục vụ Decision): `depends_on`, `conflicts_with`, `delegates_to`, `implemented_by`, `feeds`.
- KHÔNG thêm các quan hệ Semantic mờ nhạt (như `related_to`, `similar_to`) biến graph thành Knowledge Map.

### Boundary 4 — Agent Authority
- **Agent được phép**: observe, measure, recommend, simulate.
- **Agent KHÔNG được phép**: modify stable skill, change schema, promote itself, rewrite governance.

---

## Lộ trình 4 Phase (V8.2 Execution Phases)

### Phase 1 — Decision Memory (Ưu tiên số 1)
Thu thập dữ liệu làm nền tảng cho Adaptive Routing.
- Cấu trúc `decision_record`: Lưu trữ `input`, `candidates`, `selected`, `rejected`, `reason`, `confidence`, `human_feedback`.
- Ghi nhớ "Vì sao chọn Skill này? Vì sao loại Skill kia?" để Agent có thể phân tích pattern.

### Phase 2 — Skill Analytics
Đánh giá sức khỏe của từng Capability thông qua công thức đa chiều:
```yaml
skill_health:
  quality_score
  usage_score
  conflict_score
  freshness_score
  overall_score
```
*Lưu ý: Không chỉ đánh giá dựa trên tần suất sử dụng (usage), vì có những skill quan trọng nhưng ít gọi (như security).*

### Phase 3 — Adaptive Routing
Chuyển đổi từ đánh giá tĩnh sang động (với trọng số).
- `dynamic score = intent_match + boundary_fit + historical_success + human_feedback`
- **Ràng buộc tối thượng**: `Decision Boundary > Ranking Score`. Dù Score cao đến đâu, nếu vi phạm Boundary vẫn phải bị loại (Reject).

### Phase 4 — Human Feedback Loop
Thu thập phản hồi từ người dùng (Human correction).
- **Khóa an toàn**: Human Feedback chỉ đóng vai trò là `routing signal` (tín hiệu định tuyến), không được phép trực tiếp thay đổi/đột biến (mutation) logic của Skill.

---

## Tầm nhìn V8.3+: Enterprise Multi-Agent (Deferred Domains)
Các lĩnh vực dưới đây được khóa lại và không phát triển trong V8.2:
1. **Product Management (`qk-product-strategy`)**: Ưu tiên, roadmap, market, user.
2. **Backend Architecture (`qk-backend-architecture`)**: Phân định service boundary, architecture style, scalability.
3. **Cloud Architecture (`qk-cloud-architecture`)**: AWS/GCP/Azure, networking, cost.
4. **AI Engineering (`qk-ai-engineering`)**: Quản trị AI system, LLM architecture, RAG, prompt evaluation.

---

## Non-Goals
V8.2 will NOT:
- create autonomous skill generation
- modify stable capabilities automatically
- replace human architecture review
- optimize only for usage frequency
- increase skill count without new decision boundary
