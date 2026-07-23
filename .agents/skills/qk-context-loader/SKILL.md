---
name: qk-context-loader
description: Tải context và vẽ dependency graph chính xác trước khi code — ngăn hallucination kiến trúc (Context Assembly Engine EDAOS Architecture)
version: 2.0.0
domain: system
type: context_assembly_engine
edaos_core_requirement: ">=1.0.0"
capabilities_required:
  - code.ast
  - code.references
---

# 🧠 qk-context-loader (v2.0 Native EDAOS Context Assembly Engine)

> [!IMPORTANT]
> **Nhiệm vụ cốt lõi**: Trích xuất Dependency Graph, nạp ngữ cảnh tối thiểu cần thiết, ngăn tràn Token Budget và loại bỏ ảo giác (Hallucination).
> Skill này kết nối trực tiếp với `15-memory-governance-lifecycle.yml` và `13-execution-journal-contract.yml` để chỉ nạp các dữ liệu đã được xác minh (`ValidatedInsight`).

---

## 1. Hợp Đồng Ngữ Cảnh (Context Assembly Contract)

### Consumes
* `TargetScope`: Danh sách file/module mục tiêu.
* `MemoryStore`: Ký ức bài học từ `edaos.learning.*`.

### Produces
* `DependencyGraph`: Sơ đồ phụ thuộc trực tiếp 1-hop của module.
* `AssemblyContext`: Ngữ cảnh code gọn gàng tuân thủ Token Budget.
