// describe("Course Catalog Smoke Tests", () => {
//   beforeEach("Visit course Catalog page", () => {
//     cy.visit("https://axe.pages.dev");
//   });
// });

describe("My First Test", () => {
  it("Does not do much!", () => {
    expect(true).to.equal(true);
    cy.visit("https://axe.pages.dev");
    cy.injectAxe();
    cy.checkA11y();
  });
});
