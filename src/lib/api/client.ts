import { assertHttpConfig, env } from "@/lib/config/env";
import { ApiError } from "@/lib/api/errors";
import { getAccessToken } from "@/lib/api/session";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Skip Authorization header */
  auth?: boolean;
};

/**
 * Typed fetch against NEXT_PUBLIC_API_URL.
 * Both Supabase Functions and Node should expose the same /v1/* contract.
 */
export async function api<T>(
  path: string,
  { body, auth = true, headers, ...init }: RequestOptions = {}
): Promise<T> {
  assertHttpConfig();

  const url = `${env.apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const token = auth ? getAccessToken() : null;

  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : null) || res.statusText || "Request failed";
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
