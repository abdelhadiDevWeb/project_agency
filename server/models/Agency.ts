import { model, Schema, type InferSchemaType } from "mongoose";

import { hashPassword } from "../lib/password";

export const PHONE_PATTERN = /^\+?[0-9][0-9 -]{7,19}$/;

const agencySchema = new Schema(
  {
    name_agency: { type: String, required: true, trim: true, maxlength: 120 },
    /** URL or storage path of the agency logo image. */
    logo: { type: String, trim: true, default: null },
    /** URL or storage path of the agency stamp (cachet) image. */
    cachet: { type: String, trim: true, default: null },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    password: { type: String, required: true, select: false },
    phone: {
      type: [{ type: String, trim: true, match: PHONE_PATTERN }],
      validate: {
        validator: (phones: string[]) => phones.length > 0,
        message: "At least one phone number is required",
      },
    },
  },
  { timestamps: true }
);

agencySchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
});

export type AgencyDoc = InferSchemaType<typeof agencySchema>;

export const Agency = model("Agency", agencySchema, "agency");
