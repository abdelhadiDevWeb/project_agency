import express, { Router, type RequestHandler } from "express";
import Joi from "joi";

import { detectImageType, IMAGE_MIME_TYPES, MAX_IMAGE_BYTES } from "../lib/images";
import { verifyPassword } from "../lib/password";
import { requireAuth, requireRole } from "../middleware/auth";
import { authLimiter, uploadLimiter } from "../middleware/rateLimiters";
import { validate } from "../middleware/validate";
import { Admin } from "../models/Admin";
import { Agency, PHONE_PATTERN } from "../models/Agency";
import {
  BRANDING_KINDS,
  cachetUrl,
  IMAGE_CONTENT_TYPES,
  logoUrl,
  removeBrandingImage,
  saveBrandingImage,
  storedFileName,
  storedFilePath,
  type BrandingKind,
} from "../services/branding";

export const agencyRouter = Router();

agencyRouter.use(requireAuth, requireRole("agency"));

const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;
const STRONG_PASSWORD_MESSAGE =
  "Password must be 8-128 characters with upper and lower case letters, a number and a symbol.";

type AgencyFields = {
  _id: unknown;
  name_agency: string;
  email: string;
  location: string;
  phone: string[];
  logo?: string | null;
  cachet?: string | null;
};

function toAccount(agency: AgencyFields) {
  return {
    id: String(agency._id),
    name: agency.name_agency,
    email: agency.email,
    location: agency.location,
    phone: agency.phone,
    logoUrl: logoUrl(agency.logo),
    cachetUrl: cachetUrl(agency.cachet),
  };
}

function isDuplicateKey(err: unknown): boolean {
  return Boolean(err && typeof err === "object" && "code" in err && err.code === 11000);
}

agencyRouter.get("/profile", async (req, res, next) => {
  try {
    const agency = await Agency.findById(req.user!.sub).lean();
    if (!agency) return res.status(401).json({ ok: false, message: "Session expired" });
    return res.status(200).json({ ok: true, account: toAccount(agency) });
  } catch (err) {
    return next(err);
  }
});

agencyRouter.patch(
  "/profile",
  authLimiter,
  validate(
    Joi.object({
      body: Joi.object({
        name_agency: Joi.string().trim().min(2).max(120).required(),
        email: Joi.string().trim().lowercase().email().max(254).required(),
        location: Joi.string().trim().min(2).max(200).required(),
        phone: Joi.array()
          .items(
            Joi.string()
              .trim()
              .pattern(PHONE_PATTERN)
              .messages({ "string.pattern.base": "Enter phone numbers with digits only, e.g. +213 555 12 34 56." })
          )
          .min(1)
          .max(5)
          .unique()
          .required(),
        current_password: Joi.string().max(128).allow(""),
      }).required(),
    })
  ),
  async (req, res, next) => {
    try {
      const { name_agency, email, location, phone, current_password } = req.body as {
        name_agency: string;
        email: string;
        location: string;
        phone: string[];
        current_password?: string;
      };
      const agency = await Agency.findById(req.user!.sub).select("+password");
      if (!agency) return res.status(401).json({ ok: false, message: "Session expired" });

      if (email !== agency.email) {
        if (!current_password) {
          return res.status(400).json({ ok: false, message: "Enter your current password to change your email." });
        }
        if (!(await verifyPassword(current_password, agency.password))) {
          return res.status(400).json({ ok: false, message: "Current password is incorrect." });
        }
        const [agencyExists, adminExists] = await Promise.all([
          Agency.exists({ email, _id: { $ne: agency._id } }),
          Admin.exists({ email }),
        ]);
        if (agencyExists || adminExists) {
          return res.status(409).json({ ok: false, message: "An account with this email already exists." });
        }
        agency.email = email;
      }

      agency.name_agency = name_agency;
      agency.location = location;
      agency.phone = phone;
      await agency.save();
      return res.status(200).json({ ok: true, account: toAccount(agency) });
    } catch (err) {
      if (isDuplicateKey(err)) {
        return res.status(409).json({ ok: false, message: "An account with this email already exists." });
      }
      return next(err);
    }
  }
);

