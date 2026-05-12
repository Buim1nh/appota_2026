Hệ thống cơ sở dữ liệu được thiết kế tập trung vào hiệu suất truy xuất (read-heavy), khả năng mở rộng quy mô (MMORPG-scale), và tính linh hoạt cho các phép tính chỉ số phức tạp trong Dungeons & Dragons.

### 1. Danh sách Collection và Chiến lược Thiết kế

Thiết kế kết hợp giữa Embedded (Nhúng) và Referenced (Tham chiếu) để đạt hiệu suất tối đa.

* `Users`: Lưu thông tin tài khoản người dùng.
* `Items`: Lưu thông tin trang bị, vũ khí, áo giáp, phụ kiện. (Referenced)
* `Spells`: Lưu thông tin phép thuật. (Referenced)
* `GameRules`: Lưu thông tin Class, Race, Background. (Referenced)
* `Builds`: Lưu thông tin nhân vật/loadout cụ thể. (Embedded một phần và Referenced)

**Quyết định thiết kế (Embedded vs Referenced):**

* **Tham chiếu (Referenced):** Các dữ liệu tĩnh như `Items`, `Spells`, `Classes`, `Races` được tách riêng thành các collection độc lập để tránh dư thừa dữ liệu, dễ dàng cập nhật thông số chung và hỗ trợ nội dung tùy chỉnh (homebrew).
* **Nhúng (Embedded):** Các chỉ số tĩnh (Base Stats), chỉ số phái sinh (Derived Stats) và bộ tính toán chỉ số (Calculated Modifiers) được nhúng trực tiếp vào collection `Builds`. Thiết kế này giúp hệ thống chỉ cần thực hiện một lần truy vấn duy nhất để tải toàn bộ thông tin nhân vật, đáp ứng yêu cầu tải trang nhanh.

### 2. Cấu trúc thư mục (NextJS)

```text
src/
├── lib/
│   └── mongoose.ts          # Kết nối cơ sở dữ liệu
├── models/
│   ├── User.ts              # Schema người dùng
│   ├── Item.ts              # Schema trang bị, vũ khí
│   ├── Spell.ts             # Schema phép thuật
│   ├── GameRule.ts          # Schema Class, Race
│   └── Build.ts             # Schema Loadout/Nhân vật
├── types/
│   ├── database.d.ts        # TypeScript Interfaces
│   └── formulas.d.ts        # Interfaces cho Formula Engine

```

### 3. TypeScript Interfaces

```typescript
// src/types/formulas.d.ts
export interface ICondition {
  field: string; // VD: "hp.current", "equipment.hands"
  operator: "eq" | "gt" | "lt" | "gte" | "lte" | "contains";
  value: any; // VD: 50, "dual_wielding"
}

export interface IModifier {
  targetStat: string; // VD: "ac", "damage.fire"
  type: "flat" | "multiplier" | "dice" | "stat_bonus";
  value: number | string; // VD: 2, "1d4", "dex"
  conditions?: ICondition[];
}

// src/types/database.d.ts
import { Document, Types } from 'mongoose';

export interface IBaseStats {
  str: number; dex: number; con: number;
  int: number; wis: number; cha: number;
}

export interface IDerivedStats {
  hp: { max: number; current: number; temp: number };
  ac: number;
  initiative: number;
  speed: number;
  proficiencyBonus: number;
  spellSaveDC: number;
  attackBonus: number;
  carryWeight: { current: number; max: number };
}

export interface IItem extends Document {
  name: string;
  type: "weapon" | "armor" | "shield" | "accessory" | "consumable";
  rarity: "common" | "uncommon" | "rare" | "very_rare" | "legendary" | "artifact";
  requiresAttunement: boolean;
  modifiers: IModifier[];
  weaponProps?: {
    damageDice: string;
    damageType: string;
    properties: string[]; // "finesse", "versatile", "two-handed"
  };
  source: string; // "official" | "homebrew"
  edition: string;
}

export interface ISpell extends Document {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  duration: string;
  components: { v: boolean; s: boolean; m: string };
  modifiers: IModifier[];
  source: string;
  edition: string;
}

export interface IBuild extends Document {
  userId: Types.ObjectId;
  name: string;
  level: number;
  classRef: Types.ObjectId;
  subclassId: Types.ObjectId;
  raceRef: Types.ObjectId;
  baseStats: IBaseStats;
  derivedStats: IDerivedStats; // Cached data
  equipment: {
    head?: Types.ObjectId;
    chest?: Types.ObjectId;
    mainHand?: Types.ObjectId;
    offHand?: Types.ObjectId;
    ring1?: Types.ObjectId;
    ring2?: Types.ObjectId;
    amulet?: Types.ObjectId;
  };
  spells: Types.ObjectId[];
  feats: Types.ObjectId[];
  activeModifiers: IModifier[]; // Engine tính toán
  shareId: string;
  isPublic: boolean;
  optimizationScore: number;
  tags: string[];
}

```

