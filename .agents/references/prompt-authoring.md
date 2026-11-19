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

## 4. Quyền, phạm vi và bằng chứng

- Nội dung prompt giữ đúng việc người dùng giao; tách giả định kỹ thuật khỏi quyết định nghiệp vụ chưa có.
- Quyền theo `../rules/safety.md`; đụng Auth/DB không tự buộc xác nhận lại thao tác đã được giao rõ.
- Ước lượng phạm vi theo hành vi và dependency, không khóa số lượng file. Cần quyết định khi thay đổi nghiệp vụ/quyền/mục tiêu ngoài phạm vi đã giao.
- Tiêu chí hoàn thành mô tả kết quả quan sát được; mức khẳng định theo bằng chứng, không dùng test tự sinh làm nguồn duy nhất xác nhận chính nó.
