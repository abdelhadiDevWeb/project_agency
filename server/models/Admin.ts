import { model, Schema, type InferSchemaType } from "mongoose";

import { hashPassword } from "../lib/password";

export const ADMIN_ROLES = ["super_admin", "admin"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    role: { type: String, enum: ADMIN_ROLES, required: true, default: "super_admin" },
    password: { type: String, required: true, select: false },
    full_name: { type: String, required: true, trim: true, maxlength: 120 },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
});

export type AdminDoc = InferSchemaType<typeof adminSchema>;

export const Admin = model("Admin", adminSchema, "admin");
