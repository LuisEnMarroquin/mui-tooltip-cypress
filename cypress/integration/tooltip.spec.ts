describe("My First Test", () => {
  beforeEach("Visit page where is running", () => {
    cy.visit("https://axe.pages.dev");
    cy.injectAxe();
  });

  it("Testing accessibility on open", () => {
    expect(true).to.equal(true);
    cy.checkA11y();
  });

  it("Testing tooltip accessibility", () => {
    cy.get('[data-testid="DeleteIcon"]').trigger("mouseover");
    cy.contains("DeleteText").should("be.visible");
    cy.checkA11y();
  });
});
