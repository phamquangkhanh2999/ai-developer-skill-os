# Architecture Review Guide

Hướng dẫn đánh giá thiết kế kiến trúc, giúp xác định xem kiến trúc của mã nguồn có hợp lý và thiết kế có chuẩn xác hay không.

## Kiểm tra nguyên tắc SOLID

### S - Single Responsibility Principle (SRP - Nguyên tắc đơn trách nhiệm)

**Kiểm tra trọng tâm:**
- Class/Module này có chỉ duy nhất một lý do để thay đổi không?
- Các phương thức trong Class có cùng phục vụ cho một mục đích không?
- Nếu phải mô tả Class này cho một người không rành kỹ thuật, bạn có thể nói rõ trong một câu không?

**Dấu hiệu nhận biết (Code Smells):**
```text
⚠️ Tên Class chứa các từ mang tính chung chung như "And", "Manager", "Handler", "Processor".
⚠️ Một Class vượt quá 200-300 dòng code.
⚠️ Class có hơn 5-7 phương thức public.
⚠️ Các phương thức khác nhau thao tác trên các tập dữ liệu hoàn toàn khác nhau.
```

**Câu hỏi Review:**
- "Class này chịu trách nhiệm những việc gì? Có thể chia nhỏ được không?"
- "Nếu yêu cầu X thay đổi, những phương thức nào cần sửa? Nếu yêu cầu Y thay đổi thì sao?"

### O - Open/Closed Principle (OCP - Nguyên tắc đóng/mở)

**Kiểm tra trọng tâm:**
- Khi thêm tính năng mới, có cần phải sửa đổi code hiện tại không?
- Có thể thêm hành vi mới thông qua việc mở rộng (inheritance, composition) không?
- Có tồn tại quá nhiều câu lệnh `if/else` hoặc `switch` để xử lý các type (loại) khác nhau không?

**Dấu hiệu nhận biết:**
```text
⚠️ Chuỗi switch/if-else dài để xử lý các loại (types) khác nhau.
⚠️ Thêm tính năng mới đòi hỏi phải sửa đổi core class.
⚠️ Rải rác các lệnh kiểm tra kiểu dữ liệu (instanceof, typeof) khắp mọi nơi.
```

**Câu hỏi Review:**
- "Nếu muốn thêm một type X mới, chúng ta phải sửa những file nào?"
- "Khối lệnh switch này có phình to ra khi chúng ta có thêm type mới không?"

### L - Liskov Substitution Principle (LSP - Nguyên tắc thay thế Liskov)

**Kiểm tra trọng tâm:**
- Subclass (lớp con) có thể thay thế hoàn toàn cho Parent class (lớp cha) khi sử dụng không?
- Subclass có làm thay đổi hành vi dự kiến của các phương thức ở Parent class không?
- Subclass có throw ra các exception mà Parent class chưa từng khai báo không?

**Dấu hiệu nhận biết:**
```text
⚠️ Ép kiểu tường minh (Explicit casting).
⚠️ Phương thức ở Subclass ném ra lỗi `NotImplementedException`.
⚠️ Phương thức ở Subclass để trống hoặc chỉ có `return`.
⚠️ Nơi sử dụng Base class bắt buộc phải kiểm tra type cụ thể của nó.
```

**Câu hỏi Review:**
- "Nếu dùng Subclass thay cho Parent class, đoạn code gọi (caller) có cần phải thay đổi không?"
- "Hành vi của phương thức này trong Subclass có tuân thủ đúng contract của Parent class không?"

### I - Interface Segregation Principle (ISP - Nguyên tắc phân tách Interface)

**Kiểm tra trọng tâm:**
- Interface đã đủ nhỏ và tập trung chưa?
- Class implement (thực thi) có bị ép buộc phải code những phương thức mà nó không cần không?
- Client có phụ thuộc vào những phương thức mà nó không hề dùng tới không?

