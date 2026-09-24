# Modals / Dialogs Intelligence

## 1. Lớp phủ (Overlay/Backdrop)
- Sử dụng nền đen mờ (`bg-black/50`) hoặc làm mờ nhẹ đằng sau (`backdrop-blur-sm`) để khóa sự chú ý vào Modal.

## 2. Cấu trúc Modal
- **Header**: Tiêu đề rõ ràng, bắt buộc có nút "X" (Đóng) ở góc trên cùng bên phải.
- **Body**: Nội dung chính, không nên để Modal quá cao gây cuộn màn hình. (Nên max-height `max-h-[80vh]` và `overflow-y-auto`).
- **Footer**: Nút hành động. Nút Primary luôn nằm bên phải, nút Hủy (Cancel) nằm bên trái.

## 3. Hành vi
- Bấm vào Overlay (bên ngoài Modal) thì Modal phải đóng lại.
- Bấm phím `Escape` thì Modal phải đóng lại.
- Focus phải bị khóa (Trap focus) bên trong Modal khi đang mở.