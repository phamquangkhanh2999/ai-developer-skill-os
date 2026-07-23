# SaaS / Vercel-like Theme Intelligence

## 1. Đặc trưng thị giác (Aesthetics)
- **Tech-forward, Slick & Precise**: Đại diện cho sự hiện đại, công nghệ cao (Thường thấy ở Vercel, Linear, Stripe, Raycast).
- **Borders & Shadows**: Sử dụng viền 1px siêu mỏng (`border-slate-200` hoặc `border-white/10` trong dark mode), kết hợp với shadow có độ mờ nhạt và đổ bóng nhiều lớp (multi-layered shadows).
- **Micro-interactions**: Hover effects tinh tế, transition mượt (`transition-all duration-200`).

## 2. Dark Mode Focus (Chủ đạo)
- Thay vì đen hoàn toàn, nền chính thường là `#09090b` (Zinc 950) hoặc `#020617` (Slate 950).
- Text: Dùng các sắc thái xám khác nhau để phân cấp (Primary text: `text-slate-200`, Secondary text: `text-slate-400`).
- Glow effects: Dùng box-shadow dạng glow hoặc `radial-gradient` làm nền mờ ảo sau các nút bấm chính hoặc card quan trọng.

## 3. Typography
- **Inter** hoặc các font Sans-serif trung tính.
- Tracking (Letter spacing) hơi khít (`tracking-tight`) cho tiêu đề lớn để trông hiện đại hơn.
- Text `transparent bg-clip-text bg-gradient-to-r` cực kỳ phổ biến cho tiêu đề (H1).