**Dấu hiệu nhận biết:**
```text
⚠️ Interface có hơn 5-7 phương thức.
⚠️ Class implement có các phương thức rỗng hoặc ném `NotImplementedException`.
⚠️ Tên Interface quá rộng (IManager, IService).
⚠️ Các Client khác nhau chỉ sử dụng một phần phương thức của Interface.
```

**Câu hỏi Review:**
- "Tất cả các phương thức của Interface này có thực sự được dùng bởi từng Class implement không?"
- "Có thể chia Interface lớn này thành các Interface nhỏ, chuyên biệt hơn không?"

### D - Dependency Inversion Principle (DIP - Nguyên tắc đảo ngược phụ thuộc)

**Kiểm tra trọng tâm:**
- Module cấp cao có phụ thuộc vào Abstraction (trừu tượng) thay vì Implementation (thực thi chi tiết) không?
- Có sử dụng Dependency Injection thay vì trực tiếp `new` Object không?
- Abstraction có được định nghĩa bởi Module cấp cao thay vì Module cấp thấp không?

**Dấu hiệu nhận biết:**
```text
⚠️ Module cấp cao trực tiếp `new` các Class cụ thể của Module cấp thấp.
⚠️ Import thẳng Class thực thi thay vì Interface/Abstract class.
⚠️ Cấu hình và chuỗi kết nối (connection strings) bị hardcode trong business logic.
⚠️ Rất khó để viết Unit Test cho một Class cụ thể.
```

**Câu hỏi Review:**
- "Các phụ thuộc (dependencies) của Class này có thể được mock khi viết test không?"
- "Nếu muốn đổi sang một Database/API khác, sẽ phải sửa bao nhiêu chỗ?"

---

## Nhận diện các Anti-patterns Kiến trúc

### Các Anti-patterns Chí mạng (Fatal)

| Anti-pattern | Dấu hiệu nhận biết (Signals) | Hệ quả |
|--------|----------|------|
| **Big Ball of Mud** | Không có ranh giới module rõ ràng, bất kỳ code nào cũng có thể gọi đoạn code khác. | Khó hiểu, khó sửa, khó test. |
| **God Object** | Một Class gánh quá nhiều trách nhiệm, biết quá nhiều, làm quá nhiều. | Coupling cao, khó tái sử dụng và test. |
| **Spaghetti Code** | Luồng điều khiển rối rắm, lạm dụng `goto` hoặc lồng (nesting) quá sâu, khó theo dõi đường thực thi. | Khó bảo trì. |
| **Lava Flow** | Code cổ đại không ai dám đụng vào, thiếu tài liệu và test. | Tích tụ nợ kỹ thuật (Tech Debt). |

### Các Anti-patterns Thiết kế (Design)

| Anti-pattern | Dấu hiệu nhận biết (Signals) | Lời khuyên |
|--------|----------|------|
| **Golden Hammer** | Dùng chung một công nghệ/design pattern cho tất cả mọi vấn đề. | Chọn giải pháp phù hợp với từng bài toán. |
| **Gas Factory (Over-engineering)** | Giải quyết vấn đề đơn giản bằng giải pháp phức tạp, lạm dụng Design patterns. | Tuân thủ YAGNI, làm từ đơn giản đến phức tạp. |
| **Boat Anchor** | Viết code "phòng hờ cho tương lai" nhưng hiện tại không dùng tới. | Xóa code không dùng, khi nào cần thì viết lại. |
| **Copy-Paste Programming** | Một logic xuất hiện ở nhiều nơi. | Đưa thành phương thức chung hoặc module chung. |

---

## Đánh giá Coupling (Độ kết dính) và Cohesion (Độ gắn kết)

### Các loại Coupling (Từ Tốt đến Xấu)

