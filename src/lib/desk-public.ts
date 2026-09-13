import { getDeskSettings, listHiddenPicks } from "@/lib/desk-api";
import { DEFAULT_DESK_SETTINGS, type DeskSettings } from "@/lib/desk-settings";

/** v7 public reads. Guests must never 401 off the desk. */
export async function readDeskSettings(): Promise<DeskSettings> {
  try {
    return await getDeskSettings();
  } catch {
    return DEFAULT_DESK_SETTINGS;
  }
}

export async function readHiddenPicks(): Promise<string[]> {
  try {
    return await listHiddenPicks();
  } catch {
    return [];
  }
}
