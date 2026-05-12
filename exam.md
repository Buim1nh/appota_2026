**ĐỀ BÀI TEST CASE VỊ TRÍ**

**"FULLSTACK ENGINEER TRAINEE"**

### **Bài 1: Game Operation Dashboard**

**Mô tả:** Bạn cần xây dựng một trang **Game Dashboard** để đội game operation theo dõi các chỉ số quan trọng của game.

**Yêu cầu:**

#### **Part A - Frontend (2 tiếng)**

1 Header với logo game, ngày giờ hiện tại

2 Sidebar navigation với các menu:

 Dashboard

 Events

 Top Players

 Revenue

3 Card hiển thị các metrics:

 Daily Active Users (DAU)

 Revenue của ngày

 Event đang active

 Top 5 người chơi nạp tiền

4 Bảng danh sách event với columns:

 Event ID, Event Name, Start Date, End Date, Status

5 Filter theo ngày và status

UI Mockup đơn giản:

┌────────────────────────────────────────┐

│ 🎮 Game Dashboard 👤 Admin ▼ │

├──────┬─────────────────────────────────┤

│ Menu │ DAU: 12,345 │ Revenue: 50M │

│ │ Active: 3 │ Top: 5 users │

├──────┴─────────────────────────────────┤

│ Event Table with filter + pagination │

└────────────────────────────────────────┘

**Hints cho trainee:**

- Dùng React (component cơ bản, props, state)
- CSS: TailwindCSS hoặc inline styles
- Dùng mock data (JSON array trong code)
- Format số: 12,345 → 12.3K

#### **Part B - Backend API (1.5 tiếng)**

1 API endpoint GET /api/events

 Query params: page, limit

 Response: { data: \[\], total: 0, page: 1, limit: 20 }

2 API endpoint GET /api/dashboard/stats

 Response: { dau, revenue, active_events, top_players }

3 API endpoint POST /api/events (tạo event mới)

 Body: { name, start_date, end_date }

 Response: { event_id, success: true }

4 Database schema:

 events: id, name, start_date, end_date, status, created_at

 users: id, username, email, created_at

 transactions: id, user_id, amount, created_at

5 Không cần authentication (bỏ qua JWT)

**Hints cho trainee:**

- Node.js + Express (basic routing)
- Database: SQLite (đơn giản, không cần cài đặt)
- Không cần ORM phức tạp, có thể dùng raw SQL

### **Bài 2: AI Game Operation System (1.5 tiếng)**

**Mô tả:**Bạn cần xây dựng module **AI Game Operation** để hỗ trợ đội operation tự động hóa các tác vụ.

**Yêu cầu:**

1 Module phân tích hành vi người chơi (Player Behavior)

 API: POST /api/ai/analyze-player

 Input: { player_id, login_count, session_duration, purchase_count }

 Logic đơn giản:

 login < 3 lần → "new_player"

 login >= 3 và purchase > 0 → "active_payer"

 login >= 10 và purchase = 0 → "churn_risk"

2 Module gợi ý push notification

 API: POST /api/ai/suggest-push

 Input: { player_segment }

 Output: { message: "Chào mừng newbie! Nhận quà free ngay" }

 Logic:

 new_player → gửi welcome message

 active_payer → gửi promotion

 churn_risk → gửi retention offer

3 Module tạo báo cáo đơn giản

 API: GET /api/ai/report

 Logic: Đếm số users theo segment

 Output: { new: 10, active: 25, churn: 5 }

**Hints cho trainee:**

- Dùng if/else đơn giản (không cần ML/AI)
- Tập trung vào logic và clean code
- Có thể hard-code một số message templates

### **Bài 3: Game Event Management (1 tiếng)**

**Mô tả:**Module quản lý event cho game.

**Yêu cầu:**

1 CRUD Event cơ bản

 GET /api/events (list - đã có ở Bài 1)

 POST /api/events (create - đã có ở Bài 1)

 GET /api/events/:id (detail)

 PUT /api/events/:id (update)

 DELETE /api/events/:id (delete)

2 Kiểm tra điều kiện tham gia event đơn giản

 Input: { user_level, user_recharge, event_min_level, event_min_recharge }

 Output: { eligible: true/false }

