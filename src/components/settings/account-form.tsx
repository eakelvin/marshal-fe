"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [pending, startTransition] = useTransition();

  const onSubmit = () => {
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

    startTransition(async () => {
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
          hasPasswordAuth ? "Password updated" : "Password added — you can sign in with email too"
        );
      } catch (err) {
        toast.error(
          err instanceof ApiError ? err.message : "Could not update password"
        );
      }
    });
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
        />
      </div>
      <Button
        onClick={onSubmit}
        disabled={
          pending ||
          !password ||
          !confirm ||
          (hasPasswordAuth && !currentPassword)
        }
        variant="outline"
      >
        {pending
          ? "Updating…"
          : hasPasswordAuth
            ? "Update password"
            : "Add password"}
      </Button>
    </div>
  );
}

export function AccountForm({ user }: { user: UserProfile }) {
  const [name, setName] = useState(user.name);
  const [occupation, setOccupation] = useState(user.occupation);
  const [domain, setDomain] = useState(user.domain ?? "");
  const [linkedin, setLinkedin] = useState(user.linkedin ?? "");
  const [github, setGithub] = useState(user.github ?? "");
  const [twitter, setTwitter] = useState(user.twitter ?? "");
  const [birthday, setBirthday] = useState(user.birthday ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [address, setAddress] = useState(user.address ?? "");
  const [pending, startTransition] = useTransition();

  const saveProfile = () => {
    startTransition(async () => {
      try {
        const updated = await updateProfile({
          name,
          occupation,
          domain: domain.trim() || undefined,
          linkedin: linkedin.trim() || undefined,
          github: github.trim() || undefined,
          twitter: twitter.trim() || undefined,
          birthday: birthday.trim() || undefined,
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
        });
        setName(updated.name);
        setOccupation(updated.occupation);
        setDomain(updated.domain ?? "");
        setLinkedin(updated.linkedin ?? "");
        setGithub(updated.github ?? "");
        setTwitter(updated.twitter ?? "");
        setBirthday(updated.birthday ?? "");
        setPhone(updated.phone ?? "");
        setAddress(updated.address ?? "");
        toast.success("Account updated");
      } catch (err) {
        toast.error(
          err instanceof ApiError ? err.message : "Could not update account"
        );
      }
    });
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            maxLength={80}
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
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="e.g. Product designer"
            autoComplete="organization-title"
            maxLength={120}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="birthday">Birthday</Label>
            <Input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              autoComplete="bday"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
              autoComplete="tel"
              maxLength={40}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street, city, country"
            autoComplete="street-address"
            rows={2}
            maxLength={300}
          />
        </div>
        <Button onClick={saveProfile} disabled={pending || !name.trim()}>
          {pending ? "Saving…" : "Save profile"}
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
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="yoursite.com"
            autoComplete="url"
            maxLength={200}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="linkedin.com/in/you"
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="github.com/you"
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">X / Twitter</Label>
            <Input
              id="twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="x.com/you"
              maxLength={200}
            />
          </div>
        </div>
        <Button onClick={saveProfile} disabled={pending || !name.trim()}>
          {pending ? "Saving…" : "Save social links"}
        </Button>
      </div>

      <ChangePasswordSection hasPasswordAuth={Boolean(user.hasPasswordAuth)} />
    </div>
  );
}
