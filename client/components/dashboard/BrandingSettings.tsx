"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type DragEvent } from "react";
import { ImageUp, LoaderCircle, Stamp, Trash2, Upload, type LucideIcon } from "lucide-react";

import { formatDate, formatDZD } from "@/lib/format";

import { errorFrom, NETWORK_ERROR, NoticeBanner, type Notice } from "./account-forms";
import { buttonSecondary, Panel } from "./ui";

type Kind = "logo" | "cachet";
type BrandingAccount = { logoUrl: string | null; cachetUrl: string | null };

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 2 * 1024 * 1024;

const CARDS: Record<Kind, { title: string; description: string; hint: string; icon: LucideIcon }> = {
  logo: {
    title: "Agency logo",
    description: "Shown in your dashboard, on your offers and on booking vouchers.",
    hint: "Square image, at least 256 × 256 px. A transparent PNG looks best.",
    icon: ImageUp,
  },
  cachet: {
    title: "Agency stamp (cachet)",
    description: "Printed on vouchers and invoices. Only you can see the uploaded file.",
    hint: "Scan of your official stamp on a white or transparent background.",
    icon: Stamp,
  },
};

/** Checkerboard so transparent images stay readable. */
const checkerboard = {
  backgroundColor: "#ffffff",
  backgroundImage:
    "linear-gradient(45deg, #eef5f4 25%, transparent 25%), linear-gradient(-45deg, #eef5f4 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eef5f4 75%), linear-gradient(-45deg, transparent 75%, #eef5f4 75%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
};

