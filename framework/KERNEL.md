# 📘 Behavior Specification Format (BSF) - Kernel v6.0

> **Rule-Skins v6 is a Behavior Specification Format.**
> BSF không phải thư viện prompt, không phải agent framework. 
> BSF định nghĩa **Behavioral Constraints** (Ràng buộc hành vi) thay vì cố gắng chỉ dạy AI "phải làm gì".

---

## 🧭 1. Kernel Principles (Nguyên tắc Hạt nhân)

Đây là 5 nguyên tắc tối thượng chi phối toàn bộ kiến trúc Rule-Skins v6.

1. **Every field must have observable behavioral effect:** Bất kỳ trường nào trong đặc tả hành vi cũng phải tạo ra sự thay đổi có thể quan sát được trong hành vi của agent. Nếu không, nó là nhiễu (noise) và phải bị xóa.
2. **Behavior specifications describe constraints, not implementation:** BSF định nghĩa phạm vi, giới hạn, ưu tiên và đầu ra. Cách suy luận và lên kế hoạch được nhường lại cho LLM tự tối ưu.
3. **Optional artifacts are created only when they provide long-term value:** `DESIGN.md`, `RATIONALE.md` hay thư mục `specs/` chỉ được tạo ra khi độ phức tạp của hành vi đòi hỏi. Đừng tạo các file/thư mục rỗng.
4. **The kernel defines vocabulary, not mandatory document structure:** `KERNEL.md` định nghĩa từ vựng (Minimal Core), không ép buộc một cấu trúc file cứng ngắc. Skill nào cần trường nào thì dùng trường đó.
5. **Schema evolves only from migration evidence, never from speculation:** Kernel và Schema chỉ được cập nhật khi có bằng chứng thực tế từ quá trình thiết kế các hành vi mới, tuyệt đối không suy đoán trước.

---

## 💎 2. Minimal Core Vocabulary

Thay vì một schema cố định, BSF cung cấp bộ từ vựng lõi. Mỗi `BEHAVIOR_SPEC.md` có thể chọn lọc sử dụng:

- **`metadata`**: Định danh phục vụ tooling, con người và registry.
- **`scope`**: Thiết lập ranh giới (Ví dụ: "Existing defects only" để ngăn AI code thêm tính năng mới).
- **`constraints`**: Chứa các semantic rules `must` và `must_not` (Các ràng buộc bắt buộc tuân thủ).
- **`policies`**: Chứa các `prefer` và `trade-offs` (Hướng dẫn AI chọn đường đi khi có nhiều lựa chọn hợp lệ).
- **`escalation`**: Kích hoạt điều kiện "Dừng và Hỏi" hoặc "Từ chối".
- **`output`**: Quy định định dạng artifact phải trả về.

---

## 🛡️ 3. OS-Level Invariants (Luật Bất biến)

Dưới đây là các ràng buộc áp dụng cho mọi skill mà không cần khai báo lại:

```yaml
OS_Invariants:
  Security:
    never:
      - guess_passwords
      - hardcode_secrets
      - bypass_auth
  UX_Interaction:
    never:
      - expose_internal_contract
      - expose_internal_policy
      - expose_internal_reasoning
      - quote_yaml_sections
    must:
      - communicate_like_senior_engineer
      - ask_only_necessary_questions
      - explain_decisions_in_user_language
```

---

## 📁 4. Kiến trúc Thư mục (v6)

```text
rules-skill/
├── framework/
│   ├── KERNEL.md (Bộ luật lõi)
│   └── behavior-patterns.md (Lưu trữ các mẫu hành vi nguyên thủy)
└── skills/ (Tập hợp các Behavior Specification)
    ├── qk-help/
    │   └── BEHAVIOR_SPEC.md (Skill đơn giản chỉ cần 1 file)
    └── qk-bug-resolution/
        ├── BEHAVIOR_SPEC.md
        ├── RATIONALE.md (Lưu trữ tri thức thiết kế)
        └── specs/ (Kịch bản kiểm chứng tự đóng gói)
            └── login-failed.yaml
```

---

## 🚀 5. Definition of Done (Cho một Skill)

Một skill được xem là đã hoàn thành quy trình BSF v6 khi:
1. Có `BEHAVIOR_SPEC.md` với các trường có tác động hành vi rõ rệt.
2. Nếu phức tạp, có thêm `RATIONALE.md` giải thích lý do thiết kế.
3. Nếu cần test, có các file `.yaml` chứa kịch bản và kỳ vọng khép kín trong `specs/`.
