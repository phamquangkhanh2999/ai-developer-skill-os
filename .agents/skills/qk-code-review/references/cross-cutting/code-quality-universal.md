# Các Anti-Pattern Chất lượng Code Phổ quát (Universal Code Quality)

> Hướng dẫn nhận diện các anti-pattern về chất lượng code độc lập với ngôn ngữ, bao quát các chủ đề: Tái sử dụng code, Rò rỉ trừu tượng (Leaky abstraction), Phình to tham số (Parameter bloat), Câu lệnh điều kiện lồng nhau, Magic strings, TOCTOU, Cập nhật vô nghĩa (No-op update), v.v. Áp dụng cho mọi PR.

## Mục lục

- [Kiểm tra Tái sử dụng Code (Code Reuse)](#kiểm-tra-tái-sử-dụng-code)
- [Phình to Tham số (Parameter Bloat)](#phình-to-tham-số)
- [Rò rỉ Trừu tượng (Leaky Abstraction)](#rò-rỉ-trừu-tượng)
- [Lạm dụng Chuỗi (String Typing)](#lạm-dụng-chuỗi)
- [Điều kiện Lồng nhau (Nested Conditions)](#điều-kiện-lồng-nhau)
- [Biến thể Copy-Paste (Copy-Paste Variations)](#biến-thể-copy-paste)
- [Cập nhật Vô nghĩa (No-Op Updates)](#cập-nhật-vô-nghĩa)
- [Lỗi tương tranh TOCTOU (Race Conditions)](#lỗi-tương-tranh-toctou)
- [Thao tác quá rộng (Broad Operations)](#thao-tác-quá-rộng)
- [Trạng thái Dư thừa (Redundant State)](#trạng-thái-dư-thừa)
- [Checklist Chất lượng Chung](#checklist-chất-lượng-chung)

---

## Kiểm tra Tái sử dụng Code (Code Reuse)

Trước khi chấp nhận code mới, hãy tìm kiếm trong source code xem đã có các hàm tiện ích (utilities) dùng chung nào chưa.

### Tận dụng Utility có sẵn

```python
# ❌ Viết lại logic nối đường dẫn —— Trong project đã có sẵn PathBuilder
def get_config_path(name):
    base = os.environ.get("APP_ROOT", ".")
    return os.path.join(base, "config", name + ".json")

# ✅ Dùng PathBuilder đã có
def get_config_path(name):
    return PathBuilder.config(f"{name}.json")
```

```javascript
// ❌ Tự viết tay hàm debounce —— Project đã có lodash hoặc utils/debounce.ts
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// ✅ Import hàm utility có sẵn
import { debounce } from "@/utils/debounce";
```

**Checklist:**
- [ ] Hàm mới viết có bị trùng tên hoặc trùng chức năng với utility có sẵn không?
- [ ] Đoạn logic viết inline có thể thay thế bằng hàm dùng chung không?
- [ ] Đã ngó qua thư mục `shared/utils` chưa?

---

## Phình to Tham số (Parameter Bloat)

### Hàm có quá nhiều tham số

```python
# ❌ Cứ có yêu cầu mới là nhét thêm 1 tham số
def create_user(name, email, role, team, active, avatar_url, timezone):
    ...

# ✅ Nhóm thành DataClass / Config Object
@dataclass
class CreateUserParams:
    name: str
    email: str
    role: Role = Role.MEMBER
    team: str | None = None
    active: bool = True
    avatar_url: str | None = None
    timezone: str = "UTC"

def create_user(params: CreateUserParams) -> User:
    ...
```

```typescript
// ❌ Hàm nhận 6 tham số cứng (positional arguments)
function renderWidget(title: string, width: number, height: number, theme: string, collapsible: boolean, icon: string) { ... }

// ✅ Pattern Options Object
interface WidgetOptions {
  title: string;
  width?: number;
  height?: number;
  theme?: "light" | "dark";
  collapsible?: boolean;
  icon?: string;
}
function renderWidget(options: WidgetOptions) { ... }
```

**Checklist:**
- [ ] Hàm có từ 4 tham số trở lên không? Hãy đổi sang Options Object.
- [ ] Tham số mới thêm vào chỉ là một cái Cờ (Boolean flag)? Cân nhắc dùng Enum hoặc Strategy Pattern.
- [ ] Có tham số nào triệt tiêu nhau không? (Vd: `enable_x` và `disable_y`).

---

## Rò rỉ Trừu tượng (Leaky Abstraction)

### Để lọt chi tiết Implementation ra ngoài

```python
# ❌ Trả về Object của ORM —— Ép caller phải biết về thư viện SQLAlchemy
def get_users():
    return session.query(User).filter(User.active == True).all()

# ✅ Trả về Domain Object (DTO), giấu tịt lớp Database đi
def get_active_users() -> list[UserDTO]:
    rows = user_repo.find_active()
    return [UserDTO.from_row(r) for r in rows]
```

```typescript
// ❌ Component nhận trực tiếp cấu trúc của API Response
<UserCard user={apiResponse.data.results[0]} />

// ✅ Component chỉ nhận Domain Type, dùng Adapter để chuyển đổi
interface UserSummary {
  displayName: string;
  avatarUrl: string;
}
<UserCard user={adaptUser(apiResponse)} />
```

**Checklist:**
- [ ] Kiểu trả về (Return type) của hàm có làm lộ thư viện bên dưới không (ORM, HTTP Client, JSON format)?
- [ ] Component UI có bị dính chặt vào cấu trúc của hệ thống bên ngoài không?

---

## Lạm dụng Chuỗi (String Typing / Magic Strings)

### Dùng String trần trụi thay vì Enum/Constant

```python
# ❌ Magic strings rải rác khắp nơi, gõ sai chính tả là ăn lỗi
if status == "active": ...
if role == "admin": ...

# ✅ Gom thành Enum
class Status(StrEnum):
    ACTIVE = "active"
    SUSPENDED = "suspended"

if user.status == Status.ACTIVE: ...
```

```typescript
// ❌ Tên event bằng string —— Code editor không gợi ý, gõ sai không báo lỗi
emitter.emit("userCreated", data);
emitter.on("usercreated", handler); // BUG do gõ sai chữ C thành c

// ✅ Dùng Object Constant / Enum
const Events = {
  USER_CREATED: "userCreated",
} as const;
emitter.emit(Events.USER_CREATED, data);
```

**Checklist:**
- [ ] Có string nào dùng để đại diện cho Trạng thái (Status) / Loại (Type) mà chưa gom vào Enum không?

---

## Điều kiện Lồng nhau (Nested Conditions)

### Khối lệnh IF/ELSE lồng nhau sâu hoắm

```python
# ❌ Chuỗi Ternary (Toán tử 3 ngôi) dài dòng
label = (
    "Admin" if role == "admin" else
    "Manager" if role == "manager" else
    "Viewer" if role == "viewer" else
    "Unknown"
)

# ✅ Dùng Lookup Table (Dictionary / Map)
ROLE_LABELS = {
    "admin": "Admin",
    "manager": "Manager",
    "viewer": "Viewer",
}
label = ROLE_LABELS.get(role, "Unknown")
```

```python
# ❌ IF lồng 3 lớp (Arrow code / Hadouken code)
def process(order):
    if order is not None:
        if order.items:
            for item in order.items:
                if item.price > 0:
                    ...

# ✅ Early Return (Bảo vệ từ sớm)
def process(order):
    if not order or not order.items:
        return
    for item in order.items:
        if item.price <= 0:
            continue
        ...
```

**Checklist:**
- [ ] Toán tử 3 ngôi lồng nhau $\ge$ 2 lớp?
- [ ] IF/ELSE lồng nhau $\ge$ 3 lớp?
- [ ] Có thể thay thế bằng Lookup Table, Match/Switch, hoặc Early Return không?

---

## Biến thể Copy-Paste (Copy-Paste Variations)

### Các khối code giống hệt nhau, chỉ khác mỗi cái tên

```typescript
// ❌ Copy-paste handler, chỉ thay đổi cái URL
async function deletePost(id: string) {
  await fetch(`/api/posts/${id}`, { method: "DELETE" });
  router.push("/posts");
}
async function deleteComment(id: string) {
  await fetch(`/api/comments/${id}`, { method: "DELETE" });
  router.push("/comments");
}

// ✅ Parameter hóa (Truyền biến vào)
async function deleteResource(resource: string, id: string) {
  await fetch(`/api/${resource}/${id}`, { method: "DELETE" });
  router.push(`/${resource}`);
}
```

**Checklist:**
- [ ] Có $\ge$ 2 đoạn code y hệt nhau, chỉ khác mỗi biến/URL/chữ không? Đưa thành hàm chung có tham số đi.

---

## Cập nhật Vô nghĩa (No-Op Updates)

### Chọc vào State/DB ngay cả khi dữ liệu không đổi

```typescript
// ❌ Cứ mỗi 5 giây là setStatus một lần mặc kệ data có đổi hay không (khiến UI re-render)
useEffect(() => {
  const interval = setInterval(() => {
    fetch("/api/status").then(r => r.json()).then(setStatus);
  }, 5000);
  return () => clearInterval(interval);
}, []);

// ✅ Kiểm tra trước khi set
setStatus(prev => isEqual(prev, data) ? prev : data);
```

```python
# ❌ Vòng lặp liên tục update DB dù giá trị bằng y hệt cũ
for item in items:
    item.status = compute_status(item)
    session.commit()

# ✅ Chỉ update nếu có thay đổi (Dirty check)
for item in items:
    new_status = compute_status(item)
    if item.status != new_status:
        item.status = new_status
        session.commit()
```

---

## Lỗi tương tranh TOCTOU (Time-of-Check-to-Time-of-Use)

### "Kiểm tra trước - Làm sau" trong môi trường Đồng thời (Concurrency)

```python
# ❌ Kiểm tra file tồn tại rồi mới mở -> Nhỡ lúc mở file nó bị xóa rồi thì sao?
if os.path.exists(path):
    with open(path) as f:
        data = f.read()

# ✅ Cứ mở file đi, lỗi thì Bắt (Try/Catch)
try:
    with open(path) as f:
        data = f.read()
except FileNotFoundError:
    data = None
```

```python
# ❌ Lỗi kinh điển hệ thống ngân hàng: Kiểm tra số dư rồi mới trừ tiền (Không Atomic)
if account.balance >= amount:
    account.balance -= amount

# ✅ Bỏ vào Giao dịch (Transaction) hoặc Khóa (Lock)
with account.lock:
    if account.balance < amount:
        raise InsufficientFundsError()
    account.balance -= amount
```

---

## Thao tác quá rộng (Broad Operations)

### Lấy nguyên xe tải hàng trong khi chỉ cần 1 củ tỏi

```typescript
// ❌ Lấy nguyên bảng Orders về RAM chỉ để lọc ra 2 đơn hàng Pending
const allItems = await db.query("SELECT * FROM orders");
const pending = allItems.filter(o => o.status === "pending");

// ✅ Đẩy việc lọc (Filter) xuống cho Database làm
const pending = await db.query(
  "SELECT * FROM orders WHERE status = ?", ["pending"]
);
```

```python
# ❌ Đọc nguyên cái file log bự chà bá chỉ để lấy Dòng số 1
content = Path("log.txt").read_text()
first_line = content.split("\n")[0]

# ✅ Đọc đúng 1 dòng (Stream)
with open("log.txt") as f:
    first_line = f.readline()
```

---

## Trạng thái Dư thừa (Redundant State)

### Trạng thái có thể Tự suy luận (Derived)

```typescript
// ❌ Lưu trữ thừa mứa: Đã có firstName và lastName rồi còn lưu fullName làm gì?
interface User {
  firstName: string;
  lastName: string;
  fullName: string;  // Redundant! Nếu update firstName mà quên update fullName là Toang!
}

// ✅ Tính toán tự động dựa trên gốc
interface User {
  firstName: string;
  lastName: string;
}
const fullName = `${user.firstName} ${user.lastName}`;
```
