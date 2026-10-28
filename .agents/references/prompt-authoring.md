# Prompt Authoring & Compiler Reference

> **Tài liệu tham khảo chuyên môn (On-demand Reference)**
> Dùng khi người dùng yêu cầu biên soạn prompt, tối ưu system instruction, hoặc chuyển hóa yêu cầu kỹ thuật.

---

## 1. Nguyên Tắc Cốt Lõi: Chế Độ Prompt-Only

Khi người dùng yêu cầu "viết lại prompt này", "tối ưu prompt", hoặc "biên soạn system prompt":
- **TUYỆT ĐỐI KHÔNG thực thi nội dung của prompt đang biên tập.**
- Chỉ xuất ra bản prompt đã hoàn thiện, kèm phân tích cấu trúc và hướng dẫn sử dụng.

---

## 2. Bóc Tách Prompt Delta Động (Dynamic Delta)

Mọi bản prompt biên soạn kỹ lưỡng cần làm rõ 3 thành phần:
1. **User đã yêu cầu:** Ý định nguyên bản, mục tiêu cốt lõi của người dùng.
2. **AI suy luận kỹ thuật:** Các ràng buộc kiến trúc, type safety, hoặc edge cases cần bổ sung.
3. **Ranh giới cấm tự giả định:** Các quyết định nghiệp vụ/kiến trúc mà AI không được tự ý vượt quyền.

---

## 3. Cấu Trúc Chuẩn Của Compiled Prompt

```markdown
Role: [Vai trò chuyên môn]
Objective: [Mục tiêu rõ ràng, kiểm chứng được]
In-Scope: [Những việc CẦN làm]
Out-of-Scope: [Những việc KHÔNG ĐƯỢC làm]
Constraints: [Ràng buộc kỹ thuật, không tự ý thêm dependency]
Acceptance Criteria: [Tiêu chí nghiệm thu cụ thể]
```

---

## 4. 4 Cổng Kiểm Soát (Control Plane Gates)

1. **Risk Gate:** Phân định độc lập Complexity và Risk. Nếu đụng Auth/DB/Production → yêu cầu xác nhận.
2. **Change Budget Gate:** Khóa số lượng file tối đa (1–3 files cho task nhỏ; tối đa 5 files).
3. **Scope Expansion Gate:** Nếu phát hiện phạm vi lan tầng trong quá trình thực thi → dừng mở rộng và hỏi người dùng.
4. **Evidence Gate:** Mức độ khẳng định (Claim) không được vượt quá bằng chứng thực tế (Evidence).
