# Checklist Lỗi Phổ biến (Common Bugs Checklist)

Bảng tra cứu nhanh các mẫu lỗi thường gặp, được phân loại theo từng nhóm. Để xem ví dụ chi tiết, giải thích sâu hơn và checklist đầy đủ, vui lòng tham khảo cẩm nang của từng ngôn ngữ cụ thể được liên kết bên dưới.

## Các vấn đề Phổ quát (Universal Issues)

### Lỗi Logic
- [ ] Lỗi lệch một đơn vị (Off-by-one errors) trong vòng lặp và truy xuất mảng.
- [ ] Lỗi logic Boolean (Vi phạm định luật De Morgan).
- [ ] Quên kiểm tra null/undefined.
- [ ] Lỗi tương tranh (Race conditions) trong môi trường đồng thời (concurrent).
- [ ] Dùng sai toán tử so sánh (Ví dụ: `==` thay vì `===`, hoặc `=` thay vì `==`).
- [ ] Tràn số nguyên (Integer overflow/underflow).
- [ ] Sai số khi so sánh số thực dấu phẩy động (Floating point comparison issues).

### Quản lý Tài nguyên
- [ ] Rò rỉ bộ nhớ (Memory leaks) do quên đóng connection, listener.
- [ ] Quên đóng File handles.
- [ ] Quên trả lại Database connections vào Pool.
- [ ] Quên gỡ Event listeners khi không còn dùng.
- [ ] Quên xóa Timers/intervals (gọi `clearTimeout` / `clearInterval`).

### Xử lý Lỗi (Error Handling)
- [ ] Nuốt lỗi (Swallowed exceptions) bằng các khối `catch` để trống.
- [ ] Catch lỗi quá rộng (Generic exception handling) làm che mất lỗi thực sự.
- [ ] Quên đẩy (propagate) lỗi lên cấp trên.
- [ ] Ném ra (Throw) sai loại Exception.
- [ ] Thiếu khối `finally` để dọn dẹp tài nguyên.

## TypeScript/JavaScript

- [ ] Dùng `==` thay vì `===`.
- [ ] Lạm dụng `any` — Khuyến khích dùng type cụ thể hoặc `unknown` kết hợp type guards.
- [ ] Quên `await` khi gọi hàm bất đồng bộ.
- [ ] Không bắt lỗi promise rejections (Thiếu `try-catch` khi gọi `await`).
- [ ] Bị mất context `this` khi gọi callback.
- [ ] Quên truyền prop `key` khi render danh sách (list).
- [ ] Closure vô tình giữ lại biến cũ của vòng lặp (stale loop variable).
- [ ] Gọi `parseInt` mà không truyền tham số cơ số (radix).
- [ ] Sửa đổi trực tiếp (Modify) mảng/object trong khi đang lặp qua nó.

## React / React 19

- [ ] Gọi Hooks bên trong lệnh if hoặc vòng lặp (Vi phạm Rules of Hooks).
- [ ] Mảng phụ thuộc (dependency array) của `useEffect` bị thiếu hoặc sai.
- [ ] `useEffect` thiếu hàm cleanup (đối với các subscriptions, timers, fetches).
- [ ] Lạm dụng `useEffect` để tính toán state suy diễn (Derived state) — thay vào đó hãy dùng `useMemo`.
- [ ] Lạm dụng `useMemo`/`useCallback`, hoặc dùng mà không đi kèm `React.memo`.
- [ ] Định nghĩa Component con ngay bên trong Component cha (Khiến component bị re-mount mỗi lần render).
- [ ] Truyền props không ổn định (inline object/function) cho các component đã được `memo`.
- [ ] Thay đổi trực tiếp (Mutate) vào props.
- [ ] Thiếu `key` trong mảng, hoặc lấy `index` làm key cho các mảng có khả năng sắp xếp lại (reorder).

## Python

- [ ] Dùng mutable data làm giá trị mặc định (`def f(x=[])`).
- [ ] Dùng `except:` trần trụi (sẽ bắt nhầm luôn cả `KeyboardInterrupt` và `SystemExit`).
- [ ] Chia sẻ thuộc tính (Shared mutable attributes) sai cách ở cấp độ Class (`class C: items = []`).
- [ ] Dùng `is` thay vì `==` để so sánh giá trị (value comparison).
- [ ] Quên khai báo tham số `self` trong các phương thức của Class.
- [ ] Thay đổi danh sách (Modify list) trong khi đang duyệt (iterating).
- [ ] Cộng chuỗi trong vòng lặp (Khuyến khích dùng `"".join()`).
- [ ] Quên đóng file (Nên dùng câu lệnh `with`).
- [ ] Thiếu Type annotations (khai báo kiểu) ở các public functions.

