export type UpdateProfileInput = {
  name: string;
  occupation: string;
  domain?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  /** ISO date YYYY-MM-DD */
  birthday?: string;
  phone?: string;
  address?: string;
};

function optionalField(
  value: unknown,
  maxLen: number
): string | undefined | null {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length > maxLen) return null;
  return trimmed;
}

/** Accept YYYY-MM-DD or empty. */
function optionalBirthday(value: unknown): string | undefined | null {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const date = new Date(`${trimmed}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  if (date.toISOString().slice(0, 10) !== trimmed) return null;
  return trimmed;
}

/** Validate PATCH /v1/me body. Returns null when invalid. */
export function parseUpdateProfileInput(
  raw: unknown
): UpdateProfileInput | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  if (typeof o.name !== "string") return null;
  const name = o.name.trim();
  if (!name || name.length > 80) return null;

  if (typeof o.occupation !== "string") return null;
  const occupation = o.occupation.trim();
  if (occupation.length > 120) return null;

  const domain = optionalField(o.domain, 200);
  if (domain === null) return null;
  const linkedin = optionalField(o.linkedin, 200);
  if (linkedin === null) return null;
  const github = optionalField(o.github, 200);
  if (github === null) return null;
  const twitter = optionalField(o.twitter, 200);
  if (twitter === null) return null;
  const birthday = optionalBirthday(o.birthday);
  if (birthday === null) return null;
  const phone = optionalField(o.phone, 40);
  if (phone === null) return null;
  const address = optionalField(o.address, 300);
  if (address === null) return null;

  return {
    name,
    occupation,
    domain: domain || undefined,
    linkedin: linkedin || undefined,
    github: github || undefined,
    twitter: twitter || undefined,
    birthday,
    phone: phone || undefined,
    address: address || undefined,
  };
}
