# 📘 Component Cookbook — Blueprint chuẩn

> Stack mặc định: React + TypeScript + Next.js (App Router) + Tailwind (Design Token qua CSS variable) + **TanStack Query (React Query)** cho toàn bộ server-state.
> Nếu dự án dùng stack khác (Vue, Redux, styled-components...), điều chỉnh cú pháp nhưng giữ nguyên **cấu trúc giải phẫu** bên dưới.
>
> **Quy tắc phân định state (quan trọng khi có React Query):**
> - **Server state** (dữ liệu đến từ API/DB: user, list sản phẩm, kết quả search...) → luôn qua React Query. KHÔNG copy vào `useState`/Redux/Zustand.
> - **Client state** (UI thuần: modal đang mở, tab đang chọn, giá trị input chưa submit) → `useState`/Context/Zustand như bình thường.
> - Hai loại state này không được trộn vào cùng một chỗ quản lý.

---

## 1. Giải phẫu Component chuẩn

Một component "sạch" luôn tách làm 3 lớp theo đúng thứ tự:

```
1. Types/Props     → định nghĩa hợp đồng dữ liệu (interface)
2. Custom Hook      → toàn bộ logic, state, side-effect, gọi service
3. JSX thuần        → chỉ render, KHÔNG chứa logic nghiệp vụ
```

Quy tắc vàng: **nếu bạn phải "đọc" logic mới hiểu component render cái gì, tức là logic và UI đang bị trộn lẫn.**

```
components/
  Button/
    Button.tsx           ← JSX thuần + import hook
    useButton.ts          ← logic (nếu có state/behavior phức tạp)
    Button.types.ts        ← Props interface
    Button.stories.tsx      ← (tuỳ chọn) Storybook
    index.ts               ← re-export
```

---

## 2. Ví dụ mẫu: Button chuẩn mực

### `Button.types.ts`
```ts
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Nội dung hiển thị bên trong button */
  children: ReactNode;
  /** Kiểu giao diện, mặc định 'primary' */
  variant?: ButtonVariant;
  /** Kích thước, mặc định 'md' */
  size?: ButtonSize;
  /** Trạng thái đang xử lý async */
  isLoading?: boolean;
  /** Icon hiển thị trước label (tuỳ chọn) */
  leadingIcon?: ReactNode;
}
```

### `useButton.ts` (logic tách riêng — chỉ cần khi có behavior phức tạp)
```ts
import { useCallback } from "react";
import type { ButtonProps } from "./Button.types";

export function useButton({
  isLoading,
  disabled,
  onClick,
}: Pick<ButtonProps, "isLoading" | "disabled" | "onClick">) {
  const isDisabled = Boolean(isLoading || disabled);

  const handleClick = useCallback<NonNullable<ButtonProps["onClick"]>>(
    (event) => {
      if (isDisabled) return;
      onClick?.(event);
    },
    [isDisabled, onClick]
  );

  return { isDisabled, handleClick };
}
```

### `Button.tsx` (JSX thuần)
```tsx
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useButton } from "./useButton";
import type { ButtonProps } from "./Button.types";

// Design Token được ánh xạ qua Tailwind class (không hardcode hex color)
const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium " +
    "transition-colors focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-offset-2 focus-visible:ring-ring " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        danger: "bg-danger text-danger-foreground hover:bg-danger/90",
        ghost: "bg-transparent text-foreground hover:bg-muted",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant, size, isLoading, leadingIcon, className, onClick, disabled, ...rest },
    ref
  ) => {
    const { isDisabled, handleClick } = useButton({ isLoading, disabled, onClick });

    return (
      <button
        ref={ref}
        type="button"
        className={cn(buttonStyles({ variant, size }), className)}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        aria-disabled={isDisabled || undefined}
        onClick={handleClick}
        {...rest}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
        ) : (
          leadingIcon
        )}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
```

### `index.ts`
```ts
export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";
```

