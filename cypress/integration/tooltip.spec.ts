describe("My First Test", () => {
  beforeEach("Visit page where is running", () => {
    cy.visit("https://axe.pages.dev");
  });

  it("Testing accessibility on open", () => {
    expect(true).to.equal(true);
    cy.injectAxe();
    cy.checkA11y();
  });

  it("Testing tooltip accessibility", () => {
    cy.get('[data-testid="DeleteIcon"]').trigger("mouseover");
    // cy.wait(5000);
    cy.contains("DeleteText").should("be.visible");
    cy.injectAxe();
    cy.checkA11y();
  });
});
