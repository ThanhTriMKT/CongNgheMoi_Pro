# 📝 Simple Blog

Đây là dự án blog cá nhân full-stack được xây dựng bằng **Next.js 15** và **Supabase** (Thực hành cho môn Các công nghệ mới trong phát triển phần mềm).

---

## 🛠 Hướng dẫn Khởi chạy Web

Do dự án sử dụng **Supabase bản Miễn phí** để quản lý cơ sở dữ liệu (Database), nếu sau một thời gian ngắn không có kết nối nào hoặc không ai truy cập, hệ thống Supabase sẽ tự động bị **Tạm dừng (Paused)** để tiết kiệm tài nguyên. 

**VUI LÒNG ĐỌC KỸ VÀ LÀM ĐÚNG THỨ TỰ CÁC BƯỚC SAU ƯỚC KHI CHẠY CODE:**

### Bước 1: Mở / Khôi phục Database (Supabase)
**Đây là bước bắt buộc.** Nếu bỏ qua bước này, trang web sẽ bị lỗi tải mãi không lên và in ra lỗi `ECONNREFUSED` trong Terminal.

1. Truy cập vào trang quản lý: **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Đăng nhập bằng tài khoản của bạn (thường là tài khoản GitHub đã dùng để tạo project này).
3. Trong màn hình Dashboard, tìm project có tên của bạn (URL API hiện tại đang sử dụng là `https://jpcdckzvulhqgyupmqxy.supabase.co`).
4. Nếu thấy chữ **"Paused"** màu cam/đỏ xuất hiện, hãy nhấn ngay vào đó.
5. Click chọn nút **"Restore project"** (hoặc **"Unpause"**) và chờ khoảng 1 - 2 phút cho đến khi trạng thái chuyển sang màu xanh lá (Active).

### Bước 2: Khởi chạy dự án trên máy tính
Khi bảo đảm Supabase đã chạy lại bình thường ở bước 1, bạn mở máy tính lên và làm tiếp:

1. **Mở Terminal** của máy Mac (Dùng `Cmd + Space` > gõ "Terminal" > nhấn Enter).
2. Di chuyển vào thư mục code:
   ```bash
   cd /Applications/Mac/CongNgheMoi_Pro/simple-blog
   ```
3. **Nếu chưa cài đặt** (chỉ cần làm 1 lần), chạy lệnh tải các gói thư viện:
   ```bash
   npm install
   ```
4. **Khởi động server dự án**:
   ```bash
   npm run dev
   ```
5. Cuối cùng, mở trình duyệt (Google Chrome, Cốc Cốc, Safari...) và vào địa chỉ sau:  
   👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🛑 Khắc phục lỗi

**Lỗi 1: Web xoay tròn mãi không chịu tải, trong Terminal báo "fetch failed" hoặc "ECONNREFUSED".**
* **Nguyên nhân:** Có thể Database trên Supabase chưa kịp khôi phục hoặc lại bị Pause.
* **Cách sửa:** Bạn phải vào lại Supabase Dashboard làm theo Bước 1 để bật lại database, sau đó ra ngoài tải lại trang web là sẽ hết.

**Lỗi 2: Lỗi chưa lưu biến môi trường**
* Hãy chắc chắn rằng bạn có file `.env.local` ở trong thư mục `simple-blog` và bên trong đó phải chứa các khoá `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
