import { randomBytes } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { ImageExtension } from "../lib/images";

export const BRANDING_KINDS = ["logo", "cachet"] as const;
export type BrandingKind = (typeof BRANDING_KINDS)[number];

const UPLOAD_ROOT = join(import.meta.dir, "..", "uploads");
/** Logos are public (shown on the website); stamps stay private and are only streamed to their agency. */
export const LOGO_DIR = join(UPLOAD_ROOT, "public", "logos");
const CACHET_DIR = join(UPLOAD_ROOT, "private", "cachets");

const DIRS: Record<BrandingKind, string> = { logo: LOGO_DIR, cachet: CACHET_DIR };
const PREFIX: Record<BrandingKind, string> = { logo: "logos/", cachet: "cachets/" };
const STORED_FILE = /^[a-f0-9]{24}-[a-f0-9]{16}\.(png|jpg|webp)$/;

export const IMAGE_CONTENT_TYPES: Record<ImageExtension, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
};

/** Returns the file name when `value` points at a file we stored for this kind, otherwise null. */
export function storedFileName(kind: BrandingKind, value: string | null | undefined): string | null {
  if (!value?.startsWith(PREFIX[kind])) return null;
  const file = value.slice(PREFIX[kind].length);
  return STORED_FILE.test(file) ? file : null;
}

export function storedFilePath(kind: BrandingKind, file: string): string {
  return join(DIRS[kind], file);
}

/** Writes the image and returns the value to keep on the agency document, e.g. "logos/<id>-<random>.png". */
export async function saveBrandingImage(
  kind: BrandingKind,
  agencyId: string,
  data: Buffer,
  ext: ImageExtension
): Promise<string> {
  await mkdir(DIRS[kind], { recursive: true });
  const file = `${agencyId}-${randomBytes(8).toString("hex")}.${ext}`;
  await writeFile(storedFilePath(kind, file), data, { flag: "wx" });
  return `${PREFIX[kind]}${file}`;
}

export async function removeBrandingImage(kind: BrandingKind, value: string | null | undefined): Promise<void> {
  const file = storedFileName(kind, value);
  if (file) await rm(storedFilePath(kind, file), { force: true });
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/** Public URL for the agency logo. Values set by an admin as plain URLs are passed through. */
export function logoUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const file = storedFileName("logo", value);
  if (file) return `/api/uploads/logos/${file}`;
  return isHttpUrl(value) ? value : null;
}

/** URL of the stamp for its own agency; the version query busts the browser cache after a new upload. */
export function cachetUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const file = storedFileName("cachet", value);
  if (file) return `/api/agency/branding/cachet?v=${file.split("-")[1]!.split(".")[0]}`;
  return isHttpUrl(value) ? value : null;
}
