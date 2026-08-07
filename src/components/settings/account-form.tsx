"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, updatePassword, updateProfile } from "@/lib/api";
import type { UserProfile } from "@/types";

function ChangePasswordSection({
  hasPasswordAuth: initialHasPasswordAuth,
}: {
  hasPasswordAuth: boolean;
}) {
  const [hasPasswordAuth, setHasPasswordAuth] = useState(initialHasPasswordAuth);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    if (saving) return;
    if (hasPasswordAuth && !currentPassword) {
      toast.error("Enter your current password");
      return;
    }
    if (password.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (hasPasswordAuth && password === currentPassword) {
      toast.error("New password must be different from the current one");
      return;
    }

    setSaving(true);
    try {
      await updatePassword(
        password,
        hasPasswordAuth ? { currentPassword } : undefined
      );
      setCurrentPassword("");
      setPassword("");
      setConfirm("");
      setHasPasswordAuth(true);
      toast.success(
        hasPasswordAuth
          ? "Password updated"
          : "Password added — you can sign in with email too"
      );
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Could not update password"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card/50 p-5 space-y-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight">
          {hasPasswordAuth ? "Change password" : "Add a password"}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {hasPasswordAuth
            ? "Confirm your current password, then choose a new one."
            : "You signed in with Google. Add a password if you also want to use email login."}
        </p>
      </div>
      {hasPasswordAuth && (
        <div className="space-y-2">
          <Label htmlFor="current-password">Current password</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            disabled={saving}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="new-password">
          {hasPasswordAuth ? "New password" : "Password"}
        </Label>
        <Input
          id="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          disabled={saving}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">
          {hasPasswordAuth ? "Confirm new password" : "Confirm password"}
        </Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          disabled={saving}
        />
      </div>
      <Button
        onClick={() => void onSubmit()}
        disabled={
          saving ||
          !password ||
          !confirm ||
          (hasPasswordAuth && !currentPassword)
        }
        variant="outline"
        className="gap-2"
      >
        {saving ? (
          <>
            <Spinner className="size-4" />
            Updating…
          </>
        ) : hasPasswordAuth ? (
          "Update password"
        ) : (
          "Add password"
        )}
      </Button>
    </div>
  );
}

type AccountFormProps = {
  user: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
};

function fieldsFromUser(user: UserProfile) {
  return {
    name: user.name,
    occupation: user.occupation,
    domain: user.domain ?? "",
    linkedin: user.linkedin ?? "",
    github: user.github ?? "",
    twitter: user.twitter ?? "",
    birthday: user.birthday ?? "",
    phone: user.phone ?? "",
    address: user.address ?? "",
  };
}

export function AccountForm({ user, onUserUpdated }: AccountFormProps) {
  const router = useRouter();
  const [fields, setFields] = useState(() => fieldsFromUser(user));
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);

  const setField = <K extends keyof typeof fields>(key: K, value: (typeof fields)[K]) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const applyProfileUpdated = (updated: UserProfile) => {
    setFields((prev) => ({
      ...prev,
      name: updated.name,
      occupation: updated.occupation,
      birthday: updated.birthday ?? "",
      phone: updated.phone ?? "",
      address: updated.address ?? "",
    }));
    onUserUpdated(updated);
    router.refresh();
  };

  const applySocialUpdated = (updated: UserProfile) => {
    setFields((prev) => ({
      ...prev,
      domain: updated.domain ?? "",
      linkedin: updated.linkedin ?? "",
      github: updated.github ?? "",
      twitter: updated.twitter ?? "",
    }));
    onUserUpdated(updated);
    router.refresh();
  };

  /** Profile section only — social values taken from last saved user. */
  const saveProfile = async () => {
    if (savingProfile || !fields.name.trim()) return;

    setSavingProfile(true);
    try {
      const updated = await updateProfile({
        name: fields.name,
        occupation: fields.occupation,
        birthday: fields.birthday.trim() || undefined,
        phone: fields.phone.trim() || undefined,
        address: fields.address.trim() || undefined,
        domain: user.domain,
        linkedin: user.linkedin,
        github: user.github,
        twitter: user.twitter,
      });
      applyProfileUpdated(updated);
      toast.success("Profile saved");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Could not save profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  /** Social section only — profile values taken from last saved user. */
  const saveSocial = async () => {
    if (savingSocial || !user.name.trim()) return;

    setSavingSocial(true);
    try {
      const updated = await updateProfile({
        name: user.name,
        occupation: user.occupation,
        birthday: user.birthday,
        phone: user.phone,
        address: user.address,
        domain: fields.domain.trim() || undefined,
        linkedin: fields.linkedin.trim() || undefined,
        github: fields.github.trim() || undefined,
        twitter: fields.twitter.trim() || undefined,
      });
      applySocialUpdated(updated);
      toast.success("Social links saved");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Could not save social links"
      );
    } finally {
      setSavingSocial(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/80 bg-card/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Profile</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            How you appear across Marshal.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Display name</Label>
          <Input
            id="name"
            value={fields.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            maxLength={80}
            disabled={savingProfile}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user.email}
            readOnly
            disabled
            autoComplete="email"
          />
          <p className="text-[11px] text-muted-foreground">
            Email comes from your sign-in and can&apos;t be changed here.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            value={fields.occupation}
            onChange={(e) => setField("occupation", e.target.value)}
            placeholder="e.g. Product designer"
            autoComplete="organization-title"
            maxLength={120}
            disabled={savingProfile}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="birthday">Birthday</Label>
            <Input
              id="birthday"
              type="date"
              value={fields.birthday}
              onChange={(e) => setField("birthday", e.target.value)}
              autoComplete="bday"
              disabled={savingProfile}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={fields.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="+1 555 000 0000"
              autoComplete="tel"
              maxLength={40}
              disabled={savingProfile}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={fields.address}
            onChange={(e) => setField("address", e.target.value)}
            placeholder="Street, city, country"
            autoComplete="street-address"
            rows={2}
            maxLength={300}
            disabled={savingProfile}
          />
        </div>
        <Button
          onClick={() => void saveProfile()}
          disabled={savingProfile || !fields.name.trim()}
          className="gap-2"
        >
          {savingProfile ? (
            <>
              <Spinner className="size-4" />
              Saving…
            </>
          ) : (
            "Save profile"
          )}
        </Button>
      </div>

      <div className="rounded-xl border border-border/80 bg-card/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Social links</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Optional links shown on your profile. Use a URL or username.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="domain">Website</Label>
          <Input
            id="domain"
            value={fields.domain}
            onChange={(e) => setField("domain", e.target.value)}
            placeholder="yoursite.com"
            autoComplete="url"
            maxLength={200}
            disabled={savingSocial}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={fields.linkedin}
              onChange={(e) => setField("linkedin", e.target.value)}
              placeholder="linkedin.com/in/you"
              maxLength={200}
              disabled={savingSocial}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={fields.github}
              onChange={(e) => setField("github", e.target.value)}
              placeholder="github.com/you"
              maxLength={200}
              disabled={savingSocial}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">X / Twitter</Label>
            <Input
              id="twitter"
              value={fields.twitter}
              onChange={(e) => setField("twitter", e.target.value)}
              placeholder="x.com/you"
              maxLength={200}
              disabled={savingSocial}
            />
          </div>
        </div>
        <Button
          onClick={() => void saveSocial()}
          disabled={savingSocial || !user.name.trim()}
          className="gap-2"
        >
          {savingSocial ? (
            <>
              <Spinner className="size-4" />
              Saving…
            </>
          ) : (
            "Save social links"
          )}
        </Button>
      </div>

      <ChangePasswordSection hasPasswordAuth={Boolean(user.hasPasswordAuth)} />
    </div>
  );
}