## Go

- [ ] Phớt lờ lỗi (`result, _ := SomeFunction()`).
- [ ] Chạy Goroutine mà không có cơ chế thoát (Gây rò rỉ bộ nhớ).
- [ ] Quên truyền, hoặc truyền sai `context.Context`.
- [ ] Lỗi Capture biến của vòng lặp (Ở các bản Go < 1.22).
- [ ] Gọi `defer` ở trong vòng lặp (Chỉ được thực thi khi kết thúc hàm, KHÔNG PHẢI kết thúc vòng lặp).
- [ ] Khai báo đè biến (Variable shadowing).
- [ ] Dùng Map trước khi khởi tạo (`make`).
- [ ] Bọc lỗi (Error wrapping) bằng `%v` thay vì `%w` (Làm hỏng `errors.Is`/`errors.As`).

## Java / Spring Boot

- [ ] Viết dài dòng cho POJO/DTO thay vì dùng `record` *(Java 17+)*.
- [ ] Quên `break` trong switch truyền thống (Nên dùng switch expressions) *(Java 14+)*.
- [ ] Dùng Field injection (`@Autowired` thẳng vào biến) thay vì Constructor injection.
- [ ] Lỗi N+1 query trong JPA (Quên `fetch join` hoặc `@EntityGraph`).
- [ ] Gọi `Optional.get()` mà không chịu check `isPresent()` trước.
- [ ] Stream operations có chứa side effects.

## PHP

- [ ] Thiếu `declare(strict_types=1);` ở đầu file mới.
- [ ] So sánh yếu (`==`, `!=`) ở những chỗ nhạy cảm như login, token, thanh toán.
- [ ] Dùng `in_array()` / `array_search()` mà không bật chế độ nghiêm ngặt (strict mode).
- [ ] Nối chuỗi để build câu lệnh SQL (Dễ dính SQL Injection) thay vì dùng Prepared statements.
- [ ] In dữ liệu user (echo) mà không escape (Dễ dính XSS).
- [ ] Lưu password bằng `md5()` / `sha1()` thay vì `password_hash()`.
- [ ] Che giấu lỗi bằng dấu `@` hoặc nuốt lỗi bằng `catch` để trống.

## SQL

- [ ] Nối chuỗi để tạo query (Rủi ro SQL Injection) — luôn dùng Parameterized queries.
- [ ] Bỏ quên Index ở những cột hay bị filter/join.
- [ ] Dùng `SELECT *` thay vì chọn các cột cụ thể.
- [ ] Mẫu truy vấn N+1 (N+1 query patterns).
- [ ] Truy vấn bảng lớn mà không có `LIMIT`.
- [ ] So sánh `NULL` sai cách (`IS NULL` vs `= NULL`).
- [ ] Quên bao bọc các thao tác liên quan vào trong một Transaction.
- [ ] Chọn sai loại JOIN.

## Thiết kế API (API Design)

- [ ] Đặt tên endpoint (resource) thiếu nhất quán.
- [ ] Chọn sai HTTP methods (Ví dụ: Dùng POST cho một thao tác Idempotent thay vì PUT/PATCH).
- [ ] API lấy danh sách mà không có phân trang (pagination).
- [ ] Trả về sai HTTP Status codes.
- [ ] Không giới hạn số lượng request (Thiếu Rate limiting).
- [ ] Thiếu kiểm duyệt (validation) và làm sạch dữ liệu đầu vào.
- [ ] Chỉ tin tưởng hoàn toàn vào sự kiểm duyệt từ phía Client.

## Testing

- [ ] Chỉ chăm chăm test các chi tiết bên trong (Implementation details) thay vì test hành vi (Behavior) hiển thị ra bên ngoài.
- [ ] Bỏ sót các trường hợp Edge case (trường hợp biên).
- [ ] Test chạy lúc pass lúc fail (Flaky tests / Non-deterministic).
- [ ] Test chạy thẳng vào External dependencies (Thiếu mocks).
- [ ] Thiếu test cho các trường hợp báo lỗi (Negative tests).
- [ ] Setup bài test quá phức tạp.
