import assert from "node:assert/strict";
import { test } from "node:test";
import { isAdminEmail, roleOf, OWNER_ADMIN_EMAIL } from "./admin.ts";

test("owner email is admin", () => {
  assert.equal(isAdminEmail(OWNER_ADMIN_EMAIL), true);
  assert.equal(isAdminEmail("  DJAlberty@gmail.com  "), true);
  assert.equal(roleOf(OWNER_ADMIN_EMAIL), "admin");
});

test("everyone else is a user", () => {
  assert.equal(isAdminEmail("friend@example.com"), false);
  assert.equal(isAdminEmail(""), false);
  assert.equal(isAdminEmail(null), false);
  assert.equal(roleOf("friend@example.com"), "user");
});
