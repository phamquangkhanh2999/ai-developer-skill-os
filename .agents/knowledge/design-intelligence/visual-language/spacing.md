# Spacing Intelligence (Khoảng cách & Lưới)

## 1. Hệ thống Lưới 8pt (8-Point Grid System)
Khoảng cách (Margin/Padding), kích thước Icon, chiều cao Component **PHẢI** là bội số của 8 (hoặc 4 đối với chi tiết nhỏ).
- 4px (`gap-1`, `p-1`)
- 8px (`gap-2`, `p-2`)
- 12px (`gap-3`, `p-3`) - Phổ biến cho padding bên trong nút bấm.
- 16px (`gap-4`, `p-4`) - Base padding cho Card, Container nhỏ.
- 24px (`gap-6`, `p-6`) - Khoảng cách giữa các sections nhỏ.
- 32px (`gap-8`, `p-8`) - Padding tiêu chuẩn cho Container lớn.
- 48px (`gap-12`, `p-12`) / 64px (`gap-16`) - Khoảng cách giữa các Section chính của Landing Page.

## 2. Quy luật gần gũi (Law of Proximity)
Các thành phần có liên quan logic với nhau phải nằm gần nhau hơn so với các phần khác.
- Ví dụ Card: Khoảng cách giữa Icon và Text (8px) phải nhỏ hơn khoảng cách từ Text đến Border (16px).
- Label và Input: `gap-1` (4px). Giữa 2 Field Form: `gap-4` (16px). Giữa Form và Submit Button: `gap-6` (24px).

## 3. Optical Alignment (Căn chỉnh quang học)
Đôi khi một icon tròn trông sẽ nhỏ hơn một icon vuông có cùng kích thước (bounding box). Tránh dùng số lẻ, sử dụng lưới 8pt để tự động căn bằng.