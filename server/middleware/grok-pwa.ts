/**
 * Deployed-app (Nitro) middleware — previously injected Grok platform chrome.
 * Now a transparent pass-through; all PWA head tags are in __root.tsx directly.
 */
export default async function pwaMiddleware(
  _event: unknown,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  return next();
}
