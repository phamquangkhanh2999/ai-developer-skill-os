# Hướng dẫn Review Bảo mật (Security Review Guide)

Checklist code review tập trung vào Bảo mật dựa trên OWASP Top 10 và các best practice của ngành.

## Authentication & Authorization (Xác thực & Phân quyền)

### Authentication (Xác thực)
- [ ] Passwords được băm (hash) bằng thuật toán mạnh (bcrypt, argon2)
- [ ] Bắt buộc độ phức tạp của password (Complexity requirements)
- [ ] Khóa tài khoản (Account lockout) sau nhiều lần đăng nhập sai
- [ ] Luồng reset password an toàn
- [ ] Xác thực đa yếu tố (MFA) cho các thao tác nhạy cảm
- [ ] Session tokens là chuỗi ngẫu nhiên chuẩn mật mã học (cryptographically random)
- [ ] Cài đặt timeout cho Session

### Authorization (Phân quyền)
- [ ] Có bước kiểm tra phân quyền (Authorization checks) trên MỌI request
- [ ] Áp dụng nguyên tắc Đặc quyền tối thiểu (Principle of least privilege)
- [ ] Phân quyền dựa trên Role (RBAC) được triển khai đúng cách
- [ ] Không có lỗ hổng leo thang đặc quyền (Privilege escalation paths)
- [ ] Kiểm tra tham chiếu đối tượng trực tiếp (IDOR prevention)
- [ ] Các endpoint API được bảo vệ thích hợp

### Bảo mật JWT
```typescript
// ❌ Cấu hình JWT không an toàn (Secret yếu)
jwt.sign(payload, 'weak-secret');

// ✅ Cấu hình JWT an toàn
jwt.sign(payload, process.env.JWT_SECRET, {
  algorithm: 'RS256',
  expiresIn: '15m',
  issuer: 'your-app',
  audience: 'your-api'
});

// ❌ Không xác minh JWT đàng hoàng
const decoded = jwt.decode(token);  // Không verify chữ ký!

// ✅ Xác minh chữ ký và các claims
const decoded = jwt.verify(token, publicKey, {
  algorithms: ['RS256'],
  issuer: 'your-app',
  audience: 'your-api'
});
```

## Input Validation (Kiểm duyệt đầu vào)

### Phòng chống SQL Injection

**Quy tắc số #1**: Luôn luôn sử dụng Parameterized queries (Truy vấn có tham số). Tuyệt đối không nối chuỗi input của user vào lệnh SQL.

Mọi ngôn ngữ và framework lớn đều hỗ trợ:
- Python: `cursor.execute("SELECT ...", params)` / ORM filter methods
- Java: `PreparedStatement` / JPA `@Query` với `@Param`
- Go: `db.Query("SELECT ...", args...)`
- Node.js: `client.query("SELECT ...", [args])` / Prisma ORM
- PHP: PDO prepared statements / Laravel Eloquent
- C#: ADO.NET `SqlParameter` / Dapper / EF Core LINQ

### Phòng chống XSS (Cross-Site Scripting)

**Quy tắc số #1**: Phụ thuộc vào tính năng auto-escaping của Framework. Kiểm toán gắt gao mọi "lỗ hổng thoát" (escape hatch).

Các framework hiện đại đều auto-escape theo mặc định:
- React: JSX tự động escape. Kiểm toán `dangerouslySetInnerHTML`.
- Vue: `{{ }}` tự động escape. Kiểm toán `v-html`.
- Angular: Interpolation tự động escape. Kiểm toán `bypassSecurityTrustHtml`.
- Svelte: `{ }` tự động escape. Kiểm toán `{@html}`.
- C# (Razor): `@` tự động escape. Kiểm toán `@Html.Raw()`.

Để phòng thủ sâu (defense-in-depth), hãy cấu hình Content Security Policy (CSP) với `script-src` dựa trên nonce.

### Phòng chống CSRF (Cross-Site Request Forgery)

**Triển khai CSRF Token**
```typescript
// ✅ Server: Sinh và xác nhận CSRF token
import crypto from 'node:crypto';

function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Middleware: Validate token trên các request thay đổi trạng thái
app.post('/api/data', (req, res) => {
  const token = req.headers['x-csrf-token'];
  const sessionToken = req.session.csrfToken;
  if (!token || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  // ...xử lý request
});
```

