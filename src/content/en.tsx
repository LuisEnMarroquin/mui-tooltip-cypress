import Callout from '../components/Callout'
import CodeBlock from '../components/CodeBlock'
import { SNIPPETS } from '../snippets'
import type { Section } from './types'

const code = SNIPPETS.en

export const EN_SECTIONS: Section[] = [
  {
    id: 'overview', title: 'What is axe?',
    lead: 'An accessibility testing engine and a family of tools built around it.',
    body: <>
      <p><strong>axe-core</strong> runs automated rules against rendered HTML. It helps find problems such as missing accessible names, missing image alternatives, and insufficient color contrast. It is an engine you can call from your tests; it is not a certificate that a page is accessible.</p>
      <div className="cards">{[
        ['axe-core', 'The open-source JavaScript engine that evaluates rules and returns structured results.'],
        ['axe DevTools', 'The browser extension that gives people a visual way to scan, inspect, and fix issues.'],
        ['cypress-axe', 'The integration that injects axe-core into a Cypress page and adds accessibility checks to tests.'],
      ].map(([title, text]) => <div className="card" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>
      <Callout tone="tip">Start with the browser extension to explore an issue; put repeatable checks in automated tests once you understand the page and its states.</Callout>
    </>,
  },
  {
    id: 'rules', title: 'What it checks',
    lead: 'Rules inspect testable properties of the current rendered interface.',
    body: <>
      <p>axe-core includes rules tagged to WCAG 2.0, 2.1, and 2.2 success criteria, plus best-practice rules. A rule finds relevant elements and runs checks on them. Its result depends on what is actually present and visible at scan time.</p>
      <div className="table-wrap"><table><thead><tr><th>Example rule</th><th>Question it helps answer</th></tr></thead><tbody>{[
        ['button-name', 'Does a button have a name that assistive technology can use?'],
        ['image-alt', 'Does a meaningful image have an appropriate text alternative?'],
        ['color-contrast', 'Is text contrast sufficient against its background?'],
      ].map(([rule, description]) => <tr key={rule}><td><code>{rule}</code></td><td>{description}</td></tr>)}</tbody></table></div>
      <Callout>WCAG tags describe the criteria a rule relates to. Passing axe checks alone does not establish WCAG conformance.</Callout>
    </>,
  },
  {
    id: 'workflow', title: 'A useful workflow',
    lead: 'Scan a real state, inspect each finding, fix the cause, and scan again.',
    body: <ol className="steps">{[
      ['Render the page', 'Wait for the interface and its data to reach the state you want to test.'],
      ['Run axe', 'Scan the whole page first, or a component while you are developing it.'],
      ['Read the finding', 'Use the rule ID, affected element, explanation, and help link to identify the cause.'],
      ['Fix the UI', 'Prefer semantic HTML, clear labels, and correct interaction behavior over suppressing a rule.'],
      ['Repeat in other states', 'Open dialogs and menus, trigger errors, use keyboard focus, and rerun the check.'],
    ].map(([title, text]) => <li key={title}><strong>{title}</strong><span>{text}</span></li>)}</ol>,
  },
  {
    id: 'browser', title: 'Scan in the browser',
    lead: 'The axe DevTools extension gives you a fast first look at a rendered page.',
    body: <>
      <ol>
        <li>Open the page you want to inspect and launch the axe DevTools panel from browser developer tools.</li>
        <li>Run a full-page scan. If you are working on one component, a partial-page scan can narrow the results.</li>
        <li>Inspect the affected element and guidance for each issue, then fix the page and scan again.</li>
      </ol>
      <p>Run another scan after opening a dialog, menu, or tooltip. Content that was not rendered or active during the first scan needs its own check.</p>
      <Callout tone="warn">A quiet result for the initial page says nothing about an unopened component or a later error state.</Callout>
    </>,
  },
  {
    id: 'api', title: 'Use axe-core in code',
    lead: 'The JavaScript API returns a structured report for the current document.',
    body: <>
      <p>Install <code>axe-core</code> in the project that runs the test. After rendering the UI in a browser, call <code>axe.run(document)</code>. You can pass a selector or element instead to narrow the context.</p>
      <CodeBlock code={code.core} caption="axe-core in a browser test" />
      <p>The example prints each failed rule and its affected nodes. In an automated test, assert against <code>results.violations</code> and keep the details in the failure report so someone can reproduce the issue.</p>
      <Callout>This guide shows code as text. It does not load axe-core or scan its visitors.</Callout>
    </>,
  },
  {
    id: 'results', title: 'Read the results',
    lead: 'Four arrays tell you whether a rule passed, failed, needs review, or did not apply.',
    body: <>
      <div className="table-wrap"><table><thead><tr><th>Array</th><th>Meaning</th></tr></thead><tbody>{[
        ['violations', 'A rule found a definite failure on one or more nodes.'],
        ['incomplete', 'axe could not decide; a person needs to review these nodes.'],
        ['passes', 'A rule passed for the nodes it evaluated.'],
        ['inapplicable', 'No matching content was found for that rule.'],
      ].map(([name, text]) => <tr key={name}><td><code>{name}</code></td><td>{text}</td></tr>)}</tbody></table></div>
      <p>A violation includes an <code>id</code>, <code>impact</code>, <code>helpUrl</code>, and <code>nodes</code>. Each node supplies a <code>target</code> and usually a <code>failureSummary</code>. Impact helps with triage; it is not a substitute for understanding the actual user barrier.</p>
      <Callout tone="warn">Zero violations is not the same as zero accessibility problems. Check <code>incomplete</code> and perform human review.</Callout>
    </>,
  },
  {
    id: 'cypress', title: 'Add axe to Cypress',
    lead: 'cypress-axe runs the same engine at the points your end-to-end test chooses.',
    body: <>
      <p>For Cypress 10 or later, install the packages and import <code>cypress-axe</code> in <code>cypress/support/e2e.ts</code>. The earlier Cypress 9 integration used a different support-file path and the 0.x line of cypress-axe.</p>
      <CodeBlock code={code.install} caption="setup for Cypress 10+" lang="plain" />
      <p>Visit a page, call <code>cy.injectAxe()</code>, then call <code>cy.checkA11y()</code>. Injection must come after <code>cy.visit()</code> and before the check. By default, <code>checkA11y</code> evaluates the current document.</p>
      <Callout tone="tip">Keep the target local to your app under test. The old demo in this repository used a deployed URL; the examples here use <code>cy.visit('/')</code>.</Callout>
    </>,
  },
  {
    id: 'states', title: 'Test interactive states',
    lead: 'A scan sees what is rendered now, so a tooltip needs a check after it opens.',
    body: <>
      <p>The original demo tested a Material UI tooltip. A useful successor checks the initial page, focuses the icon button, waits for the tooltip to appear, and checks again. The icon button needs its own accessible name; a visual icon alone is not enough.</p>
      <CodeBlock code={code.cypress} caption="cypress/e2e/accessibility.cy.ts" />
      <p>Apply the same pattern to open menus and dialogs, expanded accordions, validation errors, and other states a visitor can reach. Test keyboard interaction separately as well.</p>
    </>,
  },
  {
    id: 'scope', title: 'Choose the scan scope',
    lead: 'A component-level check is useful while developing, but a full-page check still matters.',
    body: <>
      <p>Both <code>axe.run</code> and <code>cy.checkA11y</code> accept a context. A selector such as <code>#dialog</code> focuses the report on one rendered region.</p>
      <CodeBlock code={code.scope} caption="scoped checks" />
      <Callout tone="warn">Narrow scope can miss page-level relationships and surrounding context. Include whole-page checks in the test suite.</Callout>
    </>,
  },
  {
    id: 'fixes', title: 'Turn findings into fixes',
    lead: 'Use the reported rule and node to repair the interface, then verify the behavior.',
    body: <>
      <ol>
        <li>Open <code>helpUrl</code> for the rule and locate each <code>target</code> in the rendered page.</li>
        <li>Read <code>failureSummary</code> and decide which user-facing behavior is missing.</li>
        <li>Fix the markup or interaction. Prefer a real button, an explicit label, and meaningful alternative text where appropriate.</li>
        <li>Rerun axe and check the experience with keyboard and assistive technology.</li>
      </ol>
      <CodeBlock code={code.markup} caption="clear names and labels" lang="plain" />
      <p>For an icon-only action, the button name describes the action. A decorative icon can be hidden from the accessibility tree so it does not repeat or confuse the name.</p>
    </>,
  },
  {
    id: 'ci', title: 'Use it in CI',
    lead: 'Make key journeys repeatable and let definite violations fail the test.',
    body: <>
      <p>Add accessibility checks to tests that already visit important pages and interactions. Wait for the actual UI state before scanning, keep failure details visible, and rerun after changes to components used across the app.</p>
      <p>If a legacy page has many findings, track and fix them deliberately. Hiding rules or filtering all lower-impact issues just to make a build green reduces the value of the check.</p>
      <Callout tone="tip">Pair automated checks with a small manual checklist for each major journey.</Callout>
    </>,
  },
  {
    id: 'limits', title: 'What automation misses',
    lead: 'An automated scan is evidence about a page state, not a complete accessibility evaluation.',
    body: <>
      <p>A tool cannot judge every interaction or whether content makes sense. Test keyboard order and operation, focus management, spoken names and instructions, zoom and reflow, and real task completion with assistive technology where relevant.</p>
      <p>The W3C explains that evaluation tools can assist, but human judgment is required to determine whether a site is accessible. Treat <code>incomplete</code> as a review queue, not as a passing result.</p>
      <Callout tone="warn">Do not describe an application as “WCAG compliant” solely because axe reported no violations.</Callout>
    </>,
  },
  {
    id: 'mistakes', title: 'Common mistakes',
    lead: 'Most weak scans fail because of timing, scope, or an overconfident reading of the results.',
    body: <ul className="mistakes">{[
      ['Injecting before visiting.', 'cypress-axe needs the page to exist before it can inject axe-core.'],
      ['Checking only the first screen.', 'Open interactive states and rerun the scan.'],
      ['Treating zero violations as a pass for everything.', 'Review incomplete items and perform manual checks.'],
      ['Scanning only a tiny component.', 'Add whole-page checks to catch relationships outside it.'],
      ['Disabling a rule to silence CI.', 'Fix the underlying issue or document a narrowly justified exception.'],
    ].map(([mistake, why]) => <li key={mistake}><strong>{mistake}</strong> <span>{why}</span></li>)}</ul>,
  },
  {
    id: 'sources', title: 'Sources',
    lead: 'The details above come from the projects and accessibility guidance themselves.',
    body: <div className="sources">{[
      ['axe-core', [
        ['Project and rule overview', 'https://github.com/dequelabs/axe-core'],
        ['JavaScript API and result fields', 'https://github.com/dequelabs/axe-core/blob/develop/doc/API.md'],
        ['Rule descriptions', 'https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md'],
      ]],
      ['Tools and evaluation', [
        ['cypress-axe installation and commands', 'https://github.com/component-driven/cypress-axe/blob/master/README.md'],
        ['axe DevTools browser scans', 'https://docs.deque.com/devtools-for-web/4/en/devtools-scanning/'],
        ['W3C: what evaluation tools can and cannot do', 'https://www.w3.org/WAI/test-evaluate/tools/selecting/'],
      ]],
    ].map(([group, links]) => <div key={group as string}><h3>{group as string}</h3><ul>{(links as string[][]).map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noreferrer">{label}</a></li>)}</ul></div>)}</div>,
  },
]