### 4. Mongoose Schemas

```typescript
// src/models/Build.ts
import mongoose, { Schema, model } from 'mongoose';
import { IBuild } from '../types/database';

const ConditionSchema = new Schema({
  field: { type: String, required: true },
  operator: { type: String, enum: ["eq", "gt", "lt", "gte", "lte", "contains"], required: true },
  value: { type: Schema.Types.Mixed, required: true }
}, { _id: false });

const ModifierSchema = new Schema({
  targetStat: { type: String, required: true },
  type: { type: String, enum: ["flat", "multiplier", "dice", "stat_bonus"], required: true },
  value: { type: Schema.Types.Mixed, required: true },
  conditions: [ConditionSchema]
}, { _id: false });

const BuildSchema = new Schema<IBuild>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, maxlength: 100 },
  level: { type: Number, required: true, min: 1, max: 20 },
  classRef: { type: Schema.Types.ObjectId, ref: 'GameRule', required: true },
  subclassId: { type: Schema.Types.ObjectId, ref: 'GameRule' },
  raceRef: { type: Schema.Types.ObjectId, ref: 'GameRule', required: true },
  baseStats: {
    str: { type: Number, default: 10 }, dex: { type: Number, default: 10 },
    con: { type: Number, default: 10 }, int: { type: Number, default: 10 },
    wis: { type: Number, default: 10 }, cha: { type: Number, default: 10 }
  },
  derivedStats: {
    hp: { max: Number, current: Number, temp: Number },
    ac: { type: Number, default: 10 },
    initiative: { type: Number, default: 0 },
    speed: { type: Number, default: 30 },
    proficiencyBonus: { type: Number, default: 2 },
    spellSaveDC: { type: Number, default: 10 },
    attackBonus: { type: Number, default: 0 },
    carryWeight: { current: Number, max: Number }
  },
  equipment: {
    head: { type: Schema.Types.ObjectId, ref: 'Item' },
    chest: { type: Schema.Types.ObjectId, ref: 'Item' },
    mainHand: { type: Schema.Types.ObjectId, ref: 'Item' },
    offHand: { type: Schema.Types.ObjectId, ref: 'Item' },
    ring1: { type: Schema.Types.ObjectId, ref: 'Item' },
    ring2: { type: Schema.Types.ObjectId, ref: 'Item' },
    amulet: { type: Schema.Types.ObjectId, ref: 'Item' }
  },
  spells: [{ type: Schema.Types.ObjectId, ref: 'Spell' }],
  feats: [{ type: Schema.Types.ObjectId, ref: 'GameRule' }],
  activeModifiers: [ModifierSchema],
  shareId: { type: String, required: true, unique: true, index: true },
  isPublic: { type: Boolean, default: false },
  optimizationScore: { type: Number, default: 0 },
  tags: [{ type: String, index: true }]
}, { timestamps: true });

export const Build = mongoose.models.Build || model<IBuild>('Build', BuildSchema);

```

### 5. Chiến lược Indexing

* **Builds Collection:**
* `shareId_1`: Unique Index. Hỗ trợ truy xuất tức thì qua Public URL.
* `userId_1_updatedAt_-1`: Compound Index. Hỗ trợ truy xuất danh sách loadout của một người dùng, sắp xếp theo thời gian cập nhật.
* `isPublic_1_tags_1`: Compound Index. Tối ưu hóa chức năng tìm kiếm và lọc các build công khai dựa trên thẻ (tag).


* **Items / Spells Collection:**
* `name_text`: Text Index. Tối ưu cho thanh tìm kiếm trang bị/phép thuật.
* `type_1_rarity_1`: Compound Index. Tối ưu việc lọc trang bị trong giao diện người dùng.



