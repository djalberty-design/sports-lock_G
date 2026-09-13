//#region node_modules/.nitro/vite/services/ssr/assets/admin-845hXR6e.js
/** Super admin vs approved user vs pending visitor. */
var OWNER_ADMIN_EMAIL = "djalberty@gmail.com";
var ADMIN_EMAILS = [OWNER_ADMIN_EMAIL];
function normalizeEmail(email) {
	return (email ?? "").trim().toLowerCase();
}
function isAdminEmail(email) {
	const e = normalizeEmail(email);
	if (!e) return false;
	return ADMIN_EMAILS.includes(e);
}
function roleOf(email, listedRole) {
	if (isAdminEmail(email)) return "admin";
	return listedRole === "admin" ? "admin" : "user";
}
function looksLikeEmail(raw) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());
}
/** What admin can do that a regular user cannot. */
var ADMIN_POWERS = [
	{
		id: "allowlist",
		title: "Manage allowlist",
		line: "Add or revoke approved emails without redeploying. Super admin cannot be revoked."
	},
	{
		id: "tune",
		title: "Algorithm & thresholds",
		line: "Safest floor, Kelly multiplier, combo-leg cap, and which sports feed the board."
	},
	{
		id: "ledger",
		title: "Ledger management",
		line: "Edit, settle, void, or delete tickets in the master ledger. See aggregate Hit / Miss."
	},
	{
		id: "status",
		title: "System status",
		line: "Live health of ESPN, Kalshi, and Polymarket feeds."
	},
	{
		id: "pin",
		title: "Pin The Call",
		line: "Choose which single sits on the gold ribbon. Users still see it as research, not a guarantee."
	},
	{
		id: "hide",
		title: "Hide a ticket",
		line: "Take a ticket off AI Picks / Games / Combos for every approved user."
	}
];
//#endregion
export { normalizeEmail as a, looksLikeEmail as i, OWNER_ADMIN_EMAIL as n, roleOf as o, isAdminEmail as r, ADMIN_POWERS as t };
