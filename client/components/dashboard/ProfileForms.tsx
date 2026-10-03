"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";

import {
  ChangePasswordPanel,
  EmailPasswordConfirm,
  errorFrom,
  NETWORK_ERROR,
  NoticeBanner,
  SubmitButton,
  type Notice,
} from "./account-forms";
import { Field } from "./Modal";
import { inputClass, Panel } from "./ui";

export function ProfileForms({ name, email }: { name: string; email: string }) {
  const router = useRouter();

  const [fullName, setFullName] = useState(name);
  const [emailInput, setEmailInput] = useState(email);
  const [savedEmail, setSavedEmail] = useState(email);
  const [emailPassword, setEmailPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileNotice, setProfileNotice] = useState<Notice>(null);

  const emailChanged = emailInput.trim().toLowerCase() !== savedEmail.toLowerCase();

  const saveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileNotice(null);
    setSavingProfile(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email: emailInput,
          ...(emailChanged ? { current_password: emailPassword } : {}),
        }),
      });
      if (!res.ok) {
        setProfileNotice({ kind: "error", text: await errorFrom(res) });
        return;
      }
      const { user } = (await res.json()) as { user: { name: string; email: string } };
      setFullName(user.name);
      setEmailInput(user.email);
      setSavedEmail(user.email);
      setEmailPassword("");
      setProfileNotice({ kind: "success", text: "Your profile has been updated." });
      router.refresh();
    } catch {
      setProfileNotice({ kind: "error", text: NETWORK_ERROR });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="space-y-6">
      <Panel title="Personal information" description="Your name and the email you sign in with.">
        <form onSubmit={saveProfile} className="space-y-4">
          <NoticeBanner notice={profileNotice} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input
                name="full_name"
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Email">
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          {emailChanged && <EmailPasswordConfirm value={emailPassword} onChange={setEmailPassword} />}
          <div className="flex justify-end">
            <SubmitButton busy={savingProfile} icon={<Save className="size-4" aria-hidden />}>
              {savingProfile ? "Saving…" : "Save changes"}
            </SubmitButton>
          </div>
        </form>
      </Panel>

      <ChangePasswordPanel endpoint="/api/admin/profile/password" />
    </div>
  );
}
