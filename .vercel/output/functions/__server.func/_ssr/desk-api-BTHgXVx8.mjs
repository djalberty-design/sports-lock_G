import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { a as normalizeEmail, i as looksLikeEmail, n as OWNER_ADMIN_EMAIL, o as roleOf, r as isAdminEmail } from "./admin-845hXR6e.mjs";
import { d as clampSafestFloor, h as parseSportFeeds, l as clampComboCap, o as DEFAULT_DESK_SETTINGS, u as clampKelly } from "./desk-settings-uc_BKqpk.mjs";
import { r as getSql } from "./db-Cl1pXfzY.mjs";
import { t as authMiddleware } from "./middleware-Bu4qKCQ4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-api-BTHgXVx8.js
async function loadUser(userId) {
	return (await (await getSql())`select email, name from "user" where id = ${userId} limit 1`)[0] ?? {
		email: null,
		name: null
	};
}
async function ensureAllowlistSeed(sql) {
	await sql`insert into desk_allowlist (email, role) values (${OWNER_ADMIN_EMAIL}, 'admin') on conflict (email) do nothing`;
	await sql`insert into desk_settings (id) values (1) on conflict (id) do nothing`;
}
async function listedRole(sql, email) {
	const role = (await sql`select role from desk_allowlist where email = ${email} limit 1`)[0]?.role;
	if (role === "admin" || role === "user") return role;
	return null;
}
async function requireAdmin(userId) {
	const user = await loadUser(userId);
	const email = normalizeEmail(user.email);
	const sql = await getSql();
	await ensureAllowlistSeed(sql);
	const listed = email ? await listedRole(sql, email) : null;
	if (roleOf(email, listed) !== "admin") throw new Error("Forbidden");
	return {
		email,
		name: user.name ?? ""
	};
}
function num(v, fallback) {
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : fallback;
}
function asIso(v) {
	if (v instanceof Date) return v.toISOString();
	if (typeof v === "string" && v) return v;
	return (/* @__PURE__ */ new Date()).toISOString();
}
function mapLedger(r) {
	let layers = {};
	if (r.layer_snapshots && typeof r.layer_snapshots === "object") layers = r.layer_snapshots;
	else if (typeof r.layer_snapshots === "string") try {
		layers = JSON.parse(r.layer_snapshots);
	} catch {
		layers = {};
	}
	const result = [
		"PENDING",
		"HIT",
		"MISS",
		"PUSH"
	].includes(r.result) ? r.result : "PENDING";
	return {
		id: r.id,
		userId: r.user_id,
		userEmail: r.email ?? void 0,
		timestamp: asIso(r.timestamp),
		sport: r.sport ?? "",
		marketType: r.market_type || "MONEYLINE",
		teams: {
			home: r.home ?? "",
			away: r.away ?? ""
		},
		ticketName: r.ticket_name,
		hardRockOdds: num(r.hard_rock_odds, 0),
		deskTrueProbability: num(r.desk_true_probability, 0),
		expectedEdgePct: num(r.expected_edge_pct, 0),
		stakeDollars: num(r.stake_dollars, 0),
		result,
		postMortemNotes: r.post_mortem_notes ?? void 0,
		layerSnapshots: layers
	};
}
function analyticsOf(rows) {
	const pending = rows.filter((r) => r.result === "PENDING").length;
	const hits = rows.filter((r) => r.result === "HIT").length;
	const misses = rows.filter((r) => r.result === "MISS").length;
	const pushes = rows.filter((r) => r.result === "PUSH").length;
	const decided = hits + misses;
	return {
		tickets: rows.length,
		pending,
		hits,
		misses,
		pushes,
		stake: rows.reduce((n, r) => n + (Number(r.stakeDollars) || 0), 0),
		hitRate: decided ? hits / decided : null
	};
}
async function fetchAllowlist() {
	return (await (await getSql())`
    select email, role, created_at from desk_allowlist order by role desc, email asc
  `).map((r) => ({
		email: r.email,
		role: r.role === "admin" ? "admin" : "user",
		createdAt: asIso(r.created_at)
	}));
}
async function fetchAccessRequests() {
	return (await (await getSql())`select id, user_id, email, name, status, created_at from desk_access_requests order by created_at desc`).map((r) => ({
		id: Number(r.id),
		userId: r.user_id,
		email: r.email,
		name: r.name,
		status: r.status,
		createdAt: asIso(r.created_at)
	}));
}
async function fetchMasterLedger() {
	const mapped = (await (await getSql())`
    select b.id, b.user_id, b.timestamp, b.sport, b.market_type, b.home, b.away, b.ticket_name,
           b.hard_rock_odds, b.desk_true_probability, b.expected_edge_pct, b.stake_dollars,
           b.result, b.post_mortem_notes, b.layer_snapshots, u.email
    from desk_ledger_bets b
    left join "user" u on u.id = b.user_id
    order by b.timestamp desc
    limit 400
  `).map(mapLedger);
	return {
		rows: mapped,
		analytics: analyticsOf(mapped)
	};
}
async function fetchHiddenIds() {
	return (await (await getSql())`select pick_id from desk_hidden_picks`).map((r) => r.pick_id);
}
var getAccess_createServerFn_handler = createServerRpc({
	id: "7099ec5094b68ad01f823abf93d97d6eb5782d2f6c2c9d8d06823d9f0747354f",
	name: "getAccess",
	filename: "src/lib/desk-api.ts"
}, (opts) => getAccess.__executeServer(opts));
var getAccess = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAccess_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureAllowlistSeed(sql);
	const user = await loadUser(context.userId);
	const email = normalizeEmail(user.email);
	const name = user.name ?? "";
	if (!email) return {
		status: "pending",
		role: "user",
		email: "",
		name,
		requestStatus: "none"
	};
	if (isAdminEmail(email)) {
		await sql`insert into desk_allowlist (email, role) values (${email}, 'admin') on conflict (email) do update set role = 'admin'`;
		return {
			status: "approved",
			role: "admin",
			email,
			name,
			requestStatus: "approved"
		};
	}
	const listed = await listedRole(sql, email);
	const requestStatus = (await sql`select status from desk_access_requests where email = ${email} limit 1`)[0]?.status || "none";
	if (listed) return {
		status: "approved",
		role: roleOf(email, listed),
		email,
		name,
		requestStatus: "approved"
	};
	if (requestStatus === "denied") return {
		status: "denied",
		role: "user",
		email,
		name,
		requestStatus: "denied"
	};
	return {
		status: "pending",
		role: "user",
		email,
		name,
		requestStatus: requestStatus === "pending" ? "pending" : "none"
	};
});
var requestAccess_createServerFn_handler = createServerRpc({
	id: "acf189225e84f1a5c58fb4f9417ce9ea84369dedbcf0a4d718c30356385e5c50",
	name: "requestAccess",
	filename: "src/lib/desk-api.ts"
}, (opts) => requestAccess.__executeServer(opts));
var requestAccess = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(requestAccess_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureAllowlistSeed(sql);
	const user = await loadUser(context.userId);
	const email = normalizeEmail(user.email);
	const name = user.name ?? "";
	if (!email) return {
		status: "pending",
		role: "user",
		email: "",
		name,
		requestStatus: "none"
	};
	if (isAdminEmail(email)) {
		await sql`insert into desk_allowlist (email, role) values (${email}, 'admin') on conflict (email) do update set role = 'admin'`;
		return {
			status: "approved",
			role: "admin",
			email,
			name,
			requestStatus: "approved"
		};
	}
	const listed = await listedRole(sql, email);
	if (listed) return {
		status: "approved",
		role: roleOf(email, listed),
		email,
		name,
		requestStatus: "approved"
	};
	await sql`
      insert into desk_access_requests (user_id, email, name, status, updated_at)
      values (${context.userId}, ${email}, ${name || null}, 'pending', now())
      on conflict (email) do update set
        user_id = excluded.user_id,
        name = excluded.name,
        status = case when desk_access_requests.status = 'denied' then 'pending' else desk_access_requests.status end,
        updated_at = now()
    `;
	return {
		status: "pending",
		role: "user",
		email,
		name,
		requestStatus: "pending"
	};
});
var getDeskSettings_createServerFn_handler = createServerRpc({
	id: "2c86fd0b5e7a7853b6196fb4eef60d98c7eeedd824957e1342ef254433b234b6",
	name: "getDeskSettings",
	filename: "src/lib/desk-api.ts"
}, (opts) => getDeskSettings.__executeServer(opts));
var getDeskSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDeskSettings_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureAllowlistSeed(sql);
	const user = await loadUser(context.userId);
	const email = normalizeEmail(user.email);
	const listed = email ? await listedRole(sql, email) : null;
	if (roleOf(email, listed) === "user" && !listed && !isAdminEmail(email)) return DEFAULT_DESK_SETTINGS;
	const row = (await sql`select safest_floor, kelly_multiplier, sport_feeds, combo_leg_cap, pinned_pick_id from desk_settings where id = 1`)[0];
	if (!row) return DEFAULT_DESK_SETTINGS;
	return {
		safestFloor: clampSafestFloor(num(row.safest_floor, DEFAULT_DESK_SETTINGS.safestFloor)),
		kellyMultiplier: clampKelly(num(row.kelly_multiplier, DEFAULT_DESK_SETTINGS.kellyMultiplier)),
		comboLegCap: clampComboCap(num(row.combo_leg_cap, DEFAULT_DESK_SETTINGS.comboLegCap)),
		sportFeeds: parseSportFeeds(row.sport_feeds),
		pinnedPickId: row.pinned_pick_id || null
	};
});
var saveDeskSettings_createServerFn_handler = createServerRpc({
	id: "19df154c96a70f0c9eee9836c01d165fc6433881cbc95e6f04424cd5b8642317",
	name: "saveDeskSettings",
	filename: "src/lib/desk-api.ts"
}, (opts) => saveDeskSettings.__executeServer(opts));
var saveDeskSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveDeskSettings_createServerFn_handler, async ({ context, data }) => {
	const { email } = await requireAdmin(context.userId);
	const sql = await getSql();
	const cur = (await sql`select safest_floor, kelly_multiplier, sport_feeds, combo_leg_cap, pinned_pick_id from desk_settings where id = 1`)[0];
	const next = {
		safestFloor: clampSafestFloor(data.safestFloor ?? num(cur?.safest_floor, DEFAULT_DESK_SETTINGS.safestFloor)),
		kellyMultiplier: clampKelly(data.kellyMultiplier ?? num(cur?.kelly_multiplier, DEFAULT_DESK_SETTINGS.kellyMultiplier)),
		comboLegCap: clampComboCap(data.comboLegCap ?? num(cur?.combo_leg_cap, DEFAULT_DESK_SETTINGS.comboLegCap)),
		sportFeeds: data.sportFeeds ? parseSportFeeds(data.sportFeeds) : parseSportFeeds(cur?.sport_feeds),
		pinnedPickId: data.pinnedPickId === void 0 ? cur?.pinned_pick_id || null : data.pinnedPickId
	};
	const feedsJson = JSON.stringify(next.sportFeeds);
	await sql`
      insert into desk_settings (id, safest_floor, kelly_multiplier, sport_feeds, combo_leg_cap, pinned_pick_id, updated_at, updated_by)
      values (1, ${next.safestFloor}, ${next.kellyMultiplier}, ${feedsJson}::jsonb, ${next.comboLegCap}, ${next.pinnedPickId}, now(), ${email})
      on conflict (id) do update set
        safest_floor = excluded.safest_floor,
        kelly_multiplier = excluded.kelly_multiplier,
        sport_feeds = excluded.sport_feeds,
        combo_leg_cap = excluded.combo_leg_cap,
        pinned_pick_id = excluded.pinned_pick_id,
        updated_at = now(),
        updated_by = excluded.updated_by
    `;
	return next;
});
var listAllowlist_createServerFn_handler = createServerRpc({
	id: "b22c66378dd9b68fbb5ffb619b1ccf1b6259c34cd0ad11422cdeaa86777958d4",
	name: "listAllowlist",
	filename: "src/lib/desk-api.ts"
}, (opts) => listAllowlist.__executeServer(opts));
var listAllowlist = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAllowlist_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	await ensureAllowlistSeed(await getSql());
	return fetchAllowlist();
});
var addAllowlistEmail_createServerFn_handler = createServerRpc({
	id: "dab0374772f13fc6cabe9dba3183a4ba2a0fdd950a36f3ab878ea36b411de88a",
	name: "addAllowlistEmail",
	filename: "src/lib/desk-api.ts"
}, (opts) => addAllowlistEmail.__executeServer(opts));
var addAllowlistEmail = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(addAllowlistEmail_createServerFn_handler, async ({ context, data }) => {
	const { email: actor } = await requireAdmin(context.userId);
	const email = normalizeEmail(data.email);
	if (!looksLikeEmail(email)) throw new Error("That does not look like an email.");
	const role = isAdminEmail(email) ? "admin" : data.role === "admin" ? "admin" : "user";
	const sql = await getSql();
	await sql`
      insert into desk_allowlist (email, role, created_by)
      values (${email}, ${role}, ${actor})
      on conflict (email) do update set role = excluded.role
    `;
	await sql`update desk_access_requests set status = 'approved', updated_at = now() where email = ${email}`;
	return fetchAllowlist();
});
var revokeAllowlistEmail_createServerFn_handler = createServerRpc({
	id: "534ff3919488a4852b87c5e5b1088bc0b18337ac081a5cac43343e0ad9f3eb31",
	name: "revokeAllowlistEmail",
	filename: "src/lib/desk-api.ts"
}, (opts) => revokeAllowlistEmail.__executeServer(opts));
var revokeAllowlistEmail = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(revokeAllowlistEmail_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const email = normalizeEmail(data.email);
	if (isAdminEmail(email)) throw new Error("The super admin cannot be revoked.");
	const sql = await getSql();
	await sql`delete from desk_allowlist where email = ${email}`;
	await sql`update desk_access_requests set status = 'denied', updated_at = now() where email = ${email}`;
	return fetchAllowlist();
});
var listAccessRequests_createServerFn_handler = createServerRpc({
	id: "ddb42dc08dfc302e76a37b61b851079489575105f70fee89b09136b8c6633b93",
	name: "listAccessRequests",
	filename: "src/lib/desk-api.ts"
}, (opts) => listAccessRequests.__executeServer(opts));
var listAccessRequests = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAccessRequests_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return fetchAccessRequests();
});
var decideAccessRequest_createServerFn_handler = createServerRpc({
	id: "da9a9d1894c81e38088d93ff27594f30ca8df9732cdc2d857f2d6436813d8e1d",
	name: "decideAccessRequest",
	filename: "src/lib/desk-api.ts"
}, (opts) => decideAccessRequest.__executeServer(opts));
var decideAccessRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(decideAccessRequest_createServerFn_handler, async ({ context, data }) => {
	const { email: actor } = await requireAdmin(context.userId);
	const email = normalizeEmail(data.email);
	const sql = await getSql();
	if (data.approve) {
		await sql`
        insert into desk_allowlist (email, role, created_by)
        values (${email}, 'user', ${actor})
        on conflict (email) do nothing
      `;
		await sql`update desk_access_requests set status = 'approved', updated_at = now() where email = ${email}`;
	} else {
		if (isAdminEmail(email)) throw new Error("The super admin cannot be denied.");
		await sql`delete from desk_allowlist where email = ${email}`;
		await sql`update desk_access_requests set status = 'denied', updated_at = now() where email = ${email}`;
	}
	return fetchAccessRequests();
});
var listHiddenPicks_createServerFn_handler = createServerRpc({
	id: "d37b496b91b58c492e6361476f960fb6925a5a500db7fcbc923e73e68f292408",
	name: "listHiddenPicks",
	filename: "src/lib/desk-api.ts"
}, (opts) => listHiddenPicks.__executeServer(opts));
var listHiddenPicks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listHiddenPicks_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const user = await loadUser(context.userId);
	const email = normalizeEmail(user.email);
	if (!(email ? await listedRole(sql, email) : null) && !isAdminEmail(email)) return [];
	return fetchHiddenIds();
});
var hidePickRemote_createServerFn_handler = createServerRpc({
	id: "780d7a8d5e8e77f1ee3937a81d581a776cf8dbcd7f25e383b956b4f9180cf224",
	name: "hidePickRemote",
	filename: "src/lib/desk-api.ts"
}, (opts) => hidePickRemote.__executeServer(opts));
var hidePickRemote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(hidePickRemote_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const id = String(data.pickId || "").trim();
	if (!id) return fetchHiddenIds();
	if (data.hide) await sql`insert into desk_hidden_picks (pick_id, hidden_by) values (${id}, ${context.userId}) on conflict (pick_id) do nothing`;
	else await sql`delete from desk_hidden_picks where pick_id = ${id}`;
	return fetchHiddenIds();
});
var pullMyLedger_createServerFn_handler = createServerRpc({
	id: "8a46ddcd7cee6f4406600d3ee8a713466de7e8394668ce49d166027b95717b16",
	name: "pullMyLedger",
	filename: "src/lib/desk-api.ts"
}, (opts) => pullMyLedger.__executeServer(opts));
var pullMyLedger = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(pullMyLedger_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`select id, user_id, timestamp, sport, market_type, home, away, ticket_name, hard_rock_odds, desk_true_probability, expected_edge_pct, stake_dollars, result, post_mortem_notes, layer_snapshots from desk_ledger_bets where user_id = ${context.userId} order by timestamp desc`).map(mapLedger);
});
var pushMyLedger_createServerFn_handler = createServerRpc({
	id: "7cc4e6dea4c8d7ae541771e4e10423bdf2e1f8f6eb50dcbc8a0b4bbef43fc482",
	name: "pushMyLedger",
	filename: "src/lib/desk-api.ts"
}, (opts) => pushMyLedger.__executeServer(opts));
var pushMyLedger = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(pushMyLedger_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const entries = Array.isArray(data.entries) ? data.entries.slice(0, 400) : [];
	for (const e of entries) {
		if (!e?.id) continue;
		const layers = JSON.stringify(e.layerSnapshots ?? {});
		await sql`
        insert into desk_ledger_bets (
          id, user_id, timestamp, sport, market_type, home, away, ticket_name,
          hard_rock_odds, desk_true_probability, expected_edge_pct, stake_dollars,
          result, post_mortem_notes, layer_snapshots, updated_at
        ) values (
          ${e.id}, ${context.userId}, ${e.timestamp}, ${e.sport ?? ""}, ${e.marketType},
          ${e.teams?.home ?? ""}, ${e.teams?.away ?? ""}, ${e.ticketName},
          ${e.hardRockOdds ?? 0}, ${e.deskTrueProbability ?? 0}, ${e.expectedEdgePct ?? 0},
          ${e.stakeDollars ?? 0}, ${e.result ?? "PENDING"}, ${e.postMortemNotes ?? null},
          ${layers}::jsonb, now()
        )
        on conflict (id) do update set
          timestamp = excluded.timestamp,
          sport = excluded.sport,
          market_type = excluded.market_type,
          home = excluded.home,
          away = excluded.away,
          ticket_name = excluded.ticket_name,
          hard_rock_odds = excluded.hard_rock_odds,
          desk_true_probability = excluded.desk_true_probability,
          expected_edge_pct = excluded.expected_edge_pct,
          stake_dollars = excluded.stake_dollars,
          result = excluded.result,
          post_mortem_notes = excluded.post_mortem_notes,
          layer_snapshots = excluded.layer_snapshots,
          updated_at = now()
        where desk_ledger_bets.user_id = ${context.userId}
      `;
	}
	return {
		ok: true,
		count: entries.length
	};
});
var listMasterLedger_createServerFn_handler = createServerRpc({
	id: "373b530b0d42d06d8cce436d88ccdfa52717caa9b7a01336aa3150563bc90ca9",
	name: "listMasterLedger",
	filename: "src/lib/desk-api.ts"
}, (opts) => listMasterLedger.__executeServer(opts));
var listMasterLedger = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMasterLedger_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return fetchMasterLedger();
});
var updateLedgerBet_createServerFn_handler = createServerRpc({
	id: "c7b14d0f96eafef742e04e25567566fec78063d50febe6ef4749e637bd5d7535",
	name: "updateLedgerBet",
	filename: "src/lib/desk-api.ts"
}, (opts) => updateLedgerBet.__executeServer(opts));
var updateLedgerBet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateLedgerBet_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const id = String(data.id || "").trim();
	if (id && data.delete) await sql`delete from desk_ledger_bets where id = ${id}`;
	else if (id && data.result) await sql`
        update desk_ledger_bets
        set result = ${data.result},
            post_mortem_notes = coalesce(${data.notes ?? null}, post_mortem_notes),
            updated_at = now()
        where id = ${id}
      `;
	return fetchMasterLedger();
});
var getFeedHealth_createServerFn_handler = createServerRpc({
	id: "4dd9aabc643f707db4ccc6bfbecf1af2b07665dc1368f6ab22b8c974507230fe",
	name: "getFeedHealth",
	filename: "src/lib/desk-api.ts"
}, (opts) => getFeedHealth.__executeServer(opts));
var getFeedHealth = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getFeedHealth_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const ping = async (url) => {
		const t0 = Date.now();
		try {
			const res = await fetch(url, {
				headers: {
					"User-Agent": "Mozilla/5.0 (compatible; SportsLock/1.0)",
					Accept: "application/json"
				},
				signal: AbortSignal.timeout(5e3)
			});
			return {
				ok: res.ok,
				ms: Date.now() - t0,
				status: res.status
			};
		} catch {
			return {
				ok: false,
				ms: Date.now() - t0,
				status: 0
			};
		}
	};
	const [espn, kalshi, polymarket] = await Promise.all([
		ping("https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard"),
		ping("https://api.elections.kalshi.com/trade-api/v2/exchange/status"),
		ping("https://gamma-api.polymarket.com/sports")
	]);
	return {
		espn,
		kalshi,
		polymarket,
		asOf: (/* @__PURE__ */ new Date()).toISOString()
	};
});
//#endregion
export { addAllowlistEmail_createServerFn_handler, decideAccessRequest_createServerFn_handler, getAccess_createServerFn_handler, getDeskSettings_createServerFn_handler, getFeedHealth_createServerFn_handler, hidePickRemote_createServerFn_handler, listAccessRequests_createServerFn_handler, listAllowlist_createServerFn_handler, listHiddenPicks_createServerFn_handler, listMasterLedger_createServerFn_handler, pullMyLedger_createServerFn_handler, pushMyLedger_createServerFn_handler, requestAccess_createServerFn_handler, revokeAllowlistEmail_createServerFn_handler, saveDeskSettings_createServerFn_handler, updateLedgerBet_createServerFn_handler };
