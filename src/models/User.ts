// src/models/User.ts
// Schema for user accounts.

import mongoose, { Schema, model } from "mongoose";
import type { IUser } from "@/types/database";

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

/* ── Indexes ─────────────────────────────────────────────────────── */
// unique indexes on username & email are already created via `unique: true`

export const User =
  mongoose.models.User || model<IUser>("User", UserSchema);