agencyRouter.post(
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
      const agency = await Agency.findById(req.user!.sub).select("+password");
      if (!agency) return res.status(401).json({ ok: false, message: "Session expired" });

      if (!(await verifyPassword(current_password, agency.password))) {
        return res.status(400).json({ ok: false, message: "Current password is incorrect." });
      }
      if (current_password === new_password) {
        return res.status(400).json({ ok: false, message: "Choose a password different from your current one." });
      }

      agency.password = new_password;
      await agency.save();
      return res.status(200).json({ ok: true });
    } catch (err) {
      return next(err);
    }
  }
);

const parseImageBody = express.raw({ type: [...IMAGE_MIME_TYPES], limit: MAX_IMAGE_BYTES });

/** Raw image body parser that answers 413 / 400 itself instead of falling through to the 500 handler. */
const readImage: RequestHandler = (req, res, next) => {
  parseImageBody(req, res, (err?: unknown) => {
    if (!err) return next();
    const status = err && typeof err === "object" && "status" in err ? Number(err.status) : 400;
    if (status === 413) return res.status(413).json({ ok: false, message: "Images must be 2 MB or smaller." });
    return res.status(400).json({ ok: false, message: "The image could not be read." });
  });
};

function brandingKind(value: unknown): BrandingKind | null {
  return typeof value === "string" && (BRANDING_KINDS as readonly string[]).includes(value)
    ? (value as BrandingKind)
    : null;
}

agencyRouter.put("/branding/:kind", uploadLimiter, readImage, async (req, res, next) => {
  try {
    const kind = brandingKind(req.params.kind);
    if (!kind) return res.status(404).json({ ok: false, message: "Not found" });

    const data = req.body as unknown;
    const ext = Buffer.isBuffer(data) && data.length > 0 ? detectImageType(data) : null;
    if (!ext || !Buffer.isBuffer(data)) {
      return res.status(415).json({ ok: false, message: "Upload a PNG, JPG or WebP image." });
    }

    const agency = await Agency.findById(req.user!.sub);
    if (!agency) return res.status(401).json({ ok: false, message: "Session expired" });

    const previous = agency[kind];
    const stored = await saveBrandingImage(kind, String(agency._id), data, ext);
    agency[kind] = stored;
    try {
      await agency.save();
    } catch (err) {
      await removeBrandingImage(kind, stored);
      throw err;
    }
    await removeBrandingImage(kind, previous);
    return res.status(200).json({ ok: true, account: toAccount(agency) });
  } catch (err) {
    return next(err);
  }
});

agencyRouter.delete("/branding/:kind", uploadLimiter, async (req, res, next) => {
  try {
    const kind = brandingKind(req.params.kind);
    if (!kind) return res.status(404).json({ ok: false, message: "Not found" });

    const agency = await Agency.findById(req.user!.sub);
    if (!agency) return res.status(401).json({ ok: false, message: "Session expired" });

    const previous = agency[kind];
    agency[kind] = null;
    await agency.save();
    await removeBrandingImage(kind, previous);
    return res.status(200).json({ ok: true, account: toAccount(agency) });
  } catch (err) {
    return next(err);
  }
});

agencyRouter.get("/branding/cachet", async (req, res, next) => {
  try {
    const agency = await Agency.findById(req.user!.sub).select("cachet").lean();
    const file = storedFileName("cachet", agency?.cachet);
    if (!file) return res.status(404).json({ ok: false, message: "Not found" });

    const ext = file.split(".").pop() as keyof typeof IMAGE_CONTENT_TYPES;
    res.setHeader("Content-Type", IMAGE_CONTENT_TYPES[ext]);
    res.setHeader("Cache-Control", "private, max-age=86400");
    res.setHeader("Content-Disposition", "inline");
    return res.sendFile(storedFilePath("cachet", file), (err) => {
      if (err && !res.headersSent) res.status(404).json({ ok: false, message: "Not found" });
    });
  } catch (err) {
    return next(err);
  }
});
