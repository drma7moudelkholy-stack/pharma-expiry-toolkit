/*
 * Pharma Expiry Toolkit - core date math.
 * Pure functions, no dependencies. Used by the web app (index.html)
 * and by the test suite (test.js).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ExpiryCore = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var MS_PER_DAY = 24 * 60 * 60 * 1000;

  function toDate(value) {
    if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    var d = new Date(value + "T00:00:00");
    if (isNaN(d.getTime())) throw new Error("Invalid date: " + value);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function formatISO(d) {
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  /**
   * Add whole months to a date, the way pharma shelf life is counted:
   * a product manufactured any time in a month with an N-month shelf life
   * expires at the end of the month N months later.
   * Pass endOfMonth=false for exact day arithmetic instead.
   */
  function addMonths(date, months, endOfMonth) {
    if (endOfMonth === undefined) endOfMonth = true;
    if (!Number.isInteger(months) || months <= 0) throw new Error("months must be a positive integer");
    var d = toDate(date);
    if (endOfMonth) {
      return new Date(d.getFullYear(), d.getMonth() + months + 1, 0);
    }
    var result = new Date(d.getFullYear(), d.getMonth() + months, d.getDate());
    if (result.getDate() !== d.getDate()) result.setDate(0); // clamp Jan 31 + 1 month to last day of Feb
    return result;
  }

  function daysBetween(from, to) {
    return Math.round((toDate(to) - toDate(from)) / MS_PER_DAY);
  }

  /**
   * Remaining shelf life as a percentage of total shelf life,
   * measured at checkDate. 100 = just manufactured, 0 = expired.
   */
  function remainingPercent(mfgDate, expiryDate, checkDate) {
    var total = daysBetween(mfgDate, expiryDate);
    if (total <= 0) throw new Error("expiry must be after manufacturing date");
    var remaining = daysBetween(checkDate, expiryDate);
    return (remaining / total) * 100;
  }

  /**
   * Evaluate a lot at a receipt/check date against a minimum acceptable
   * remaining shelf-life percentage (e.g. the common 75% receipt rule).
   */
  function evaluateLot(mfgDate, expiryDate, checkDate, minPercent) {
    var pct = remainingPercent(mfgDate, expiryDate, checkDate);
    var expired = daysBetween(checkDate, expiryDate) <= 0;
    return {
      remainingPercent: Math.round(pct * 10) / 10,
      daysRemaining: daysBetween(checkDate, expiryDate),
      expired: expired,
      passes: !expired && pct >= minPercent
    };
  }

  return {
    toDate: toDate,
    formatISO: formatISO,
    addMonths: addMonths,
    daysBetween: daysBetween,
    remainingPercent: remainingPercent,
    evaluateLot: evaluateLot
  };
});
