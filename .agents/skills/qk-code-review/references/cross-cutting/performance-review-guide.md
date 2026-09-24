# Hướng dẫn Review Hiệu năng (Performance Review Guide)

Bí kíp đánh giá hiệu năng toàn diện, bao phủ từ Frontend, Backend, Database, Độ phức tạp thuật toán (Algorithm complexity) cho đến hiệu năng API.

## Mục lục

- [Hiệu năng Frontend (Core Web Vitals)](#hiệu-năng-frontend-core-web-vitals)
- [Hiệu năng JavaScript](#hiệu-năng-javascript)
- [Quản lý Bộ nhớ (Memory Management)](#quản-lý-bộ-nhớ)
- [Hiệu năng Database](#hiệu-năng-database)
- [Hiệu năng API](#hiệu-năng-api)
- [Độ phức tạp Thuật toán](#độ-phức-tạp-thuật-toán)
- [Checklist Đánh giá Hiệu năng](#checklist-đánh-giá-hiệu-năng)
- [Anti-pattern Hiệu suất cấp thấp](#anti-pattern-hiệu-suất-cấp-thấp)

---

## Hiệu năng Frontend (Core Web Vitals)

### Các chỉ số cốt lõi (Core Vitals 2024)

| Chỉ số | Tên đầy đủ | Mục tiêu | Ý nghĩa |
|------|------|--------|------|
| **LCP** | Largest Contentful Paint | ≤ 2.5s | Thời gian render phần tử lớn nhất trên màn hình |
| **INP** | Interaction to Next Paint | ≤ 200ms | Độ trễ phản hồi tương tác (Thay thế FID từ 2024) |
| **CLS** | Cumulative Layout Shift | ≤ 0.1 | Độ giật / Xê dịch layout cộng dồn |
| **FCP** | First Contentful Paint | ≤ 1.8s | Thời gian render nội dung đầu tiên |
| **TBT** | Total Blocking Time | ≤ 200ms | Tổng thời gian Main Thread bị block |

### Tối ưu LCP

```html
<!-- ❌ Lazy load hình ảnh LCP - Làm chậm nội dung quan trọng -->
<img src="hero.jpg" loading="lazy" />

<!-- ✅ Load ngay lập tức hình ảnh LCP -->
<img src="hero.jpg" fetchpriority="high" />

<!-- ❌ Định dạng ảnh cũ, nặng -->
<img src="hero.png" />  <!-- File PNG quá to -->

<!-- ✅ Dùng định dạng hiện đại + Responsive -->
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero" />
</picture>
```

**Checklist LCP:**
- [ ] Phần tử LCP có được set `fetchpriority="high"` không?
- [ ] Đã dùng định dạng WebP/AVIF chưa?
- [ ] Có Server-Side Rendering (SSR) hoặc Static Site Generation (SSG) không?
- [ ] CDN đã cấu hình đúng chưa?

### Tối ưu FCP

```html
<!-- ❌ CSS chặn render (Render-blocking) -->
<link rel="stylesheet" href="all-styles.css" />

<!-- ✅ Inline CSS quan trọng (Critical CSS) + Load bất đồng bộ phần còn lại -->
<style>/* Critical CSS cho màn hình đầu tiên */</style>
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />

<!-- ❌ Font chữ chặn render -->
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2');
}

<!-- ✅ Tối ưu hiển thị Font -->
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2');
  font-display: swap;  /* Dùng font hệ thống trước, load xong sẽ tráo đổi */
}
```

### Tối ưu INP

```javascript
// ❌ Long task block Main Thread
button.addEventListener('click', () => {
  // Thao tác đồng bộ tốn 500ms
  processLargeData(data);
  updateUI();
});

// ✅ Chia nhỏ Long task
button.addEventListener('click', async () => {
  // Trả lại quyền điều khiển cho Main Thread
  await scheduler.yield?.() ?? new Promise(r => setTimeout(r, 0));

  // Xử lý từng lô nhỏ (chunk)
  for (const chunk of chunks) {
    processChunk(chunk);
    await scheduler.yield?.();
  }
  updateUI();
});

// ✅ Đẩy tính toán nặng sang Web Worker
const worker = new Worker('heavy-computation.js');
worker.postMessage(data);
worker.onmessage = (e) => updateUI(e.data);
```

### Tối ưu CLS

```css
/* ❌ Hình ảnh/Video không có kích thước cố định */
img { width: 100%; }

/* ✅ Đặt trước không gian (Aspect ratio) */
img {
  width: 100%;
  aspect-ratio: 16 / 9;
}

/* ❌ Nội dung động gây đẩy layout (Shift) */
.ad-container { }

/* ✅ Dự phòng chiều cao cố định */
.ad-container {
  min-height: 250px;
}
```

---

## Hiệu năng JavaScript

### Code Splitting & Lazy Loading

```javascript
// ❌ Load toàn bộ code một lúc
import { HeavyChart } from './charts';
import { PDFExporter } from './pdf';

// ✅ Tải ngầm theo nhu cầu (On-demand / Lazy)
const HeavyChart = lazy(() => import('./charts'));
const PDFExporter = lazy(() => import('./pdf'));

// ✅ Chia code theo Route (Route-based splitting)
const routes = [
  { path: '/dashboard', component: lazy(() => import('./pages/Dashboard')) }
];
```

### Tối ưu kích thước Bundle (Bundle Size)

```javascript
// ❌ Import nguyên cả cái thư viện bự
import _ from 'lodash';
import moment from 'moment';

// ✅ Import đích danh hàm cần dùng
import debounce from 'lodash/debounce';
import { format } from 'date-fns';

// ❌ Tránh việc không dùng Tree Shaking
export default { fn1() {}, fn2() {} }; // fn2 không xài cũng bị gom vào bundle

// ✅ Export đích danh để hỗ trợ Tree Shaking
export function fn1() {}
export function fn2() {}
```

### Tối ưu Render danh sách (List Rendering)

```javascript
// ❌ Render hàng ngàn DOM Node cùng lúc
function List({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}

// ✅ Dùng Virtual List (Cuộn ảo) - Chỉ render phần đang nhìn thấy trên màn hình
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  return (
    <FixedSizeList height={400} itemCount={items.length} itemSize={35}>
      {({ index, style }) => <div style={style}>{items[index].name}</div>}
    </FixedSizeList>
  );
}
```

---

## Quản lý Bộ nhớ (Memory Management)

### Các dạng rò rỉ bộ nhớ (Memory Leaks) điển hình

**1. Quên gỡ Event Listener**
```javascript
// ❌ Unmount nhưng Event vẫn chạy
useEffect(() => { window.addEventListener('resize', handleResize); }, []);

// ✅ Cleanup Event Listener
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

**2. Quên xóa Timer (Interval/Timeout)**
```javascript
// ✅ Luôn luôn clearInterval
useEffect(() => {
  const timer = setInterval(fetchData, 5000);
  return () => clearInterval(timer);
}, []);
```

**3. Rò rỉ qua Closure**
```javascript
// ❌ Closure giữ lại tham chiếu mảng khổng lồ không cần thiết
function createHandler() {
  const largeData = new Array(1000000).fill('x');
  return function handler() { console.log(largeData.length); }; // Giữ luôn nguyên cái mảng
}

// ✅ Chỉ giữ lại giá trị thực sự cần
function createHandler() {
  const largeData = new Array(1000000).fill('x');
  const length = largeData.length;  // Chỉ lưu cái số đếm
  return function handler() { console.log(length); };
}
```

**4. Rò rỉ qua Connection (WebSocket/SSE)**
- Luôn gọi `ws.close()` trong hàm cleanup.

---

## Hiệu năng Database

### Vấn đề N+1 Queries
> Xem chi tiết tại [N+1 Queries Checklist](n-plus-one-queries.md)

```python
# ❌ N+1
users = User.objects.all()  # 1 Query
for user in users:
    print(user.profile.bio)  # N Queries

# ✅ Eager Loading
users = User.objects.select_related('profile').all()  # 2 Queries
```

### Tối ưu Index (Chỉ mục)

```sql
-- ❌ Full table scan (Quét toàn bảng)
SELECT * FROM orders WHERE status = 'pending';

-- ✅ Đánh Index
CREATE INDEX idx_orders_status ON orders(status);

-- ❌ Lỗi mất Index: Chạy Hàm trên cột
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- ✅ Đổi thành Range Query để xài được Index
SELECT * FROM users WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- ❌ Lỗi mất Index: LIKE '%...' (Có dấu % ở đầu)
SELECT * FROM products WHERE name LIKE '%phone%';
```

### Tối ưu Query

```sql
-- ❌ Dùng SELECT * lấy những cột không cần thiết
SELECT * FROM users WHERE id = 1;

-- ✅ Chỉ select các cột thực sự cần
SELECT id, name, email FROM users WHERE id = 1;

-- ❌ Lấy cả bảng siêu to mà không có LIMIT
SELECT * FROM logs WHERE type = 'error';

-- ✅ Luôn có Phân trang (Pagination/LIMIT)
SELECT * FROM logs WHERE type = 'error' LIMIT 100 OFFSET 0;
```

---

## Hiệu năng API

### Phân trang (Pagination)
Tuyệt đối KHÔNG BAO GIỜ trả về nguyên cái Array không giới hạn (Unbounded Array). Luôn luôn nhận vào `page` và `limit` (max 100).

### Caching (Bộ nhớ đệm)
```javascript
// ✅ Dùng Redis
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// ✅ Cấu hình HTTP Cache Headers
res.set({
  'Cache-Control': 'public, max-age=86400',  // 24 giờ
  'ETag': 'abc123',
});
```

### Nén phản hồi (Response Compression)
```javascript
// ✅ Kích hoạt Gzip / Brotli
const compression = require('compression');
app.use(compression());
```

### Giới hạn Tốc độ (Rate Limiting)
- Bảo vệ API bằng cách giới hạn số lượng request từ 1 IP/User trong khoảng thời gian nhất định.

---

## Độ phức tạp Thuật toán (Algorithm Complexity)

| Độ phức tạp | Ký hiệu | Ý nghĩa | 10 record | 1000 record | Ví dụ |
|--------|------|-------|-------|---------|------|
| **O(1)** | Constant | Cố định | 1 | 1 | Hash map (Dict/Map) / Tra cứu Index |
| **O(log n)**| Logarithmic | Tăng rất chậm | 3 | 10 | Tìm kiếm nhị phân |
| **O(n)** | Linear | Tuyến tính | 10 | 1000 | Vòng lặp for 1 cấp |
| **O(n log n)**| Linearithmic | Hơi tốn | 33 | 10000 | Sort (Sắp xếp) |
| **O(n²)** | Quadratic | Rất tốn kém | 100 | 1.000.000 | Vòng lặp lồng nhau (Nested loops) |

### Nhận diện O(n²) trong Code Review

```javascript
// ❌ O(n²) - Gọi includes() bên trong vòng lặp for
function removeDuplicates(arr) {
  const result = [];
  for (const item of arr) {
    if (!result.includes(item)) {  // .includes() là O(n)
      result.push(item);
    }
  }
  return result;
}

// ✅ O(n) - Dùng Set (Cấu trúc dữ liệu O(1) tra cứu)
function removeDuplicates(arr) {
  return [...new Set(arr)];
}
```

```javascript
// ❌ O(n) - Dùng find() bừa bãi
function getUser(id) {
  return users.find(u => u.id === id);  // Duyệt mảng từ đầu tới cuối
}

// ✅ O(1) - Biến mảng thành Map để tra cứu siêu tốc
const userMap = new Map(users.map(u => [u.id, u]));
function getUser(id) {
  return userMap.get(id);
}
```

---

## Anti-pattern Hiệu suất cấp thấp

### Làm việc thừa (Unnecessary repetitive work)
- Đọc file `config.json` bên trong vòng lặp thay vì đọc 1 lần đưa ra ngoài.
- Gọi lại cùng 1 câu lệnh DB Query nhiều lần trong 1 Request.

### Bỏ lỡ cơ hội chạy Song song (Missed Concurrency)
- Đợi 2 cái Promise độc lập nhau một cách tuần tự (`await A; await B`).
- Hãy dùng `Promise.all([A, B])` hoặc `Task.WhenAll()`.

### Bùng nổ Dữ liệu không giới hạn (Unbounded data structures)
```python
# ❌ Cache vào Dictionary mút mùa không bao giờ đầy, gây Out of Memory (OOM)
_cache = {}

# ✅ Dùng LRU Cache có giới hạn max size
from functools import lru_cache
@lru_cache(maxsize=128)
```
