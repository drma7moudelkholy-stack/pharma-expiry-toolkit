# Pharma Expiry Toolkit | أداة صلاحية الأدوية

A small, dependency-free web tool for pharmaceutical professionals: calculate expiry
dates from manufacturing date and shelf life, and check whether an incoming lot has
enough remaining shelf life to be accepted at receipt (e.g. the common 75% rule).

أداة ويب بسيطة ومجانية لأخصائيي الأدوية: حساب تاريخ انتهاء الصلاحية من تاريخ الإنتاج
ومدة الصلاحية، وفحص التشغيلات الواردة للتأكد من أن النسبة المتبقية من الصلاحية كافية
للقبول عند الاستلام (مثل قاعدة ٧٥٪ المتعارف عليها).

## Features

- **Expiry calculator**: manufacturing date + shelf life in months → expiry date,
  using the pharma end-of-month convention (or exact-day arithmetic).
- **Lot receipt check**: remaining shelf-life percentage and days left at any check
  date, with an ACCEPT/REJECT verdict against a configurable minimum.
- **Bilingual**: English and Egyptian Arabic (RTL) with one click.
- **Private**: everything is calculated locally in the browser; nothing is uploaded.
- **Zero dependencies**: plain HTML/CSS/JS. Open `index.html` and it works.

## Usage

Open `index.html` in any browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Library

The date math lives in `expiry-core.js` and works in the browser and Node.js:

```js
const core = require("./expiry-core.js");

core.formatISO(core.addMonths("2026-01-15", 24));      // "2028-01-31"
core.evaluateLot("2026-01-01", "2028-01-01", "2026-06-01", 75);
// { remainingPercent: 78.1, daysRemaining: 578, expired: false, passes: true }
```

## Tests

```bash
node test.js
```

## Why

Built by a pharmaceutical product manager in Egypt who got tired of doing shelf-life
math in spreadsheets. Contributions welcome.

## License

MIT - see [LICENSE](LICENSE).
