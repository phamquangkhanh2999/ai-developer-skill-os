# 🚫 Anti-Patterns Blacklist — Engineering Standard

> Đây là danh sách đỏ. AI Agent **KHÔNG ĐƯỢC PHÉP** tạo ra code vi phạm các mục dưới đây,
> trừ khi người dùng yêu cầu tường minh và chấp nhận rủi ro (kèm comment giải thích lý do).
> Mục tiêu: chống "code rác" (slop), giữ codebase dễ bảo trì, an toàn kiểu dữ liệu, và có thể mở rộng.

---

## 1. TypeScript

| Cấm | Thay bằng |
|---|---|
| `any` tùy tiện | `unknown` + type guard, hoặc định nghĩa type/interface cụ thể |
| `// @ts-ignore` không có lý do | `// @ts-expect-error: <lý do cụ thể>` chỉ khi thực sự cần thiết tạm thời |
| Ép kiểu ép buộc (`as unknown as X`, `!` non-null assertion tràn lan) | Type guard, Zod/valibot schema validation ở boundary (API, form input) |
| Kiểu `object`, `Function` mơ hồ | Định nghĩa interface/type rõ ràng, dùng generic khi cần tái sử dụng |
| Enum số học không rõ nghĩa | `as const` object hoặc string union type |
| Interface/type định nghĩa lặp lại nhiều nơi | Tách vào `types/` hoặc co-locate cạnh feature, export dùng chung |

**Ví dụ SAI:**
```ts
function handleData(data: any) {
  return data.value; // không có gì đảm bảo `value` tồn tại
}
```

**Ví dụ ĐÚNG:**
```ts
interface ApiResponse {
  value: string;
}
function handleData(data: ApiResponse) {
  return data.value;
}
```

---

## 2. React / UI

| Cấm | Thay bằng |
|---|---|
| Mutate state trực tiếp (`state.items.push(...)`, `state.x = y`) | Tạo object/array mới (`setState(prev => [...prev, item])`) hoặc dùng Immer |
| Spaghetti component: logic nghiệp vụ + fetch + JSX trộn chung 1 hàm khổng lồ | Tách Custom Hook (logic) khỏi Component (JSX thuần) — xem `component-cookbook.md` |
| Inline style (`style={{color: 'red'}}`) thay vì Design Token | Dùng class Tailwind ánh xạ token (`text-danger`), hoặc CSS variable đã định nghĩa |
| `useEffect` dùng để đồng bộ state phái sinh (derived state) | Tính toán trực tiếp trong render, hoặc `useMemo` nếu tốn kém |
| `useEffect` không có dependency array hoặc dependency sai (gây vòng lặp/render thừa) | Khai báo đầy đủ dependency, dùng ESLint `react-hooks/exhaustive-deps` |
| Component nhận > 5-6 props rời rạc không liên quan | Gom nhóm thành object prop, hoặc tách nhỏ component |
| Key trong list dùng `index` khi list có thể reorder/filter | Dùng ID ổn định (`item.id`) |
| Hardcode text UI trực tiếp (không chuẩn bị cho i18n) khi dự án có đa ngôn ngữ | Đưa qua lớp i18n / constants |
| Bỏ qua trạng thái loading / error / empty khi render dữ liệu async | Luôn xử lý đủ 3 trạng thái: loading, error, empty, success |
| Bỏ ARIA attributes / semantic HTML (`<div onClick>` thay vì `<button>`) | Dùng đúng thẻ semantic, thêm `aria-*` khi cần |

---

## 3. Kiến trúc (Architecture)

| Cấm | Thay bằng |
|---|---|
| Import chéo tạo circular dependency giữa các module | Tách shared logic ra module trung lập (`shared/`, `lib/`), kiểm tra bằng `madge` hoặc lint rule |
| Gọi API trực tiếp trong UI Component (`fetch()` ngay trong JSX/handler của component trình bày) | Tách vào `services/` hoặc data-layer hook (`useXxxQuery`) — component chỉ gọi hook |
| Business logic nằm trong Component thay vì layer riêng | Tách `hooks/`, `utils/`, `services/` — Component chỉ điều phối |
| Global mutable state ngoài store chính thức (biến module-level bị mutate) | Dùng Context/Zustand store có kiểm soát |
| Magic number/string rải rác trong code | Đưa vào `constants.ts` |
| Folder structure lộn xộn (component, hook, style của cùng 1 feature nằm rải rác nhiều nơi) | Co-location theo feature: `features/xxx/{components,hooks,services,types}` |
| Duplicate logic dán đè (copy-paste) ở nhiều nơi thay vì tái sử dụng | Trích xuất thành hàm/hook dùng chung |
| Commit code có `console.log` debug, code chết (dead code), TODO không có ticket | Dọn dẹp trước khi merge, hoặc gắn issue tracking rõ ràng |

---

## 4. React Query / TanStack Query

