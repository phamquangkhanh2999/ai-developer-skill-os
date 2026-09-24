# Animation & Micro-interactions Intelligence

## 1. Principles
- **Mục đích**: Animation không bao giờ được dùng chỉ để "trang trí". Nó phải giúp người dùng hiểu trạng thái của hệ thống (Vd: Modal mở ra từ đâu, Nút bấm đã được nhấn chưa).
- **Tốc độ (Duration)**: Nhanh gọn. Thường từ \`150ms\` đến \`300ms\`. Không bao giờ kéo dài quá \`500ms\` (Trừ các Splash screen).
- **Easing**: Dùng các đường cong easing mượt mà (Tailwind: \`ease-out\` khi vào màn hình, \`ease-in\` khi thoát ra).

## 2. Micro-interactions chuẩn
- **Hover Nút**: Thay đổi độ sáng/shadow trong \`200ms\`. (Tailwind: \`transition-all duration-200 ease-in-out\`).
- **Click Nút (Active)**: Phản hồi nhún xuống 1 chút (Scale). (Tailwind: \`active:scale-95\`).
- **Card Hover**: Trượt nhẹ lên trên (\`-translate-y-1\`) và tăng đổ bóng (\`shadow-md\`).

## 3. Chuyển cảnh (Transitions & Modals)
- **Modal/Dialog**: Nên trượt nhẹ từ dưới lên (Slide Up) hoặc phóng to nhẹ từ giữa (Scale In) kết hợp mờ dần (Fade In).
- **Dropdown/Popover**: Mở nhanh (\`150ms ease-out\`) từ điểm trigger.
- **Accordion/Collapse**: Không bị giật chiều cao. Nội dung mở ra cần mượt mà.

## 4. Performance
- Chỉ animate \`transform\` và \`opacity\`.
- TUYỆT ĐỐI KHÔNG animate các thuộc tính layout như \`width\`, \`height\`, \`top\`, \`left\`, \`margin\`, \`padding\` (Gây Reflow, làm giật lag trình duyệt).
