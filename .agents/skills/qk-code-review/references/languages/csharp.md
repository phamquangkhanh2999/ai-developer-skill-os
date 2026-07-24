# Hướng dẫn Review Code C# / .NET

> Hướng dẫn review code C# / .NET 8, bao quát các tính năng mới của C# 12, lập trình bất đồng bộ (Async), tối ưu hiệu năng EF Core, các best practice cho ASP.NET Core, Dependency Injection và LINQ.

## Mục lục

- [Tính năng mới của C# 12](#tính-năng-mới-của-c-12)
- [Lập trình Bất đồng bộ (Async)](#lập-trình-bất-đồng-bộ)
- [Hiệu năng EF Core](#hiệu-năng-ef-core)
- [Best Practice ASP.NET Core](#best-practice-aspnet-core)
- [Dependency Injection](#dependency-injection)
- [Best Practice LINQ](#best-practice-linq)
- [Review Checklist](#review-checklist)

---

## Tính năng mới của C# 12

### Primary Constructors (Cho các class không phải record)

```csharp
// ❌ Constructor truyền thống với nhiều boilerplate code
public class ProductService
{
    private readonly ProductDbContext _db;
    private readonly ILogger<ProductService> _logger;

    public ProductService(ProductDbContext db, ILogger<ProductService> logger)
    {
        _db = db;
        _logger = logger;
    }
}

// ✅ Primary Constructor —— Dependency Injection cực kỳ ngắn gọn
public class ProductService(ProductDbContext db, ILogger<ProductService> logger)
{
    public async Task<Product?> GetAsync(int id)
        => await db.Products.FindAsync(id);
}

// ⚠️ Lưu ý: tham số của primary constructor KHÔNG PHẢI là property, không thể gán lại
// ⚠️ Nếu cần lưu trữ lâu dài, hãy khai báo field rõ ràng
public class OrderService(OrderDbContext db)
{
    private readonly OrderDbContext _db = db; // Bắt tường minh
}
```

### Collection Expressions (Biểu thức tập hợp)

```csharp
// ❌ Khởi tạo tập hợp kiểu cũ
int[] nums = new int[] { 1, 2, 3 };
List<string> names = new List<string> { "alice", "bob" };

// ✅ Biểu thức tập hợp (Collection expressions)
int[] nums = [1, 2, 3];
List<string> names = ["alice", "bob"];
Span<char> span = ['a', 'b'];

// ✅ Spread operator (Toán tử trải)
int[] merged = [..nums, 4, 5];
```

### Default Lambda Parameters (Tham số mặc định cho Lambda)

```csharp
// ❌ Overload lambda
var add = (int a, int b) => a + b;
var addDefault = (int a) => a + 1;

// ✅ Sử dụng tham số mặc định
var add = (int a, int b = 1) => a + b;
```

---

## Lập trình Bất đồng bộ (Async)

> 📖 Xem thêm các pattern đồng thời chung tại [Async & Concurrency Patterns](cross-cutting/async-concurrency-patterns.md)

### `Task.Wait()` / `.Result` / `async void` là các Anti-pattern cực kỳ nghiêm trọng

```csharp
// ❌ Task.Wait() —— Nguy cơ Deadlock (Block luồng đồng bộ bằng thao tác bất đồng bộ)
public ActionResult<Data> Get(int id)
{
    var data = _service.GetDataAsync(id).Result; // Deadlock!
    return Ok(data);
}

// ❌ async void —— Không thể catch Exception, làm crash toàn bộ Process
public async void HandleEvent()
{
    await _service.ProcessAsync(); // Nếu có lỗi sẽ crash thẳng
}

// ✅ async Task —— Bất đồng bộ toàn chuỗi (Async all the way)
public async Task<ActionResult<Data>> Get(int id)
{
    var data = await _service.GetDataAsync(id);
    return Ok(data);
}
```

### `ConfigureAwait(false)` dành riêng cho code thư viện (Library code)

```csharp
// ❌ Code thư viện giữ lại SynchronizationContext không cần thiết
public class LibraryService
{
    public async Task<string> GetDataAsync()
    {
        var response = await _httpClient.GetAsync("/api/data");
        return await response.Content.ReadAsStringAsync();
    }
}

// ✅ Code thư viện dùng ConfigureAwait(false) để tránh deadlock
public class LibraryService
{
    public async Task<string> GetDataAsync()
    {
        var response = await _httpClient.GetAsync("/api/data").ConfigureAwait(false);
        return await response.Content.ReadAsStringAsync().ConfigureAwait(false);
    }
}
```

### Truyền CancellationToken (CancellationToken Propagation)

```csharp
// ❌ Bỏ qua CancellationToken
public async Task<List<User>> SearchAsync(string query)
{
    return await _db.Users.Where(u => u.Name.Contains(query)).ToListAsync();
}

// ✅ Truyền CancellationToken xuyên suốt toàn chuỗi
public async Task<List<User>> SearchAsync(string query, CancellationToken ct = default)
{
    return await _db.Users
        .Where(u => u.Name.Contains(query))
        .ToListAsync(ct);
}
```

### Async Disposal (Giải phóng tài nguyên bất đồng bộ)

```csharp
// ❌ Giải phóng đồng bộ các tài nguyên bất đồng bộ
public class DataClient : IDisposable
{
    public void Dispose()
    {
        _httpClient.Dispose(); // Có thể hủy luôn request đang chạy dang dở
    }
}

// ✅ Dùng IAsyncDisposable
public class DataClient : IAsyncDisposable
{
    public async ValueTask DisposeAsync()
    {
        await _stream.DisposeAsync();
    }
}

// ✅ Ở phía gọi (caller), dùng await using
await using var client = new DataClient();
```

---

## Hiệu năng EF Core

### Vấn đề N+1 Queries

> 📖 Xem thêm lý thuyết chung tại [N+1 Queries Guide](cross-cutting/n-plus-one-queries.md)

```csharp
// ❌ Lỗi kinh điển N+1 —— Mỗi Blog query một lần để lấy Posts
foreach (var blog in await context.Blogs.ToListAsync())
{
    foreach (var post in blog.Posts) // Chọc xuống DB mỗi vòng lặp!
    {
        Console.WriteLine(post.Title);
    }
}

// ✅ Eager Loading + Projection
await foreach (var blog in context.Blogs
    .Select(b => new { b.Url, b.Posts })
    .AsAsyncEnumerable())
{
    foreach (var post in blog.Posts)
        Console.WriteLine(post.Title);
}
```

### Fetch thừa dữ liệu (Không dùng Projection)

```csharp
// ❌ Lấy toàn bộ các cột —— Chỉ cần dùng Url nhưng kéo cả table về
var urls = await context.Blogs.ToListAsync();

// ✅ Chỉ select (chiếu) đúng các cột cần thiết
var urls = await context.Blogs
    .Select(b => b.Url)
    .ToListAsync();
```

### Quên Phân trang (Missing Pagination)

```csharp
// ❌ Lấy nguyên mảng dữ liệu (Unbounded result set)
var posts = await context.Posts
    .Where(p => p.Title.StartsWith("A"))
    .ToListAsync(); // Có thể trả về hàng triệu dòng!

// ✅ Giới hạn số lượng kết quả
var posts = await context.Posts
    .Where(p => p.Title.StartsWith("A"))
    .OrderBy(p => p.Id)
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync();
```

### Cartesian Explosion (Bùng nổ dữ liệu do JOIN chéo)

```csharp
// ❌ Dùng nhiều Include tạo ra dữ liệu trùng lặp khổng lồ
var blogs = await context.Blogs
    .Include(b => b.Posts)
    .Include(b => b.Tags)
    .ToListAsync(); // Dữ liệu Blog bị nhân bản ra mỗi dòng

// ✅ Sử dụng AsSplitQuery để tách query
var blogs = await context.Blogs
    .Include(b => b.Posts)
    .Include(b => b.Tags)
    .AsSplitQuery()
    .ToListAsync();
```

### Quên dùng AsNoTracking cho câu truy vấn Read-only

```csharp
// ❌ Theo dõi mặc định —— Kể cả chỉ đọc cũng tốn chi phí Tracking
var products = await context.Products.ToListAsync();

// ✅ AsNoTracking —— Bỏ qua Change Tracking, chạy nhanh hơn và tốn ít RAM hơn
var products = await context.Products
    .AsNoTracking()
    .ToListAsync();
```

### Dùng hàm (Function) trên Cột làm mất tác dụng Index

```csharp
// ✅ Có thể xài index —— sargable
var posts1 = await context.Posts
    .Where(p => p.Title.StartsWith("A"))
    .ToListAsync();

// ❌ Không dùng được index —— Bắt buộc full table scan
var posts2 = await context.Posts
    .Where(p => p.Title.EndsWith("A"))
    .ToListAsync();

// ❌ Dùng hàm bao lấy cột —— Bắt buộc full table scan
var posts3 = await context.Posts
    .Where(p => p.Title.ToLower() == "foo")
    .ToListAsync();
```

### Truy cập DB Đồng bộ vs Bất đồng bộ

```csharp
// ❌ Gọi DB đồng bộ —— Block luồng (Thread-blocking)
var products = context.Products.ToList();
context.SaveChanges();

// ✅ Gọi DB bất đồng bộ
var products = await context.Products.ToListAsync();
await context.SaveChangesAsync();
```

---

## Best Practice ASP.NET Core

### Sử dụng sai HttpClient

```csharp
// ❌ Tạo HttpClient mới cho mỗi Request —— Cạn kiệt Socket (Socket exhaustion)
using var client = new HttpClient();
var response = await client.GetAsync("https://api.example.com/data");

// ✅ Dùng IHttpClientFactory để tiêm (inject)
public class MyService
{
    private readonly HttpClient _client;
    public MyService(HttpClient client) => _client = client; // Lấy từ Factory
}
```

### Dùng HttpContext ở Background Thread

```csharp
// ❌ Bắt lấy Scoped service trong background task —— Lúc chạy thì request đã kết thúc và service bị dispose
_ = Task.Run(async () =>
{
    await context.SaveChangesAsync(); // ObjectDisposedException!
});

// ✅ Tạo scope mới hoàn toàn
_ = Task.Run(async () =>
{
    await using var scope = serviceScopeFactory.CreateAsyncScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.SaveChangesAsync();
});
```

### Đọc Request.Form đồng bộ

```csharp
// ❌ Đọc Form đồng bộ —— Lỗi sync-over-async
var form = HttpContext.Request.Form;

// ✅ Đọc Form bất đồng bộ
var form = await HttpContext.Request.ReadFormAsync();
```

### Dùng Exception để điều khiển luồng (Control flow)

```csharp
// ❌ Dùng exception để kiểm tra dữ liệu có tồn tại hay không —— Rất chậm
try
{
    var user = await _db.Users.FirstAsync(u => u.Id == id);
}
catch (InvalidOperationException)
{
    return NotFound();
}

// ✅ Dùng câu lệnh kiểm tra (if/else) thay vì Exception
var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
if (user is null) return NotFound();
```

### Cài Header sau khi Body đã được ghi

```csharp
// ❌ Body đã gửi nhưng lại đi set header —— Báo lỗi (Exception)
await next(context);
context.Response.Headers["X-Custom"] = "value"; // Sẽ văng lỗi!

// ✅ Dùng hàm callback OnStarting
context.Response.OnStarting(() =>
{
    context.Response.Headers["X-Custom"] = "value";
    return Task.CompletedTask;
});
await next(context);
```

---

## Dependency Injection

### Inject Scoped Service vào Singleton

```csharp
// ❌ Scoped service tiêm vào Singleton —— Lệch vòng đời (Captive dependency)
services.AddSingleton<BackgroundWorker>();
services.AddScoped<IUserRepository, UserRepository>();

// BackgroundWorker là Singleton, UserRepository là Scoped
// → UserRepository sẽ bị dùng chung cho mọi request hoặc bị dispose sớm

// ✅ Tạo scope từ IServiceProvider ngay bên trong Singleton
public class BackgroundWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public BackgroundWorker(IServiceScopeFactory scopeFactory)
        => _scopeFactory = scopeFactory;

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        await using var scope = _scopeFactory.CreateAsyncScope();
        var repo = scope.ServiceProvider.GetRequiredService<IUserRepository>();
    }
}
```

---

## Best Practice LINQ

### Gọi LINQ sau khi đã ToList()

```csharp
// ❌ ToList rồi mới filter —— Kéo toàn bộ bảng lên RAM
var results = context.Posts
    .Where(p => p.Title.StartsWith("A"))
    .ToList()
    .Where(p => SomeClientFilter(p)); // Filter phía Client (bộ nhớ)

// ✅ Để cho Database lo khâu filter nhiều nhất có thể
var results = await context.Posts
    .Where(p => p.Title.StartsWith("A") && SomeDbFilter(p))
    .AsAsyncEnumerable()
    .Where(p => SomeClientFilter(p)) // Chỉ filter trên tập kết quả nhỏ
    .ToListAsync();
```

### Count() vs Any()

```csharp
// ❌ Count() phải đếm toàn bộ dòng thỏa mãn
if (context.Users.Count() > 0) { /* ... */ }

// ✅ Any() hiệu quả hơn —— Ngừng tìm ngay khi thấy bản ghi đầu tiên
if (await context.Users.AnyAsync()) { /* ... */ }
```

### Duyệt (Enumerate) IEnumerable nhiều lần

```csharp
// ❌ IEnumerable bị duyệt 2 lần
public void Process(IEnumerable<int> numbers)
{
    if (numbers.Any()) // Duyệt lần 1
    {
        foreach (var n in numbers) // Duyệt lần 2 (có thể gọi DB lại lần nữa)
        {
            Console.WriteLine(n);
        }
    }
}

// ✅ Nếu cần dùng nhiều lần, hãy vật chất hóa (materialize) nó trước
public void Process(IEnumerable<int> numbers)
{
    var list = numbers.ToList(); // Chỉ duyệt 1 lần duy nhất
    if (list.Any())
    {
        foreach (var n in list)
        {
            Console.WriteLine(n);
        }
    }
}
```

### Side-effects (tác dụng phụ) bên trong Select

```csharp
// ❌ Dùng Select để thực thi side-effect —— Không đoán trước được lúc nào nó chạy
var results = users.Select(u =>
{
    _logger.LogInformation($"Processing {u.Name}"); // Side effect!
    return u.Email;
}).ToList();

// ✅ Đưa Side-effect ra khỏi Select, bỏ vào vòng lặp foreach
foreach (var user in users)
{
    _logger.LogInformation("Processing {Name}", user.Name);
}
var results = users.Select(u => u.Email).ToList();
```

---

## Review Checklist (Bảng kiểm nhanh)

### Tính năng mới C# 12
- [ ] Tham số của Primary constructor không bị gán lại lung tung.
- [ ] Cú pháp Collection expression (`[1, 2, 3]`) được dùng nhất quán.

### Lập trình Bất đồng bộ
- [ ] Tuyệt đối KHÔNG có `Task.Wait()`, `.Result`, hay `async void`.
- [ ] Code thư viện luôn dùng `ConfigureAwait(false)`.
- [ ] `CancellationToken` được truyền đi xuyên suốt.
- [ ] Tài nguyên bất đồng bộ được quản lý bởi `IAsyncDisposable` / `await using`.
- [ ] Không mix lẫn lộn truy cập dữ liệu đồng bộ và bất đồng bộ.

### EF Core
- [ ] Không có N+1 queries (Truy cập Navigation properties bên trong vòng lặp).
- [ ] Có dùng `Select()` (Projection) để tránh fetch thừa data.
- [ ] Lấy danh sách luôn có `Take()`/`Skip()` để Phân trang (Pagination).
- [ ] Sử dụng `AsSplitQuery()` nếu có quá nhiều `Include()`.
- [ ] Các query Read-only phải có `AsNoTracking()`.
- [ ] Cẩn thận với các Hàm thao tác trên Cột làm mất Index (Vd: `ToLower()`).
- [ ] Mọi cuộc gọi DB phải dùng hàm `Async`.

### ASP.NET Core
- [ ] Dùng `IHttpClientFactory` thay vì `new HttpClient()`.
- [ ] Task chạy nền (Background tasks) tự sinh ra Scope mới.
- [ ] Dùng `ReadFormAsync` thay thế cho `Request.Form`.
- [ ] Không xài Exception để check null hoặc điều khiển luồng.
- [ ] Header HTTP được xử lý qua `OnStarting`.

### Dependency Injection
- [ ] Không chích (Inject) đồ Scoped vào đồ Singleton.
- [ ] Background tasks luôn gọi CreateScope.

### LINQ
- [ ] Hạn chế gọi LINQ sau khi đã `ToList()` nếu query chưa tối ưu.
- [ ] Ưu tiên `Any()` hơn là `Count() > 0`.
- [ ] `IEnumerable` được lưu ra List nếu cần duyệt qua nhiều lần.
- [ ] Hàm `Select()` hoàn toàn pure, không có side-effects (như log, lưu DB).