**C# / ASP.NET Core**
```csharp
// ✅ ASP.NET Core: CSRF token (Antiforgery) được tích hợp sẵn
builder.Services.AddAntiforgery(options => 
{
    options.HeaderName = "X-CSRF-TOKEN";
});

// Middleware
app.UseAntiforgery();
```

**SameSite Cookie**
```typescript
// ✅ Set SameSite cookie làm hàng rào phòng thủ phụ
res.cookie('session', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',  // Hoặc 'lax' nếu cho phép điều hướng GET
  maxAge: 3600000,
});
```

### Phòng chống SSRF (Server-Side Request Forgery)

```typescript
// ❌ Lỗ hổng SSRF: URL bị điều khiển bởi người dùng
const url = req.query.url;
const response = await fetch(url);

// ✅ Validate URL trước khi fetch
const ALLOWED_DOMAINS = ['api.internal.com'];

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Block IP nội bộ (localhost)
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      return false;
    }
    // Block dải mạng Private IP
    if (parsed.hostname.match(/^10\.|^172\.(1[6-9]|2\d|3[01])\.|^192\.168\./)) {
      return false; 
    }
    return ALLOWED_DOMAINS.includes(parsed.hostname);
  } catch {
    return false;
  }
}
```

### IDOR (Insecure Direct Object Reference)

```csharp
// ❌ Lỗ hổng: Không kiểm tra quyền sở hữu
[HttpGet("api/orders/{id}")]
public async Task<IActionResult> GetOrder(int id)
{
    var order = await _db.Orders.FindAsync(id); // Bất kỳ ai cũng lấy được đơn hàng của người khác
    return Ok(order);
}

// ✅ Validate quyền sở hữu trước khi trả dữ liệu
[HttpGet("api/orders/{id}")]
public async Task<IActionResult> GetOrder(int id)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId); // Giới hạn theo Current User
    if (order == null) return NotFound();
    return Ok(order);
}
```

**UUID vs Tự tăng ID (Auto-increment ID)**
```text
// ❌ ID tự tăng dễ bị cào dữ liệu (Enumeration)
// GET /api/users/1, /api/users/2, /api/users/3 ...

// ✅ UUID không thể đoán trước
// GET /api/users/550e8400-e29b-41d4-a716-446655440000

// ⚠️ UUID chỉ chống cào dữ liệu, KHÔNG PHẢI là chốt chặn bảo mật.
// VẪN PHẢI kiểm tra Current User có quyền truy cập UUID đó không!
```

### Phòng chống Command Injection (Tiêm lệnh)

**C#**
```csharp
// ❌ Lỗ hổng: Nối chuỗi vào lệnh gọi Shell
Process.Start("cmd.exe", "/c convert " + filename + " output.png");

// ✅ Truyền arguments tách biệt rõ ràng
var startInfo = new ProcessStartInfo
{
    FileName = "convert",
    Arguments = $"{filename} output.png" // Vẫn có rủi ro, cần validate input
};
Process.Start(startInfo);

// ❌ CỰC KỲ NGUY HIỂM: Truyền input của user thẳng vào Shell
Process.Start("sh", "-c \"echo " + userInput + "\""); 
```

## Data Protection (Bảo vệ Dữ liệu)

### Xử lý Dữ liệu Nhạy cảm
- [ ] Không lưu trữ secret (password, API keys) trong source code.
- [ ] Secrets phải được lưu ở Environment Variables hoặc Secret Manager (Azure Key Vault, AWS Secrets Manager).
- [ ] Mã hóa dữ liệu nhạy cảm khi nghỉ (Encrypted at rest).
- [ ] Mã hóa dữ liệu khi truyền tải (HTTPS / Encrypted in transit).
- [ ] PII (Dữ liệu cá nhân) được xử lý theo chuẩn (GDPR, v.v.).
- [ ] KHÔNG log dữ liệu nhạy cảm.

### Cấu hình Bảo mật
```yaml
# ❌ Lưu lộ liễu trong file cấu hình
database:
  password: "super-secret-password"

# ✅ Trỏ tới biến môi trường
database:
  password: ${DATABASE_PASSWORD}
```