| Cấm | Thay bằng |
|---|---|
| Copy dữ liệu từ `useQuery` vào `useState` cục bộ (`const [x,setX]=useState(); useEffect(()=>setX(data),[data])`) | Dùng thẳng `data` trả về từ `useQuery` — nó đã là single source of truth |
| Tự quản lý loading/error bằng `useState` song song với `useQuery` | Dùng `isPending`/`isError`/`isFetching` có sẵn |
| `queryKey` viết tay rải rác nhiều nơi (`["user", id]` gõ lại ở 5 file khác nhau) | Tập trung vào 1 file `queryKeys.ts` theo factory pattern |
| Gọi `queryFn` chứa logic biến đổi dữ liệu phức tạp (mapping, tính toán nặng) | `queryFn` chỉ fetch thô; biến đổi dữ liệu qua `select` option hoặc hook riêng |
| Dùng `useQuery` cho dữ liệu thuần client (không đến từ server) | Đó là client state → dùng `useState`/Context/Zustand |
| `staleTime: 0` mặc định cho mọi query, gây refetch liên tục không cần thiết | Đặt `staleTime` phù hợp với tần suất đổi của dữ liệu |
| `invalidateQueries` tràn lan sau mọi mutation dù chỉ đổi 1 field nhỏ | Ưu tiên `setQueryData` cập nhật cache trực tiếp khi biết chính xác dữ liệu mới |
| Gọi `useQuery`/`useMutation` bên trong service/utility function (không phải React component/hook) | Hooks của React Query chỉ được gọi trong component hoặc custom hook |
| Nuốt lỗi mutation im lặng (không xử lý `onError`, không hiển thị gì cho user) | Luôn xử lý `onError` hoặc kiểm tra `error` để phản hồi UI |
| Trộn React Query với Redux/Zustand để lưu cùng một loại server-state ở 2 nơi | Server-state chỉ sống trong React Query cache, không đồng bộ ngược vào store khác |

---

## 5. TanStack Router / Table / Form / Virtual / Store

| Cấm | Thay bằng |
|---|---|
| Định nghĩa route bằng object thường, params/search không có type (dễ gõ sai tên param) | TanStack Router — dùng `createFileRoute`/`createRoute`, params & search suy kiểu tự động |
| Fetch dữ liệu trang trong component sau khi route đã mount (waterfall: chờ route load → mới fetch) | Prefetch trong `loader` của route (`loader: ({context}) => context.queryClient.ensureQueryData(...)`) |
| Đọc/ghi query string bằng `URLSearchParams` tay khi đã dùng TanStack Router | Dùng `useSearch`/`Route.useSearch()` có type-safe, validate qua schema (Zod) |
| Tự viết sort/filter/pagination state rời rạc bằng nhiều `useState` cho bảng dữ liệu | TanStack Table — quản lý qua `state` + `onXxxChange`, tách rõ khỏi cách render |
| Trộn logic tính toán dữ liệu bảng (sort/filter) vào trong JSX render row | Định nghĩa `columns` + xử lý qua Table instance (`table.getRowModel()`), JSX chỉ map render |
| Render toàn bộ hàng trăm/nghìn row DOM node cùng lúc trong Table/List | Kết hợp TanStack Virtual (`useVirtualizer`) để chỉ render row trong viewport |
| Tự quản lý field, error, touched bằng `useState` rời rạc cho form nhiều field | TanStack Form (`useForm`, `field.state`) — validate đồng bộ/bất đồng bộ tập trung, tránh re-render toàn form mỗi keystroke |
| Validate form chỉ ở client, không đồng bộ schema với backend | Dùng chung 1 schema (Zod) cho cả TanStack Form validator và backend validation |
| Đưa state UI đơn giản (theme, sidebar open/close) vào Redux/Context nặng nề | TanStack Store (hoặc `useState` cục bộ) cho state nhỏ gọn, framework-agnostic |
| Gọi trực tiếp DOM API để đo scroll/kích thước item thay vì dùng API của Virtual | Dùng `measureElement`/`estimateSize` của TanStack Virtual, tránh đọc/ghi layout thủ công gây jank |

---

## 6. Nguyên tắc review nhanh (Checklist trước khi xuất code)

- [ ] Không còn `any`/`ts-ignore` không giải thích
- [ ] Component tách rõ Logic (hook) / UI (JSX thuần)
- [ ] State được update immutable
- [ ] Không gọi API trực tiếp trong component trình bày
- [ ] Có xử lý loading/error/empty cho dữ liệu async
- [ ] Dùng Design Token, không inline style tùy tiện
- [ ] Không có circular dependency
- [ ] Không có console.log / code chết còn sót lại
- [ ] Server-state đi qua React Query, không bị copy lại vào `useState`/store khác
- [ ] `queryKey` lấy từ factory tập trung, không viết tay rải rác
- [ ] Bảng/list dữ liệu lớn dùng TanStack Table/Virtual thay vì tự viết + render toàn bộ DOM
- [ ] Form nhiều field dùng TanStack Form (hoặc RHF nếu đã có sẵn), không rời rạc `useState`
- [ ] Route params/search có type-safe qua TanStack Router, không parse tay

> Ghi chú: Nếu dự án dùng Redux thay vì Context/Zustand, áp dụng thêm quy tắc "không dispatch action trực tiếp trong component con sâu — đi qua thunk/selector có kiểm soát". Redux (nếu có) chỉ nên giữ **client state**; server-state luôn thuộc về React Query.
