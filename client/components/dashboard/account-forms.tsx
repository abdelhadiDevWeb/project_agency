"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Check, CircleAlert, CircleCheck, Eye, EyeOff, KeyRound, LoaderCircle } from "lucide-react";

import { Field } from "./Modal";
import { buttonPrimary, inputClass, Panel } from "./ui";

export type Notice = { kind: "success" | "error"; text: string } | null;

export const NETWORK_ERROR = "We can't reach the server right now. Please try again shortly.";

const PASSWORD_RULES = [
  { label: "8 characters or more", test: (v: string) => v.length >= 8 && v.length <= 128 },
  { label: "A lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "An uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "A number", test: (v: string) => /\d/.test(v) },
  { label: "A symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export async function errorFrom(res: Response): Promise<string> {
  if (res.status === 429) return "Too many attempts. Please wait a minute and try again.";
  if (res.status === 401) return "Your session has expired. Please sign in again.";
  if (res.status >= 500) return NETWORK_ERROR;
  try {
    const data = (await res.json()) as { message?: string; details?: string[] };
    const detail = data.details?.[0];
    if (detail) return detail.startsWith('"') ? "Please check your details and try again." : detail;
    return data.message ?? "Something went wrong. Please try again.";
  } catch {
    return "Something went wrong. Please try again.";
  }
}

export function NoticeBanner({ notice }: { notice: Notice }) {
  if (!notice) return null;
  const success = notice.kind === "success";
  return (
    <div
      role={success ? "status" : "alert"}
      className={`animate-fade-in flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ring-1 ${
        success ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15" : "bg-rose-50 text-rose-700 ring-rose-600/15"
      }`}
    >
      {success ? <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden /> : <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />}
      {notice.text}
    </div>
  );
}

export function PasswordInput({
  name,
  autoComplete,
  value,
  onChange,
}: {
  name: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative block">
      <input
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        required
        maxLength={128}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} pr-12`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink/45 transition hover:bg-ink/5 hover:text-ink"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </span>
  );
}

export function SubmitButton({ busy, icon, children }: { busy: boolean; icon: ReactNode; children: ReactNode }) {
  return (
    <button type="submit" disabled={busy} className={buttonPrimary}>
      {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}

/** Shown under an email field when it differs from the saved one; the API requires the password for that change. */
export function EmailPasswordConfirm({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="animate-fade-in rounded-2xl bg-sand p-4">
      <Field label="Current password">
        <PasswordInput name="current_password" autoComplete="current-password" value={value} onChange={onChange} />
      </Field>
      <p className="mt-2 text-xs text-ink/50">
        Confirm it&apos;s you before changing your sign-in email. You&apos;ll use the new email next time you sign in.
      </p>
    </div>
  );
}

export function ChangePasswordPanel({ endpoint }: { endpoint: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const rulesPassed = PASSWORD_RULES.every((rule) => rule.test(newPassword));
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const checklist = [
    ...PASSWORD_RULES.map((rule) => ({ label: rule.label, ok: rule.test(newPassword) })),
    { label: "Both passwords match", ok: passwordsMatch },
  ];

  const savePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotice(null);
    if (!rulesPassed || !passwordsMatch) {
      setNotice({ kind: "error", text: "Your new password doesn't meet every requirement yet." });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      if (!res.ok) {
        setNotice({ kind: "error", text: await errorFrom(res) });
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNotice({ kind: "success", text: "Your password has been changed." });
    } catch {
      setNotice({ kind: "error", text: NETWORK_ERROR });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel title="Change password" description="Use a strong password you don't use anywhere else.">
      <form onSubmit={savePassword} className="space-y-4">
        <NoticeBanner notice={notice} />
        <Field label="Current password">
          <PasswordInput
            name="current_password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="New password">
            <PasswordInput name="new_password" autoComplete="new-password" value={newPassword} onChange={setNewPassword} />
          </Field>
          <Field label="Confirm new password">
            <PasswordInput
              name="confirm_password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </Field>
        </div>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {checklist.map((rule) => (
            <li key={rule.label} className={`flex items-center gap-2 transition ${rule.ok ? "text-emerald-700" : "text-ink/45"}`}>
              <span
                className={`grid size-4 place-items-center rounded-full ${rule.ok ? "bg-emerald-100" : "bg-ink/5"}`}
                aria-hidden
              >
                {rule.ok && <Check className="size-3" />}
              </span>
              {rule.label}
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <SubmitButton busy={saving} icon={<KeyRound className="size-4" aria-hidden />}>
            {saving ? "Updating…" : "Update password"}
          </SubmitButton>
        </div>
      </form>
    </Panel>
  );
}
