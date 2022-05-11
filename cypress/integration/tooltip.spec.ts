describe("My First Test", () => {
  beforeEach("Visit course Catalog page", () => {
    cy.visit("https://axe.pages.dev");
  });

  it("Does not do much!", () => {
    expect(true).to.equal(true);
    cy.injectAxe();
    cy.checkA11y();
  });
});
