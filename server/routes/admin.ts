import { Router } from "express";
import Joi from "joi";

import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { Admin } from "../models/Admin";
import { Agency, PHONE_PATTERN } from "../models/Agency";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("super_admin", "admin"));

const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;

adminRouter.post(
  "/agencies",
  validate(
    Joi.object({
      body: Joi.object({
        name_agency: Joi.string().trim().min(2).max(120).required(),
        email: Joi.string().trim().lowercase().email().max(254).required(),
        location: Joi.string().trim().min(2).max(200).required(),
        password: Joi.string().pattern(STRONG_PASSWORD).required().messages({
          "string.pattern.base":
            "Password must be 8-128 characters with upper and lower case letters, a number and a symbol.",
        }),
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