### 6. Tài liệu JSON mẫu (Build Document)

```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "userId": "64f1a2b3c4d5e6f7a8b9a111",
  "name": "Fire Battlemage",
  "level": 8,
  "classRef": "64f1a2b3c4d5e6f7a8b9b222",
  "raceRef": "64f1a2b3c4d5e6f7a8b9b333",
  "baseStats": {
    "str": 10, "dex": 14, "con": 16, "int": 18, "wis": 10, "cha": 8
  },
  "derivedStats": {
    "hp": { "max": 66, "current": 66, "temp": 0 },
    "ac": 16,
    "initiative": 2,
    "speed": 30,
    "proficiencyBonus": 3,
    "spellSaveDC": 15,
    "attackBonus": 7,
    "carryWeight": { "max": 150, "current": 45.5 }
  },
  "equipment": {
    "chest": "64f1a2b3c4d5e6f7a8b9e444",
    "mainHand": "64f1a2b3c4d5e6f7a8b9e555"
  },
  "spells": ["64f1a2b3c4d5e6f7a8b9s666", "64f1a2b3c4d5e6f7a8b9s777"],
  "activeModifiers": [
    {
      "targetStat": "damage.fire",
      "type": "multiplier",
      "value": 1.05,
      "conditions": [
        { "field": "hp.current", "operator": "lt", "value": 33 }
      ]
    },
    {
      "targetStat": "ac",
      "type": "flat",
      "value": 2,
      "conditions": [
        { "field": "equipment.offHand", "operator": "gte", "value": "1" }
      ]
    }
  ],
  "shareId": "fire-mage-xyz123",
  "isPublic": true,
  "optimizationScore": 85,
  "tags": ["dps", "fire", "mid-range"]
}

```

### 7. Giải thích Sơ đồ quan hệ

* **1:N (Một - Nhiều):** `User` -> `Builds`. Một người dùng tạo nhiều loadouts.
* **N:M (Nhiều - Nhiều):** `Builds` <-> `Items`, `Spells`. Nhiều build có thể trang bị cùng một vật phẩm/phép thuật và một build chứa nhiều vật phẩm/phép thuật. Được giải quyết thông qua mảng ObjectIds (`spells: [ObjectId]`) hoặc cấu trúc key-value (`equipment: { mainHand: ObjectId }`).
* Khóa ngoại (References) không sử dụng DBRef của MongoDB mà sử dụng tham chiếu Manual (lưu ObjectId thuần) kết hợp hàm `populate()` của Mongoose để tăng tốc độ truy vấn ở tầng ứng dụng.

### 8. Tối ưu hóa, Kiểm chuẩn và Khả năng Mở rộng

* **Tối ưu hóa (Caching Cached Stats):** Field `derivedStats` đóng vai trò là Cache Tier 1. Mọi tính toán phức tạp về chỉ số (AC, hệ số tấn công, sức chứa) được tính toán ở backend tại thời điểm *Lưu (Save)* document và ghi thẳng vào `derivedStats`. Khi hệ thống hiển thị hoặc chia sẻ link, chỉ cần đọc trực tiếp field này, triệt tiêu hoàn toàn độ trễ tính toán runtime.
* **Kiểm chuẩn dữ liệu (Data Validation):** Lớp validation nghiêm ngặt thực hiện tại backend thông qua thư viện Zod kết hợp Mongoose Schema Validators. Đảm bảo cấu trúc dữ liệu của Formula Engine (các toán tử `operator`, `targetStat`) phải nằm trong danh sách Enum hợp lệ. Ngăn chặn NoSQL Injection qua các câu lệnh điều kiện.
* **Chiến lược mở rộng (Extensibility):**
* Hỗ trợ đa phiên bản (Multi-edition) và Homebrew: Mọi entity tĩnh (`Item`, `Spell`, `GameRule`) đều tích hợp trường `source` và `edition`.
* Sẵn sàng cho Combat Simulation / AI: Việc chuẩn hóa các logic tính toán thành dạng cấu trúc `IModifier` (chứa `conditions` và `targetStat`) cho phép các service bên thứ ba (Combat Engine, AI Recommender) dễ dàng đọc, parse cấu trúc JSON thành luồng điều kiện (Decision Tree) để giả lập trận đánh hoặc đề xuất thay đổi trang bị nhằm tối đa hóa `optimizationScore`.