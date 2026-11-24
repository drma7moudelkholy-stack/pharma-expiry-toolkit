/* Node test suite for expiry-core.js. Run: node test.js */
"use strict";

const assert = require("assert");
const core = require("./expiry-core.js");

// addMonths: pharma end-of-month convention
assert.strictEqual(
  core.formatISO(core.addMonths("2026-01-15", 24, true)),
  "2028-01-31",
  "Jan 2026 + 24 months expires end of Jan 2028"
);
assert.strictEqual(
  core.formatISO(core.addMonths("2026-02-03", 1, true)),
  "2026-03-31",
  "Feb + 1 month expires end of March"
);

// addMonths: exact-day convention, including month-end clamping
assert.strictEqual(
  core.formatISO(core.addMonths("2026-01-15", 12, false)),
  "2027-01-15"
);
assert.strictEqual(
  core.formatISO(core.addMonths("2026-01-31", 1, false)),
  "2026-02-28",
  "Jan 31 + 1 month clamps to last day of Feb"
);

// daysBetween
assert.strictEqual(core.daysBetween("2026-01-01", "2026-01-31"), 30);

// remainingPercent: midpoint of shelf life is 50%
const pct = core.remainingPercent("2026-01-01", "2027-01-01", "2026-07-02");
assert.ok(Math.abs(pct - 50) < 0.5, "midpoint should be about 50%, got " + pct);

// evaluateLot: fresh lot passes a 75% receipt rule, old lot fails
const fresh = core.evaluateLot("2026-01-01", "2028-01-01", "2026-02-01", 75);
assert.strictEqual(fresh.passes, true);
assert.strictEqual(fresh.expired, false);

const old = core.evaluateLot("2024-01-01", "2026-01-01", "2025-10-01", 75);
assert.strictEqual(old.passes, false, "lot with ~25% remaining must fail a 75% rule");
assert.ok(old.remainingPercent < 75);

const expired = core.evaluateLot("2024-01-01", "2025-01-01", "2025-06-01", 0);
assert.strictEqual(expired.expired, true);
assert.strictEqual(expired.passes, false);

// invalid input
assert.throws(() => core.addMonths("2026-01-01", 0));
assert.throws(() => core.remainingPercent("2026-06-01", "2026-01-01", "2026-03-01"));

console.log("All tests passed.");
