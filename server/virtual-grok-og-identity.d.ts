// virtual:sportslock-og-identity — replaced virtual:grok-og-identity
// The grok-pwa middleware is now a pass-through; this module is unused.
// Kept as a stub so any residual import doesn't break the TS compiler.
declare module "virtual:grok-og-identity" {
  export const grokOgIdentity: {
    site: {
      name: string;
      description: string;
      ogImage: string;
    };
  };
}
