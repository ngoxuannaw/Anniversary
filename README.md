# Memory Galaxy 3D

Website kỷ niệm cá nhân gồm ba màn hình: bó hoa mở đầu, bức thư và vũ trụ ký ức 3D.

## Chạy dự án

```bash
npm install
npm run dev
```

Build bản production:

```bash
npm run build
```

## Cá nhân hóa

- Sửa nội dung thư trong `src/data/letter.js`.
- Sửa tiêu đề/caption trong `src/data/memories.js`.
- Thay 12 ảnh tại `public/memories/memory-01.svg` đến `memory-12.svg`. Có thể dùng `.webp` hoặc `.jpg`, sau đó cập nhật đường dẫn trong `memories.js`.

## Điều khiển

- Chuột/chạm: kéo để xoay, click cụm sao để mở ảnh.
- Bàn phím: phím trái/phải để đổi cụm sao, Enter để mở, Escape để đóng.
- Webcam: một ngón tay để điều hướng, nắm tay để giữ, xòe tay để mở ảnh. Nhận dạng tay tải mô hình MediaPipe từ CDN khi người xem bật camera.

Camera chỉ được trình duyệt cho phép khi website chạy trên `https://` hoặc
`http://localhost`. Nếu mở website bằng địa chỉ IP nội bộ qua HTTP, ví dụ
`http://192.168.x.x`, trình duyệt sẽ chặn camera. Preview camera vẫn hoạt động
ngay cả khi mô hình nhận dạng cử chỉ chưa tải được; mô hình cần kết nối mạng ở
lần tải đầu tiên.