**Vì sao mẫu này đạt chuẩn:**
- ✅ Props có type rõ ràng, kế thừa đúng HTML attributes gốc thay vì định nghĩa lại từ đầu.
- ✅ Logic (`isDisabled`, `handleClick`) tách khỏi JSX qua `useButton`.
- ✅ Style dùng Design Token (`bg-primary`, `text-danger-foreground`...) — không hardcode màu.
- ✅ Có đủ `variant`/`size` mở rộng qua `cva`, dễ thêm token mới.
- ✅ Có `aria-busy`, `aria-disabled`, dùng đúng thẻ `<button>` — hỗ trợ người dùng khuyết tật.
- ✅ `forwardRef` để component cha có thể focus/measure DOM node khi cần.
- ✅ Xử lý trạng thái loading (spinner) mà không phá layout.

---

## 3. Mẫu component có gọi dữ liệu async — dùng React Query (ví dụ `UserCard`)

Đây là ví dụ minh hoạ nguyên tắc "không gọi API trực tiếp trong component trình bày", với React Query đảm nhiệm toàn bộ cache/loading/error thay vì tự viết `useState` + `useEffect`:

```
features/user/
  components/UserCard.tsx        ← JSX thuần, dùng hook query
  hooks/useUserProfile.ts         ← wrap useQuery, khai báo queryKey chuẩn
  services/userService.ts          ← fetch logic thuần, không biết gì về React
  queryKeys.ts                     ← nơi tập trung mọi queryKey của feature
```

```ts
// services/userService.ts — fetch logic thuần, không import React/React Query
export async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

export async function updateUserProfile(userId: string, patch: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update user profile");
  return res.json();
}
```

```ts
// queryKeys.ts — tập trung key, tránh string rải rác gây khó invalidate
export const userKeys = {
  all: ["users"] as const,
  detail: (userId: string) => [...userKeys.all, "detail", userId] as const,
};
```

```ts
// hooks/useUserProfile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../services/userService";
import { userKeys } from "../queryKeys";

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUserProfile(userId),
    enabled: Boolean(userId), // tránh gọi khi userId rỗng
    staleTime: 60_000,         // dữ liệu ít đổi → giảm refetch thừa
  });
}
```

```tsx
// components/UserCard.tsx
import { useUserProfile } from "../hooks/useUserProfile";

export function UserCard({ userId }: { userId: string }) {
  const { data, isPending, isError } = useUserProfile(userId);

  if (isPending) return <UserCardSkeleton />;
  if (isError) return <p role="alert">Không tải được thông tin người dùng.</p>;

  return (
    <article className="rounded-lg border p-4">
      <h3 className="font-semibold">{data.name}</h3>
      <p className="text-muted-foreground text-sm">{data.email}</p>
    </article>
  );
}
```

### Mutation chuẩn (ví dụ cập nhật hồ sơ)

```ts
// hooks/useUpdateUserProfile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../services/userService";
import { userKeys } from "../queryKeys";
import type { UserProfile } from "../types";

export function useUpdateUserProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<UserProfile>) => updateUserProfile(userId, patch),
    onSuccess: (updated) => {
      // Cập nhật cache ngay, không cần chờ refetch
      queryClient.setQueryData(userKeys.detail(userId), updated);
    },
    // onError: hiển thị toast lỗi ở nơi gọi mutate, không nuốt lỗi im lặng
  });
}
```

```tsx
// components/EditProfileForm.tsx
import { useUpdateUserProfile } from "../hooks/useUpdateUserProfile";

export function EditProfileForm({ userId }: { userId: string }) {
  const { mutate, isPending, error } = useUpdateUserProfile(userId);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        mutate({ name: String(form.get("name")) });
      }}
    >
      <input name="name" defaultValue="" />
      <Button type="submit" isLoading={isPending}>Lưu</Button>
      {error && <p role="alert">Cập nhật thất bại, thử lại.</p>}
    </form>
  );
}
```

**Vì sao mẫu này đạt chuẩn:**
- ✅ `queryKey` được khai báo tập trung ở `queryKeys.ts`, không rải string tay ở nhiều nơi.
- ✅ `service` layer không biết gì về React/React Query — có thể tái dùng ở server, test độc lập.
- ✅ Dùng `isPending`/`isError` do React Query cung cấp thay vì tự quản lý state loading.
- ✅ Mutation cập nhật cache qua `setQueryData` thay vì `invalidateQueries` tràn lan gây refetch thừa (chỉ dùng `invalidateQueries` khi thực sự cần đồng bộ lại từ server).
- ✅ Component KHÔNG tự gọi `fetch` — chỉ gọi hook.