| Loại | Mô tả | Ví dụ |
|------|------|------|
| **Message Coupling** ✅ | Truyền dữ liệu qua tham số | `calculate(price, quantity)` |
| **Data Coupling** ✅ | Chia sẻ cấu trúc dữ liệu đơn giản | `processOrder(orderDTO)` |
| **Stamp Coupling** ⚠️ | Truyền cấu trúc dữ liệu phức tạp nhưng chỉ xài 1 phần | Truyền cả Object `User` nhưng chỉ dùng `name` |
| **Control Coupling** ⚠️ | Truyền cờ (flags) điều khiển hành vi | `process(data, isAdmin=true)` |
| **Common Coupling** ❌ | Chia sẻ biến toàn cục (global state) | Nhiều module cùng đọc/ghi chung một global state |
| **Content Coupling** ❌ | Truy cập trực tiếp vào bên trong module khác | Thao tác trực tiếp với private properties của class khác |

### Các loại Cohesion (Từ Tốt đến Xấu)

| Loại | Mô tả | Đánh giá |
|------|------|------|
| **Functional Cohesion** | Mọi thành phần cùng thực hiện MỘT nhiệm vụ duy nhất | ✅ Tốt nhất |
| **Sequential Cohesion** | Output của bước này là Input của bước sau | ✅ Tốt |
| **Communicational Cohesion** | Thao tác trên cùng một cấu trúc dữ liệu | ⚠️ Chấp nhận được |
| **Temporal Cohesion** | Các tác vụ thực thi cùng một thời điểm | ⚠️ Khá kém |
| **Logical Cohesion** | Có liên quan về mặt logic nhưng khác biệt chức năng | ❌ Kém |
| **Coincidental Cohesion** | Không hề có sự liên quan nào | ❌ Tệ nhất |

---

## Đánh giá Clean Architecture (Kiến trúc phân lớp)

### Cấu trúc các Lớp

```text
┌─────────────────────────────────────┐
│         Frameworks & Drivers        │ ← Lớp ngoài cùng: Web, DB, UI
├─────────────────────────────────────┤
│         Interface Adapters          │ ← Controllers, Gateways, Presenters
├─────────────────────────────────────┤
│          Application Layer          │ ← Use Cases, Application Services
├─────────────────────────────────────┤
│            Domain Layer             │ ← Entities, Domain Services
└─────────────────────────────────────┘
          ↑ Hướng phụ thuộc (Dependency Rule) CHỈ ĐƯỢC hướng vào trong ↑
```

### Quy tắc Phụ thuộc (Dependency Rule)

**QUY TẮC CỐT LÕI: Mã nguồn chỉ được phép phụ thuộc hướng vào lớp bên trong.**

```typescript
// ❌ VI PHẠM: Domain layer phụ thuộc vào Infrastructure
// domain/User.ts
import { MySQLConnection } from '../infrastructure/database';

// ✅ CHUẨN XÁC: Domain layer định nghĩa Interface, Infrastructure thực thi nó
// domain/UserRepository.ts (Interface)
interface UserRepository {
  findById(id: string): Promise<User>;
}

// infrastructure/MySQLUserRepository.ts (Implementation)
class MySQLUserRepository implements UserRepository {
  findById(id: string): Promise<User> { /* ... */ }
}
```

### Checklist Đánh giá
- [ ] Lớp **Domain** có dính líu gì tới các phụ thuộc bên ngoài (DB, HTTP, File system) không?
- [ ] Lớp **Application** có thao tác trực tiếp với DB hay gọi external API không?
- [ ] Lớp **Controller** có chứa Business Logic không?
- [ ] Có tồn tại việc gọi vượt lớp (VD: UI gọi thẳng Repository) không?

---

## Checklist Nhanh (5 phút review)

```markdown
□ Hướng phụ thuộc có chính xác không? (Lớp ngoài gọi lớp trong).
□ Có bị Dependency Cycle (phụ thuộc vòng tròn) không?
□ Business Logic cốt lõi đã tách bạch khỏi UI/Framework/Database chưa?
□ Có vi phạm nguyên tắc SOLID không?
□ Có các Anti-patterns lộ liễu nào không?
```

### Red Flags 🔴 (Bắt buộc sửa)
- God Object: Class lớn hơn 1000 dòng.
- Circular Dependency: A → B → C → A.
- Tầng Domain chứa thư viện của Framework.
- Hardcode Config / API Keys trong source code.
- Gọi External Services mà không qua Interface.
