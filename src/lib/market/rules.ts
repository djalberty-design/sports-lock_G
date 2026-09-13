/**
 * The rule list the desk actually runs.
 *
 * Same input → same ranking. No dice, no "vibe", no canned artifact.
 * Every ticket type walks this list. Every rule LOOKS UP live data every time.
 * Thin sample = light weight. Empty feed = "Looked" with Precision = 0 (no 50/50 drag), not a skip
 * and not an invented number.
 *
 * Bump DESK_VERSION when a ranking rule changes so two boards on the same
 * snapshot can never silently disagree.
 */

export const DESK_VERSION = "2026.09.12-master-v7";