---

## 4. Blueprint nhanh: Table / Form / Virtual / Router

### 4.1 TanStack Table (headless — bảng có sort/filter/pagination)

```tsx
// components/UserTable.tsx
import { useReactTable, getCoreRowModel, getSortedRowModel, type ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<UserProfile>[] = [
  { accessorKey: "name", header: "Tên", enableSorting: true },
  { accessorKey: "email", header: "Email" },
];

export function UserTable({ data }: { data: UserProfile[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table className="w-full text-sm">
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th key={h.id} onClick={h.column.getToggleSortingHandler()} className="cursor-pointer text-left p-2">
                {h.isPlaceholder ? null : h.column.columnDef.header as string}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="border-t">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="p-2">{String(cell.getValue())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```
> Nguyên tắc: `columns` định nghĩa tách biệt khỏi JSX, JSX chỉ `.map()` để render — không tự viết sort/filter tay.

### 4.2 TanStack Virtual (danh sách lớn)

```tsx
// components/VirtualUserList.tsx
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

export function VirtualUserList({ items }: { items: UserProfile[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56, // chiều cao ước tính mỗi row (px)
    overscan: 8,
  });

  return (
    <div ref={parentRef} className="h-[480px] overflow-auto">
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${row.start}px)`, height: row.size }}
          >
            {items[row.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```
> Nguyên tắc: không render toàn bộ `items.map()` trực tiếp khi danh sách có thể vượt vài trăm phần tử.

### 4.3 TanStack Form (form nhiều field, validate type-safe)

```tsx
// components/EditProfileForm.tsx
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
});

export function EditProfileForm({ onSubmit }: { onSubmit: (v: z.infer<typeof schema>) => void }) {
  const form = useForm({
    defaultValues: { name: "", email: "" },
    onSubmit: async ({ value }) => onSubmit(schema.parse(value)),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <form.Field
        name="name"
        validators={{ onChange: ({ value }) => (value.length ? undefined : "Tên không được để trống") }}
      >
        {(field) => (
          <>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.length > 0 && <p role="alert">{field.state.meta.errors[0]}</p>}
          </>
        )}
      </form.Field>
      <Button type="submit">Lưu</Button>
    </form>
  );
}
```
> Nguyên tắc: validate schema dùng chung (Zod) giữa client và server; mỗi field tự quản lý re-render qua `form.Field`, tránh re-render toàn form mỗi keystroke.

### 4.4 TanStack Router (route + loader prefetch)

```tsx
// routes/users.$userId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { userKeys } from "../queryKeys";
import { fetchUserProfile } from "../services/userService";

export const Route = createFileRoute("/users/$userId")({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData({
      queryKey: userKeys.detail(params.userId),
      queryFn: () => fetchUserProfile(params.userId),
    }),
  component: UserPage,
});

function UserPage() {
  const { userId } = Route.useParams();
  // Data đã được prefetch trong loader — useQuery ở đây chỉ đọc cache, không fetch lại
  return <UserCard userId={userId} />;
}
```
> Nguyên tắc: loader prefetch qua `queryClient`, component tiêu thụ lại qua `useQuery`/hook cùng `queryKey` — tránh fetch 2 lần.

---

## 5. Checklist khi sinh component mới

- [ ] Props có `interface` riêng, đặt tên `<Component>Props`
- [ ] Logic phức tạp (>1 state hoặc có side-effect) được tách vào custom hook
- [ ] Không gọi `fetch`/API trực tiếp trong file `.tsx` trình bày
- [ ] Style dùng Design Token/Tailwind class, không hardcode màu/spacing
- [ ] Có xử lý đủ trạng thái loading/error/empty nếu có dữ liệu async
- [ ] Có ARIA attributes và dùng đúng thẻ semantic
- [ ] Export qua `index.ts` để import path gọn (`@/components/Button`)
- [ ] Bảng dữ liệu dùng TanStack Table (`columns` tách khỏi JSX), danh sách lớn dùng TanStack Virtual
- [ ] Form nhiều field dùng TanStack Form với schema Zod dùng chung client/server
- [ ] Route có params/search dùng TanStack Router type-safe, dữ liệu prefetch qua `loader` + `ensureQueryData`
