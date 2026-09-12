import { ScreenshotIngest } from "./screenshot-ingest";

export function PhotoWagerCta({ what }: { what: string }) {
  return (
    <details className="mt-4 rounded-md bg-wash px-4 py-3">
      <summary className="cursor-pointer text-sm font-medium text-ink">
        Don’t see your {what}? Photograph the Hard Rock screen.
      </summary>
      <p className="mt-2 text-xs text-muted">
        Photograph the Hard Rock Bet Florida screen. We read the live price. Then you confirm it on Log.
      </p>
      <div className="mt-3">
        <ScreenshotIngest embedded heading="Upload the Hard Rock Bet Florida slip you’re looking at" />
      </div>
    </details>
  );
}