### Thông báo lỗi (Error Messages)
```csharp
// ❌ Làm lộ cấu trúc hệ thống qua Exception
catch (Exception ex) {
  return StatusCode(500, new {
    error = ex.StackTrace,  // Lộ mã nguồn bên trong
    query = sqlQuery        // Lộ cấu trúc DB
  });
}

// ✅ Trả về thông báo lỗi chung chung (Generic)
catch (Exception ex) {
  _logger.LogError(ex, "Lỗi Database");  // Log lại ở nội bộ
  return StatusCode(500, new {
    error = "Đã xảy ra lỗi không xác định"
  });
}
```

## Bảo mật API

### Rate Limiting (Giới hạn tốc độ)
- [ ] Áp dụng Rate limiting cho tất cả public endpoint.
- [ ] Giới hạn gắt gao hơn cho các endpoint Login / Đăng ký.
- [ ] Xử lý khéo léo (Graceful handling) khi người dùng vượt quá Limit.

### Cấu hình CORS
```csharp
// ❌ CORS mở toang cửa cho tất cả (*)
app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod());

// ✅ CORS giới hạn chặt chẽ
app.UseCors(builder => builder
    .WithOrigins("https://your-app.com")
    .WithMethods("GET", "POST")
    .AllowCredentials());
```

## Mật mã học (Cryptography)

### Best Practice
- [ ] Sử dụng các thuật toán chuẩn (AES-256, RSA-2048+).
- [ ] KHÔNG TỰ CHẾ thuật toán mã hóa (Not implementing custom cryptography).
- [ ] Dùng hàm sinh số ngẫu nhiên an toàn (Cryptographically secure random).
- [ ] Quản lý và luân chuyển Key (Key rotation) đàng hoàng.

### Sai lầm phổ biến
```csharp
// ❌ Sinh token ngẫu nhiên yếu (Dùng Random class)
var token = new Random().Next().ToString();

// ✅ Sinh ngẫu nhiên bảo mật (Cryptographically secure)
using var rng = RandomNumberGenerator.Create();
var bytes = new byte[32];
rng.GetBytes(bytes);
var token = Convert.ToBase64String(bytes);

// ❌ Dùng MD5/SHA1 để băm mật khẩu
var hash = MD5.HashData(Encoding.UTF8.GetBytes(password));

// ✅ Dùng BCrypt hoặc Argon2
var hash = BCrypt.Net.BCrypt.HashPassword(password);
```

## Dependency Security (Bảo mật Thư viện phụ thuộc)

### Checklist
- [ ] Chỉ dùng thư viện từ nguồn uy tín (Trusted sources).
- [ ] Quét lỗ hổng định kỳ (`dotnet list package --vulnerable`).
- [ ] Cập nhật thư viện thường xuyên.
- [ ] Xác minh giấy phép mã nguồn mở (License compliance).

## Logging & Monitoring

### Ghi Log An toàn
- [ ] Không log Password, Token, PII.
- [ ] Bảo vệ file log khỏi bị giả mạo.
- [ ] Log lại các sự kiện an ninh mạng (Đăng nhập sai, đổi quyền).
- [ ] Phòng chống Log Injection.

```csharp
// ❌ Log lộ thông tin nhạy cảm
_logger.LogInformation($"User login: {email}, password: {password}");

// ✅ Log an toàn
_logger.LogInformation("Thử đăng nhập", new { email, success = true });
```

## Security Review Severity Levels (Mức độ Nghiêm trọng)

| Severity | Mô tả | Hành động |
|----------|-------------|--------|
| 🔴 **Critical** | Có thể bị khai thác ngay lập tức, nguy cơ lộ data | Block merge, sửa NGAY LẬP TỨC |
| 🟡 **High** | Lỗ hổng lớn, nhưng cần điều kiện cụ thể mới khai thác được | Block merge, sửa trước khi release |
| 🟡 **Medium** | Rủi ro vừa phải | Nên sửa, có thể merge và track lại |
| 🟢 **Low** | Vấn đề nhỏ, vi phạm best practice | Nên sửa nếu có thể, không block |
| 💡 **Info** | Đề xuất tối ưu | Không bắt buộc |
