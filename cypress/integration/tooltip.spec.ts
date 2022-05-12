describe("My First Test", () => {
  beforeEach("Visit page where is running", () => {
    cy.visit("https://axe.pages.dev");
    // cy.visit("http://localhost:3000");
    cy.injectAxe();
  });

  it("Testing accessibility on open", () => {
    expect(true).to.equal(true);
    cy.checkA11y();
  });

  it("Testing tooltip accessibility default", () => {
    cy.get('[data-testid="DeleteIcon"]').trigger("mouseover");
    cy.contains("DeleteText").should("be.visible");
    cy.checkA11y();
  });

  it("Tooltip accessibility when color changes", () => {
    cy.get("button").contains("Add Class").trigger("click");

    cy.get('[data-testid="DeleteIcon"]').trigger("mouseover");
    cy.contains("ChangeText").should("be.visible");

    cy.checkA11y();
  });
});
