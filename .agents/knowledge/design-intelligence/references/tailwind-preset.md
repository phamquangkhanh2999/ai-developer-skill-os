# Tailwind Preset Recommendations

## 1. Tùy chỉnh Cốt lõi (Core Configurations)
Để đạt chuẩn Pro-max, cấu hình `tailwind.config.js` nên thêm các mở rộng sau:

- **Colors**: Sử dụng `colors.slate` hoặc `colors.zinc` làm nền tảng xám.
- **Fonts**: 
  - `sans: ['Inter', 'sans-serif']` (Hiện đại, sạch sẽ)
  - `serif: ['Merriweather', 'serif']` (Cho typography)
  - `mono: ['JetBrains Mono', 'monospace']` (Cho code)

## 2. Custom Utilities
- Định nghĩa các bóng đổ riêng mượt hơn mặc định của Tailwind (Radix UI shadow patterns).
- Định nghĩa keyframes cho micro-animations (slideUpAndFade, scaleIn).

## 3. Design System Plugin
Khuyến khích tích hợp CVA (Class Variance Authority) hoặc Tailwind Merge để quản lý state của Component dễ dàng hơn trong React/Vue.