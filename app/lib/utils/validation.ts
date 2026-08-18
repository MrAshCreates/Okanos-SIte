const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DANGEROUS_JSON_KEYS = new Set(["__proto__", "prototype", "constructor"]);

export function sanitizeText(value: string, maxLength = 120): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, maxLength);
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase().slice(0, 254);
}

export function isValidEmail(value: string): boolean {
  const email = normalizeEmail(value);
  return email.length >= 3 && email.length <= 254 && EMAIL_PATTERN.test(email);
}

export function parseNonNegativeNumber(value: string | number | undefined): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value ?? "");
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

export function parseOptionalNonNegativeNumber(value: string | number | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return parsed;
}

export function parseLast4(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "").slice(-4);
  return digits.length === 4 ? digits : undefined;
}

export function clampRatio(value: number, fallback = 0.25): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(1, Math.max(0, value));
}

export function reviveJson(key: string, value: unknown): unknown {
  if (DANGEROUS_JSON_KEYS.has(key)) {
    return undefined;
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const objectKey of Object.keys(value as object)) {
      if (DANGEROUS_JSON_KEYS.has(objectKey)) {
        delete (value as Record<string, unknown>)[objectKey];
      }
    }
  }

  return value;
}
