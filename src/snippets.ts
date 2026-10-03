// These are examples shown as text. The guide does not load axe or Cypress.

export const SNIPPETS = {
  en: {
    install: `npm install --save-dev axe-core cypress cypress-axe

// cypress/support/e2e.ts
import 'cypress-axe'`,
    core: `import axe from 'axe-core'

// Run in the browser after the interface is rendered.
const results = await axe.run(document)

for (const violation of results.violations) {
  console.log(violation.id, violation.impact, violation.helpUrl)
  for (const node of violation.nodes) {
    console.log(node.target, node.failureSummary)
  }
}`,
    cypress: `describe('accessibility', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.injectAxe() // after visit, before checkA11y
  })

  it('checks the initial page and an open tooltip', () => {
    cy.checkA11y()
    cy.get('button[aria-label="Delete item"]').focus()
    cy.get('[role="tooltip"]').should('be.visible')
    cy.checkA11y()
  })
})`,
    scope: `// Scan one rendered region when working on a component.
cy.checkA11y('#dialog')

// The axe-core API accepts a selector as its context too.
const results = await axe.run('#dialog')`,
    markup: `<button type="button" aria-label="Delete item">
  <svg aria-hidden="true">...</svg>
</button>

<label for="email">Email</label>
<input id="email" type="email">`,
  },
  es: {
    install: `npm install --save-dev axe-core cypress cypress-axe

// cypress/support/e2e.ts
import 'cypress-axe'`,
    core: `import axe from 'axe-core'

// Ejecuta esto en el navegador cuando la interfaz ya esté renderizada.
const results = await axe.run(document)

for (const violation of results.violations) {
  console.log(violation.id, violation.impact, violation.helpUrl)
  for (const node of violation.nodes) {
    console.log(node.target, node.failureSummary)
  }
}`,
    cypress: `describe('accesibilidad', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.injectAxe() // después de visit y antes de checkA11y
  })

  it('revisa la página inicial y un tooltip abierto', () => {
    cy.checkA11y()
    cy.get('button[aria-label="Eliminar elemento"]').focus()
    cy.get('[role="tooltip"]').should('be.visible')
    cy.checkA11y()
  })
})`,
    scope: `// Revisa una región renderizada al trabajar en un componente.
cy.checkA11y('#dialog')

// La API de axe-core también acepta un selector como contexto.
const results = await axe.run('#dialog')`,
    markup: `<button type="button" aria-label="Eliminar elemento">
  <svg aria-hidden="true">...</svg>
</button>

<label for="email">Correo electrónico</label>
<input id="email" type="email">`,
  },
} as const
