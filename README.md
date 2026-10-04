# axe, step by step / paso a paso

A one-page guide to axe accessibility testing in English and Spanish. It explains axe-core, axe DevTools, cypress-axe, how to interpret findings, testing interactive states, and the manual review that automation cannot replace.

The site is a static Vite + React + TypeScript page. It does not load axe-core or Cypress at runtime, run scans, set cookies, or collect analytics. Code samples are text only. The language detector uses a saved selection first and the browser language second.

The repository began as a Material UI tooltip and Cypress demo. The guide keeps that scenario as an example of why scans must run after an interactive state opens. The old Cypress spec pointed at a deployed site and was removed during the conversion.

## Commands

- `npm run dev` — local server at http://localhost:45127.
- `npm run build` — validate translations, typecheck, and build into `build/`.
- `npm run preview` — serve the build at http://localhost:45128.
- `npm test` — basic language detection and persistence tests.
- `npm run i18n:check` — compare locale keys, order, duplicates, and article section IDs.

## Editing

- `src/content/en.tsx` and `src/content/es.tsx` contain the full articles. Keep section IDs and order aligned.
- `src/i18n/en.json` and `src/i18n/es.json` contain interface strings.
- `src/snippets.ts` contains the bilingual code samples shown on the page.
- `check-i18n-order.ts` is adapted from Travel Connect Portal. Run it after changing either language.
- `src/index.css` defines the layout and responsive light/dark themes.

Product details and sample commands were checked against the official [axe-core](https://github.com/dequelabs/axe-core), [cypress-axe](https://github.com/component-driven/cypress-axe), and [W3C evaluation guidance](https://www.w3.org/WAI/test-evaluate/tools/selecting/). Recheck their current documentation when updating the article.
