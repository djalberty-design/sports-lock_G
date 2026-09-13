import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as BRAND } from "./research-9TMeO2J4.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { t as GROK_PROVIDERS } from "./server-BYBKqy1e.mjs";
import { _t as useCurrentUserState, vt as Button } from "./router-nrR04juv.mjs";
import { t as Input } from "./input-BAVbE0tC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DvJzPmRY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("in");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-48 animate-pulse rounded-md bg-wash" })
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onEmail(e) {
		e.preventDefault();
		setError("");
		setBusy(true);
		try {
			if (mode === "up") {
				const { error: err } = await authClient.signUp.email({
					email: email.trim(),
					password,
					name: email.trim().split("@")[0] || "Sports Lock"
				});
				if (err) throw new Error(err.message ?? "Could not create the account.");
			} else {
				const { error: err } = await authClient.signIn.email({
					email: email.trim(),
					password
				});
				if (err) throw new Error(err.message ?? "Could not sign in.");
			}
			window.location.href = "/";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign-in failed.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gold",
					children: BRAND.kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-4xl text-ink",
					children: "Sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-ink/80",
					children: "Sports Lock is a private desk. Sign in with Google, X, or email. Access still needs an admin approval unless you are the owner. This site never places a bet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "paper-card mt-6 space-y-3 p-5",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => signIn(p.providerId, { callbackURL: "/" }),
						className: "flex min-h-11 w-full items-center justify-center rounded-md bg-gold px-4 text-sm font-medium text-navy-deep hover:opacity-90",
						children: ["Continue with ", p.label]
					}, p.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "paper-card mt-4 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "stamp text-gold",
							children: mode === "in" ? "Email & password" : "New account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-4 space-y-3",
							onSubmit: onEmail,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs uppercase tracking-[0.14em] text-muted",
									children: ["Your email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "email",
										autoComplete: "email",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										className: "mt-1 normal-case tracking-normal",
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs uppercase tracking-[0.14em] text-muted",
									children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "password",
										autoComplete: mode === "in" ? "current-password" : "new-password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										className: "mt-1 normal-case tracking-normal",
										minLength: 8,
										required: true
									})]
								}),
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-down",
									children: error
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "w-full",
									disabled: busy || false,
									children: busy ? "Working…" : mode === "in" ? "Sign in with email" : "Create account"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-3 text-sm text-gold underline-offset-4 hover:underline",
							onClick: () => setMode(mode === "in" ? "up" : "in"),
							children: mode === "in" ? "Need an account? Create one" : "Already have an account? Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-xs text-muted",
					children: [
						"21+ for Hard Rock Bet. 18+ for classic daily fantasy. Call ",
						BRAND.helpline,
						" if play is no longer fun."
					]
				})
			]
		})
	});
}
//#endregion
export { Login as component };