3 Leaderboard đơn giản

 GET /api/events/:id/leaderboard

 Logic: Sắp xếp users theo score, lấy top 10

 Pagination đơn giản (limit, offset)

Ví dụ Event:

{

id: "EVT001",

name: "Sự kiện đua top Nạp tiền",

start_date: "2026-05-15",

end_date: "2026-05-21",

min_level: 5,

min_recharge: 50000

}

**Hints cho trainee:**

- Tập trung vào CRUD operations
- Logic kiểm tra eligibility đơn giản với if/else
- Không cần làm rules engine phức tạp

### **Bài 4: Đề bài mở - Team Project**

**Mô tả:** Đây là "sân chơi tự do" cho team. Các bạn được toàn quyền lựa chọn ý tưởng, tech stack và cách triển khai. Mục tiêu là tạo ra một **sản phẩm demo được** giải quyết một vấn đề thực tế (ưu tiên trong domain game operation, nhưng không bắt buộc).

**Yêu cầu chung:**

- **Goal output cuối** - bắt buộc có đủ 3 thứ:
  - Một sản phẩm chạy được (web app / API / CLI tool / chatbot / mobile app...)
  - Demo flow rõ ràng: input → xử lý → output
  - File README.md mô tả: ý tưởng, cách chạy, phân chia công việc team
- **Stack hoàn toàn tự chọn:**
  - Frontend: React / Vue / Svelte / Next.js / Vanilla... tùy team
  - Backend: Node.js / Python (FastAPI, Flask) / Go / Java... tùy team
  - Database: SQLite / PostgreSQL / MongoDB / JSON file đều OK
  - AI/LLM (optional): OpenAI / Claude / Gemini API nếu cần
  - Deploy (bonus): Vercel / Railway / Render / localhost cũng được

**Một số gợi ý ý tưởng (chỉ tham khảo, không bắt buộc):**

- Chatbot Q&A tự động cho player (FAQ bot)
- Tool tự động generate báo cáo daily/weekly cho game manager
- Gacha/random reward simulator với rate config
- Personalize push notification scheduler with AI + template builder
- Mini predictor: dự đoán DAU tuần tới từ data có sẵn
- Internal note system cho operation team chia sẻ insight về player
- Tournament bracket generator
- Landing page mobile-first cho event marketing
- Hoặc bất kỳ ý tưởng nào team thấy thú vị

**Yêu cầu về team collaboration (quan trọng):**

- **Chia role rõ ràng** - ví dụ: Frontend Lead, Backend Lead, AI/Logic, Design/UX, Tester. Mỗi người 1 vai trò chính.
- **Quản lý code trên Github:** Mọi thành viên đều phải commit code (trừ các vị trí support khác không yêu cầu code) - Git history sẽ được kiểm tra, không chấp nhận 1 người commit hết.
- **Demo cuối buổi**: Team Lead sẽ phải trình bày sản phẩm, và công việc của mỗi người.

## **4 Tiêu chí chấm điểm**

| Tiêu chí                                | Điểm | Ghi chú                                   |
| --------------------------------------- | ---- | ----------------------------------------- |
| Code clean, có comment, đặt tên rõ ràng | 25%  | Quan trọng nhất - đánh giá tư duy code    |
| Logic đúng, xử lý edge cases cơ bản     | 25%  | Không cần perfect, miễn là đúng direction |
| UI hoạt động được, responsive           | 20%  | Không cần đẹp, miễn là functional         |
| API trả về đúng data format             | 15%  | REST conventions cơ bản                   |
| Database schema hợp lý                  | 10%  | Hiểu relationships cơ bản                 |
| Git commit history có và rõ ràng        | 5%   | Commit từng bước (không commit 1 lần)     |

## **5 Thời gian**

| Phần                     | Thời gian   |
| ------------------------ | ----------- |
| Bài 1A - Frontend        | 2 tiếng     |
| Bài 1B - Backend         | 1.5 tiếng   |
| Bài 2 - AI System        | 1.5 tiếng   |
| Bài 3 - Event Management | 1 tiếng     |
| **Tổng**                 | **6 tiếng** |