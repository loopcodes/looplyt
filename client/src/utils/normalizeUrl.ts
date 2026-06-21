export function normalizeUrl(input: string) {
  const trimmed = input.trim().replace(/\s/g, "");

  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}