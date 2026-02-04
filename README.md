# Hướng dẫn cài đặt và chạy dự án TripNest

Tài liệu này hướng dẫn cách cài đặt môi trường và chạy dự án TripNest (Backend và Frontend).

## Yêu cầu hệ thống

- Node.js (Phiên bản LTS được khuyến nghị)
- PostgreSQL (Cơ sở dữ liệu)
- npm (Trình quản lý gói đi kèm với Node.js)

## Cấu trúc dự án

Dự án bao gồm hai thư mục chính:

- backend: Mã nguồn Backend (NestJS)
- frontend: Mã nguồn Frontend (Next.js)

## Cài đặt và chạy Backend

1. Di chuyển vào thư mục backend:
   cd backend

2. Cài đặt các gói phụ thuộc:
   npm install

3. Cấu hình biến môi trường:
   - Tạo file .env từ file .env.example (nếu có) hoặc tạo mới.
   - Cập nhật thông tin kết nối cơ sở dữ liệu (DATABASE_URL) trong file .env.

4. Đồng bộ cơ sở dữ liệu (Prisma):
   npx prisma generate
   npx prisma migrate dev

   (Hoặc dùng lệnh "npx prisma db push" nếu muốn thay đổi trực tiếp cấu trúc DB mà không thao tác migrate)

5. Chạy ứng dụng ở chế độ phát triển:
   npm run start:dev

   Server sẽ khởi chạy tại địa chỉ mặc định (thường là http://localhost:3000 hoặc cổng được cấu hình).

## Cài đặt và chạy Frontend

1. Di chuyển vào thư mục frontend (từ thư mục gốc):
   cd frontend

2. Cài đặt các gói phụ thuộc:
   npm install

3. Cấu hình biến môi trường:
   - Tạo file .env.local nếu cần thiết để cấu hình API URL kết nối đến Backend.

4. Chạy ứng dụng ở chế độ phát triển:
   npm run dev

   Ứng dụng sẽ khởi chạy tại http://localhost:3001 (hoặc 3000 nếu backend chạy cổng khác).

## Các lệnh thường dùng

### Backend

- npm run build: Biên dịch dự án sang mã JavaScript (thư mục dist).
- npm run start: Chạy ứng dụng từ mã đã biên dịch.
- npm run lint: Kiểm tra lỗi cú pháp (Linting).

### Frontend

- npm run build: Biên dịch ứng dụng cho môi trường Production.
- npm run start: Chạy ứng dụng Production.
- npm run lint: Kiểm tra lỗi cú pháp.

## Lưu ý

- Đảm bảo PostgreSQL đang chạy trước khi khởi động Backend.
- Nếu cổng (port) bị trùng, hãy kiểm tra và đổi cổng trong file cấu hình hoặc file .env.
