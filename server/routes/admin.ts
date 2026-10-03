import { Router } from "express";
import Joi from "joi";

import { verifyPassword } from "../lib/password";
import { requireAuth, requireRole } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiters";
import { validate } from "../middleware/validate";
import { Admin } from "../models/Admin";
import { Agency, PHONE_PATTERN } from "../models/Agency";
import { adminToSession } from "../services/accounts";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("super_admin", "admin"));

const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;
const STRONG_PASSWORD_MESSAGE =
  "Password must be 8-128 characters with upper and lower case letters, a number and a symbol.";

adminRouter.patch(
  "/profile",
  authLimiter,
  validate(
    Joi.object({
      body: Joi.object({
        full_name: Joi.string().trim().min(2).max(120).required(),
        email: Joi.string().trim().lowercase().email().max(254).required(),
        current_password: Joi.string().max(128).allow(""),
      }).required(),
    })
  ),
  async (req, res, next) => {
    try {
      const { full_name, email, current_password } = req.body as {
        full_name: string;
        email: string;
        current_password?: string;
      };
      const admin = await Admin.findById(req.user!.sub).select("+password");
      if (!admin) return res.status(401).json({ ok: false, message: "Session expired" });

      if (email !== admin.email) {
        if (!current_password) {
          return res.status(400).json({ ok: false, message: "Enter your current password to change your email." });
        }
        if (!(await verifyPassword(current_password, admin.password))) {
          return res.status(400).json({ ok: false, message: "Current password is incorrect." });
        }
        const [agencyExists, adminExists] = await Promise.all([
          Agency.exists({ email }),
          Admin.exists({ email, _id: { $ne: admin._id } }),
        ]);
        if (agencyExists || adminExists) {
          return res.status(409).json({ ok: false, message: "An account with this email already exists." });
        }
        admin.email = email;
      }

      admin.full_name = full_name;
      await admin.save();
      return res.status(200).json({ ok: true, user: adminToSession(admin) });
    } catch (err) {
      if (err && typeof err === "object" && "code" in err && err.code === 11000) {
        return res.status(409).json({ ok: false, message: "An account with this email already exists." });
      }
      return next(err);
    }
  }
);

adminRouter.post(
  "/profile/password",
  authLimiter,
  validate(
    Joi.object({
      body: Joi.object({
        current_password: Joi.string().min(1).max(128).required(),
        new_password: Joi.string()
          .pattern(STRONG_PASSWORD)
          .required()
          .messages({ "string.pattern.base": STRONG_PASSWORD_MESSAGE }),
      }).required(),
    })
  ),
  async (req, res, next) => {
    try {
      const { current_password, new_password } = req.body as { current_password: string; new_password: string };
      const admin = await Admin.findById(req.user!.sub).select("+password");
      if (!admin) return res.status(401).json({ ok: false, message: "Session expired" });

      if (!(await verifyPassword(current_password, admin.password))) {
        return res.status(400).json({ ok: false, message: "Current password is incorrect." });
      }
      if (current_password === new_password) {
        return res.status(400).json({ ok: false, message: "Choose a password different from your current one." });
      }

      admin.password = new_password;
      await admin.save();
      return res.status(200).json({ ok: true });
    } catch (err) {
      return next(err);
    }
  }
);

adminRouter.post(
  "/agencies",
  validate(
    Joi.object({
      body: Joi.object({
        name_agency: Joi.string().trim().min(2).max(120).required(),
        email: Joi.string().trim().lowercase().email().max(254).required(),
        location: Joi.string().trim().min(2).max(200).required(),
        password: Joi.string()
          .pattern(STRONG_PASSWORD)
          .required()
          .messages({ "string.pattern.base": STRONG_PASSWORD_MESSAGE }),
        phone: Joi.array().items(Joi.string().trim().pattern(PHONE_PATTERN)).min(1).max(5).required(),
        logo: Joi.string().trim().uri().max(2048).allow(null),
        cachet: Joi.string().trim().uri().max(2048).allow(null),
      }).required(),
    })
  ),
  async (req, res, next) => {
    try {
      const body = req.body as { email: string };
      const [agencyExists, adminExists] = await Promise.all([
        Agency.exists({ email: body.email }),
        Admin.exists({ email: body.email }),
      ]);
      if (agencyExists || adminExists) {
        return res.status(409).json({ ok: false, message: "An account with this email already exists." });
      }

      const agency = await Agency.create(req.body);
      return res.status(201).json({
        ok: true,
        agency: {
          id: String(agency._id),
          name_agency: agency.name_agency,
          email: agency.email,
          location: agency.location,
          phone: agency.phone,
          logo: agency.logo,
          cachet: agency.cachet,
        },
      });
    } catch (err) {
      if (err && typeof err === "object" && "code" in err && err.code === 11000) {
        return res.status(409).json({ ok: false, message: "An account with this email already exists." });
      }
      return next(err);
    }
  }
);
