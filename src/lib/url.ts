// Ensures a URL has a protocol, so links resolve correctly whether the user
// typed "https://example.com" or just "example.com".
export function withProtocol(url: string): string {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}