import mongoose, { Schema, model } from "mongoose";

interface ISession {
  userId: mongoose.Types.ObjectId;
  sessionToken: string;
  expires: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionToken: {
      type: String,
      required: true,
      unique: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// TTL index to automatically delete expired sessions
SessionSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export const Session =
  mongoose.models.Session || model<ISession>("Session", SessionSchema);