function ImageUploadCard({
  kind,
  url,
  onChange,
}: {
  kind: Kind;
  url: string | null;
  onChange: (account: BrandingAccount) => void;
}) {
  const card = CARDS[kind];
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"upload" | "remove" | null>(null);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const send = async (method: "PUT" | "DELETE", file?: File) => {
    setNotice(null);
    setBusy(method === "PUT" ? "upload" : "remove");
    try {
      const res = await fetch(`/api/agency/branding/${kind}`, {
        method,
        ...(file ? { headers: { "Content-Type": file.type }, body: file } : {}),
      });
      if (!res.ok) {
        setNotice({ kind: "error", text: await errorFrom(res) });
        return;
      }
      const { account } = (await res.json()) as { account: BrandingAccount };
      onChange(account);
      setNotice({ kind: "success", text: method === "PUT" ? "Saved. Your new image is live." : "Image removed." });
    } catch {
      setNotice({ kind: "error", text: NETWORK_ERROR });
    } finally {
      setBusy(null);
    }
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setNotice({ kind: "error", text: "Upload a PNG, JPG or WebP image." });
      return;
    }
    if (file.size > MAX_BYTES) {
      setNotice({ kind: "error", text: "Images must be 2 MB or smaller." });
      return;
    }
    void send("PUT", file);
  };

  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <Panel title={card.title} description={card.description}>
      <div className="space-y-4">
        <NoticeBanner notice={notice} />
        <div className="flex flex-col gap-5 sm:flex-row">
          <div
            className="relative grid aspect-square w-full shrink-0 place-items-center overflow-hidden rounded-2xl ring-1 ring-ink/10 sm:w-40"
            style={checkerboard}
          >
            {url ? (
              <Image src={url} alt={card.title} fill sizes="160px" unoptimized className="object-contain p-3" />
            ) : (
              <card.icon className="size-10 text-ink/20" aria-hidden />
            )}
            {busy && (
              <span className="absolute inset-0 grid place-items-center bg-white/70">
                <LoaderCircle className="size-6 animate-spin text-ocean" aria-hidden />
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              disabled={busy !== null}
              className={`flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center text-sm transition disabled:opacity-60 ${
                dragging ? "border-ocean bg-mist" : "border-ink/15 hover:border-ocean/50 hover:bg-mist/50"
              }`}
            >
              <Upload className="size-5 text-ocean" aria-hidden />
              <span className="font-semibold text-ink">{url ? "Replace image" : "Upload image"}</span>
              <span className="text-xs text-ink/50">Drag and drop or click · PNG, JPG or WebP · max 2 MB</span>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-ink/45">{card.hint}</p>
              {url && (
                <button
                  type="button"
                  onClick={() => void send("DELETE")}
                  disabled={busy !== null}
                  className={`${buttonSecondary} px-4 py-2 text-rose-700 hover:border-rose-300`}
                >
                  <Trash2 className="size-4" aria-hidden /> Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function VoucherPreview({
  agency,
  logoUrl,
  cachetUrl,
  today,
}: {
  agency: { name: string; location: string; phone: string | null; email: string };
  logoUrl: string | null;
  cachetUrl: string | null;
  today: string;
}) {
  return (
    <Panel title="Voucher preview" description="How your logo and stamp appear on a booking voucher.">
      <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-inner">
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-mist text-lg font-semibold text-ocean">
              {logoUrl ? (
                <Image src={logoUrl} alt="" fill sizes="56px" unoptimized className="object-contain p-1.5" />
              ) : (
                agency.name.slice(0, 1).toUpperCase()
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold text-ink">{agency.name}</p>
              <p className="truncate text-xs text-ink/50">
                {agency.location}
                {agency.phone ? ` · ${agency.phone}` : ""}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right text-xs text-ink/50">
            <p className="font-semibold tracking-wide text-ink uppercase">Voucher</p>
            <p>BK-24081</p>
            <p>{formatDate(today)}</p>
          </div>
        </div>

        <dl className="grid gap-3 py-5 text-sm sm:grid-cols-2">
          {[
            ["Traveler", "Amine Belkacem"],
            ["Trip", "Santorini Sunset Escape"],
            ["Departure", formatDate("2026-10-18")],
            ["Travelers", "2 adults"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-ink/45">{label}</dt>
              <dd className="font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex items-end justify-between gap-4 border-t border-ink/10 pt-5">
          <div>
            <p className="text-xs text-ink/45">Total paid</p>
            <p className="text-xl font-bold text-ink">{formatDZD(578_000)}</p>
          </div>
          <div className="text-center">
            <div className="relative grid h-24 w-32 place-items-center">
              {cachetUrl ? (
                <Image
                  src={cachetUrl}
                  alt=""
                  fill
                  sizes="128px"
                  unoptimized
                  className="-rotate-6 object-contain opacity-90 mix-blend-multiply"
                />
              ) : (
                <span className="grid size-20 place-items-center rounded-full border-2 border-dashed border-ink/15 text-[10px] text-ink/35">
                  Your stamp
                </span>
              )}
            </div>
            <p className="mt-1 border-t border-ink/15 pt-1 text-[11px] text-ink/45">Stamp &amp; signature</p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink/45">Questions from travelers go to {agency.email}.</p>
    </Panel>
  );
}

export function BrandingSettings({
  agency,
  initialLogoUrl,
  initialCachetUrl,
  today,
}: {
  agency: { name: string; location: string; phone: string | null; email: string };
  initialLogoUrl: string | null;
  initialCachetUrl: string | null;
  today: string;
}) {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [cachetUrl, setCachetUrl] = useState(initialCachetUrl);

  const apply = (account: BrandingAccount) => {
    setLogoUrl(account.logoUrl);
    setCachetUrl(account.cachetUrl);
    router.refresh();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <div className="min-w-0 space-y-6 xl:col-span-3">
        <ImageUploadCard kind="logo" url={logoUrl} onChange={apply} />
        <ImageUploadCard kind="cachet" url={cachetUrl} onChange={apply} />
      </div>
      <div className="min-w-0 xl:col-span-2">
        <VoucherPreview agency={agency} logoUrl={logoUrl} cachetUrl={cachetUrl} today={today} />
      </div>
    </div>
  );
}
