import assert from "node:assert/strict";
import { test } from "node:test";
import { detectSport, parseSlipText } from "./slip-ocr.ts";

test("reads an NFL moneyline from messy OCR", () => {
  const r = parseSlipText("Hard Rock Bet Florida\nNFL\nChiefs vs Ravens\nKansas City to win  -115");
  assert.equal(r.fields.length, 1);
  assert.equal(r.fields[0].sport, "NFL");
  assert.equal(r.fields[0].marketType, "ml");
  assert.equal(r.fields[0].price, -115);
  assert.match(r.fields[0].selection.toLowerCase(), /chiefs|kansas/);
});

test("reads a player prop without a paid key", () => {
  const r = parseSlipText("Patrick Mahomes over 249.5 passing yards  -110  Chiefs at Ravens");
  assert.equal(r.fields[0].marketType, "prop");
  assert.equal(r.fields[0].side, "over");
  assert.equal(r.fields[0].point, 249.5);
  assert.match(r.fields[0].player ?? "", /Mahomes/);
});

test("reads a game total", () => {
  const r = parseSlipText("MLB Phillies vs Braves  Over 8.5  -105");
  assert.equal(r.fields[0].sport, "MLB");
  assert.equal(r.fields[0].marketType, "total");
  assert.equal(r.fields[0].side, "over");
  assert.equal(r.fields[0].point, 8.5);
});

test("detectSport uses stat words when the league label is missing", () => {
  assert.equal(detectSport("bottom 7th strikeout"), "MLB");
  assert.equal(detectSport("NCAAF Saturday"), "NCAAF");
});
