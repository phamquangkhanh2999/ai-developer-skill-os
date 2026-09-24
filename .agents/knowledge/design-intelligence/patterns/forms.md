# Form Design Patterns

## 1. Bố cục Form (Layout)
- **1 cột (Single Column)**: Mọi Input nên xếp thành 1 cột từ trên xuống. Đây là cách dễ điền nhất. Chỉ để 2 input trên cùng 1 hàng nếu chúng có quan hệ mật thiết (Vd: Họ và Tên).
- **Top-aligned Labels**: Nhãn (Label) luôn nằm trên Input, không nằm ngang hàng. Giúp việc quét mắt nhanh hơn.
- Phân tách Form dài: Chia thành nhiều phần (Sections) hoặc dùng Stepper.

## 2. Feedback & Validation
- **Inline Validation**: Báo lỗi ngay sau khi user nhập xong (onBlur), không chờ đến lúc bấm Submit.
- **Error Messages**: Phải có màu đỏ, kèm theo Icon cảnh báo, giải thích rõ cách sửa lỗi.
- Trạng thái thành công: Có dấu check màu xanh (`text-emerald-500`) bên trong input.

## 3. Nút Submit
- Không bao giờ đặt chữ "Submit". Hãy dùng Động từ cụ thể: "Tạo tài khoản", "Lưu thay đổi", "Gửi tin nhắn".
- Khi đang xử lý, nút phải bị disable và có spinner.