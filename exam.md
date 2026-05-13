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